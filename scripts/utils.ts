import type { Importer } from 'sass'

import { color, label } from '@astrojs/cli-kit'

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

export function getThemeFromArgs(): object {
  const tIndex = Bun.argv.findIndex((s) => s === '--theme' || s === '-t') + 1
  const themePath =
    (tIndex > 2 && Bun.argv[tIndex]) || 'themes/default-dark.toml'

  info('check', `theme path: "${themePath}"`)

  return require(`../${themePath}`).default
}

function objectToSassVariables(json: object): string {
  let result = ''

  for (const child in json) {
    const childValue = json[child]
    const childInKebabCase = child.replaceAll('_', '-')

    if (typeof childValue !== 'object') {
      result += `${childInKebabCase}: ${childValue};\n`
    } else {
      const moreChilds = objectToSassVariables(childValue).split('\n')

      for (const secondChild of moreChilds)
        if (secondChild !== '') result += `${childInKebabCase}-${secondChild}\n`
    }
  }

  return result
}

export function themeToSass(theme: object) {
  let variables = ''

  for (const variable of objectToSassVariables(theme).split('\n'))
    if (variable !== '') variables += `$theme-${variable}\n`

  return {
    canonicalize(url: string): URL | null {
      if (url !== 'theme:colors') return null
      return new URL(url)
    },

    load(_: URL) {
      return {
        contents: variables,
        syntax: 'scss',
      }
    },
  } as Importer
}
