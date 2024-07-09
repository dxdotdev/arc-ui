import { homedir } from 'node:os'
import watch from 'glob-watcher'
import { highlight } from 'cli-highlight'

import { info, error, build } from './utils'

console.log()
info('check', 'Checking data to start watching...')

try {
  const profilesConfig = await Bun.file(
    `${homedir()}/.mozilla/firefox/profiles.ini`,
  ).text()

  const pathLine = profilesConfig.split('\n').find((s) => s.startsWith('Path='))
  const userFolder = pathLine?.split('=')[1]
  const userChromeCssPath = `${homedir()}/.mozilla/firefox/${userFolder}/chrome/userChrome.css`

  let watcher = watch(['src/**/*.css'])

  info(
    'watch',
    'Watching for file changes! Paste this command into Firefox Browser Toolbox to enable the updater:',
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
  }

  let userChromeCssUpdater = setInterval(updateUserChromeCss, 2500);\n`,
      { language: 'javascript' },
    ),
  )

  info('watch', 'To stop the updater, run:')
  console.log(
    highlight('  clearInterval(userChromeCssUpdater)', {
      language: 'javascript',
    }),
  )
  console.log()

  info('watch', 'Change detected')
  build(userChromeCssPath)

  watcher.on('change', () => {
    watcher = watch(['src/**/*.scss'])

    info('watch', 'Change detected')
    build(userChromeCssPath)
  })
} catch (err) {
  error('Got error:')
  console.log(`\n${err}\n`)
}
