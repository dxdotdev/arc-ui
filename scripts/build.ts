import { compile } from 'sass'

// theme parsing
const theme_index = Bun.argv.findIndex((s) => s === '--theme' || s === '-t')
const theme_name =
	(theme_index > 1 && Bun.argv[theme_index + 1]) || 'default-dark'

const is_path = theme_name.endsWith('.toml')
const theme_path = is_path ? theme_name : `themes/${theme_name}.toml`

let theme

try {
	theme = require(`../${theme_path}`)
} catch {
	throw `Error finding or parsing file "${theme_path}"!`
}

// json to sass
function generateSassVariables(json: object): string {
	let result = ''

	for (const child in json) {
		const child_value = json[child]

		if (typeof child_value !== 'object') {
			result += `${child}: ${child_value};\n`
		} else {
			const more_childs = generateSassVariables(child_value).split('\n')

			for (const second_child of more_childs)
				if (second_child !== '') result += `${child}-${second_child}\n`
		}
	}

	return result
}

let variables = ''

for (const variable of generateSassVariables(theme.default).split('\n'))
	if (variable !== '') variables += `$theme-${variable}\n`

// build sass
const build_result = compile('src/main.scss', {
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

Bun.write('userChrome.css', build_result.css)
