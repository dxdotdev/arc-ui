import { compile } from 'sass'
import { info, error, themeToSass, getThemeFromArgs } from './utils'

console.log()
info('check', 'Getting data to start building...')

try {
  const theme = getThemeFromArgs()

  const buildResult = compile('src/main.scss', {
    importers: [themeToSass(theme)],
  })

  Bun.write('userChrome.css', buildResult.css)
  info('build', `output: "userChrome.css"`)

  info('build', 'Complete!')
  console.log()
} catch (err) {
  error('Got error:')
  console.log(`\n${err}\n`)
}
