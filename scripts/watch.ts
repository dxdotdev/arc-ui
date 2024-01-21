import { homedir, platform } from 'os'
import { compile } from 'sass'
import watch from 'glob-watcher'
const highlight = require('cli-highlight').highlight

import { getThemeInArgs, themeToSass } from './utils'

const theme = getThemeInArgs()
let userChromeCssPath: string

if (platform() === 'linux') {
  const profilesConfig = await Bun.file(
    `${homedir()}/.mozilla/firefox/profiles.ini`,
  ).text()

  const pathLine = profilesConfig.split('\n').find((s) => s.startsWith('Path='))
  const userFolder = pathLine?.split('=')[1]
  userChromeCssPath = `${homedir()}/.mozilla/firefox/${userFolder}/chrome/userChrome.css`

  if (!userFolder || !(await Bun.file(userChromeCssPath).exists())) {
    throw `Error while searching for userChrome.css in "${userChromeCssPath}"`
  }
} else {
  throw `Error searching for userChrome.css in platform "${platform()}"`
}

const watcher = watch(['themes/*.toml', 'src/**/*.scss'])

watcher.on('change', () => {
  try {
    const buildResult = compile('src/main.scss', {
      importers: [themeToSass(theme)],
    })

    Bun.write(userChromeCssPath, buildResult.css)
  } catch (error) {
    console.log(error)
  }
})

console.log(
  'Watching for changes! Paste this command into Firefox Debugger to enable updater:',
)
console.log(
  highlight(
    `
  let io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  let ss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
  let ds = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);

  let chromepath = ds.get("UChrm", Ci.nsIFile);
  chromepath.append("userChrome.css");
  let chromefile = io.newFileURI(chromepath);

  function updateUserChromeCss() {
    try {
      if (ss.sheetRegistered(chromefile, ss.USER_SHEET)) {
        ss.unregisterSheet(chromefile, ss.USER_SHEET);
      }

      ss.loadAndRegisterSheet(chromefile, ss.USER_SHEET);
    } catch {
      throw "Error updating userChrome.css file!"
    }
  }\n`,
    { language: 'javascript' },
  ),
)

console.log('To start the updater, run:')
console.log(
  highlight(
    '  let userChromeCssUpdater = setInterval(updateUserChromeCss, 2500)\n',
    { language: 'javascript' },
  ),
)

console.log('To stop the updater, run:')
console.log(
  highlight('  clearInterval(userChromeCssUpdater)', {
    language: 'javascript',
  }),
)
