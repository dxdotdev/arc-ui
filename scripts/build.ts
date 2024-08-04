import { info, error, build } from './utils'

console.log()
info('check', 'Getting data to start building...')

try {
  build('userChrome.css')
  info('build', `output: "userChrome.css"`)

  info('build', 'Complete!')
  console.log()
} catch (err) {
  error('Got error:')
  console.log(`\n${err}\n`)
}
