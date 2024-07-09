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

export function error(text: string) {
  console.log(`${time()}${label('[error]', color.visible, color.red)}${text}`)
}

export function build(path: string) {
  const { code } = bundle({
    filename: './src/index.css',
    minify: true,
  })

  Bun.write(path, code)
}
