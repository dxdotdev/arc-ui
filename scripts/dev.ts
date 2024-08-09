import { homedir } from 'node:os'
import clipboard from 'clipboardy'
import watch from 'glob-watcher'
import { highlight } from 'cli-highlight'

import { info, error, build, autoReloadCode } from './utils'

console.log()
info('check', 'Checking data to start watching...')

try {
  const profilesConfig = await Bun.file(
    `${homedir()}/.mozilla/firefox/profiles.ini`,
  ).text()

  const pathLine = profilesConfig.split('\n').find((s) => s.startsWith('Path='))
  const userFolder = pathLine?.split('=')[1]
  const userChromeCssPath = `${homedir()}/.mozilla/firefox/${userFolder}/chrome/userChrome.css`

  info('check', `UserChrome.css file path: ${userChromeCssPath}`)

  let watcher = watch(['src/**/*.css'])

  info(
    'watch',
    'Watching for file changes! Paste this command into Firefox Browser Toolbox to enable the updater (Ctrl+Alt+Shift+I):',
  )

  console.log(highlight(autoReloadCode, { language: 'javascript' }))

  try {
    clipboard.writeSync(autoReloadCode)
    info('clipboard', 'Copied code to clipboard!')
  } catch (err) {
    error("Can't to copy code to clipboard:", err)
  }

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
    watcher = watch(['src/**/*.css'])

    info('watch', 'Change detected')
    build(userChromeCssPath)
  })
} catch (err) {
  error('Got error:', err)
}
