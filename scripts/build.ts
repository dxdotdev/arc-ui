import { compile } from 'sass'

// theme parsing
const themeIndex = Bun.argv.findIndex((s) => s === '--theme' || s === '-t')
const themeName = (themeIndex > 1 && Bun.argv[themeIndex + 1]) || 'default-dark'

const isPath = themeName.endsWith('.toml')
const themePath = isPath ? themeName : `themes/${themeName}.toml`

let theme

try {
	theme = require(`../${themePath}`)
} catch {
	throw `Error finding or parsing file "${themePath}"!`
}

// json to sass
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

let variables = ''

for (const variable of generateSassVariables(theme.default).split('\n'))
	if (variable !== '') variables += `$theme-${variable}\n`

// build sass
const buildResult = compile('src/main.scss', {
	importers: [
		{
			canonicalize(url) {
				if (url !== 'theme:colors') return null
				return new URL(url)
			},

			load(_) {
				return {
					contents: variables,
					syntax: 'scss',
				}
			},
		},
	],
})

Bun.write('userChrome.css', buildResult.css)
