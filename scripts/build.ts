import { compile } from 'sass'
import { getThemeInArgs, themeToSass } from './utils'

const theme = getThemeInArgs()

const buildResult = compile('src/main.scss', {
	importers: [themeToSass(theme)],
})

Bun.write('userChrome.css', buildResult.css)
