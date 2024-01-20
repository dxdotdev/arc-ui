import type { Importer } from 'sass'

export function getThemeInArgs(): { default: object } {
	const themeIndex = Bun.argv.findIndex((s) => s === '--theme' || s === '-t')
	const themeName =
		(themeIndex > 1 && Bun.argv[themeIndex + 1]) || 'default-dark'

	const isPath = themeName.endsWith('.toml')
	const themePath = isPath ? themeName : `themes/${themeName}.toml`

	try {
		return require(`../${themePath}`)
	} catch {
		throw `Error finding or parsing file "${themePath}"!`
	}
}

function generateSassVariables(json: object): string {
	let result = ''

	for (const child in json) {
		const childValue = json[child]

		if (typeof childValue !== 'object') {
			result += `${child}: ${childValue};\n`
		} else {
			const moreChilds = generateSassVariables(childValue).split('\n')

			for (const secondChild of moreChilds)
				if (secondChild !== '') result += `${child}-${secondChild}\n`
		}
	}

	return result
}

export function themeToSass(theme: { default: object }) {
	let variables = ''

	for (const variable of generateSassVariables(theme.default).split('\n'))
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
