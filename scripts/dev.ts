import { watch } from 'node:fs'
import { homedir } from 'node:os'
import { highlight } from 'cli-highlight'
import clipboard from 'clipboardy'

import { autoReloadCode, build, error, info } from './utils'

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

  let changeCounter = 0

  watch(
    import.meta.dir.replace('/scripts', '/src'),
    { recursive: true },
    () => {
      if (changeCounter === 0) {
        info('watch', 'Change detected')
        build(userChromeCssPath)

        changeCounter++
        return
      }

      changeCounter = 0
    },
  )
} catch (err) {
  error('Got error:', err)
}
