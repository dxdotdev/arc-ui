import { color, label } from '@astrojs/cli-kit'
import { bundle } from 'lightningcss'

export function time(): string {
  return new Date().toLocaleTimeString()
}

export function info(title: string, text: string) {
  console.log(
    `${time()}${label(`[${title}]`, color.visible, color.blue)}${text}`,
  )
}

export function error(text: string, error: unknown) {
  console.log(`${time()}${label('[error]', color.visible, color.red)}${text}`)
  console.log(`\n${error}\n`)
}

export function build(path: string) {
  try {
    const { code } = bundle({
      filename: './src/index.css',
      minify: true,
    })

    Bun.write(path, code)
  } catch (err) {
    error('Got error:', err)
  }
}

export const autoReloadCode = `
  let io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  let ss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
  let ds = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);

  let chromepath = ds.get("UChrm", Ci.nsIFile);
  chromepath.append("userChrome.css");
  let chromefile = io.newFileURI(chromepath);

  function updateUserChromeCss() {
    if (ss.sheetRegistered(chromefile, ss.USER_SHEET))
      ss.unregisterSheet(chromefile, ss.USER_SHEET);

    ss.loadAndRegisterSheet(chromefile, ss.USER_SHEET);
  }

  let userChromeCssUpdater = setInterval(updateUserChromeCss, 2500);\n`
