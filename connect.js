/* A
const fig = require('fig-compiler/connect')

app.use(fig('components'))

localhost:3000/Component.fig
*/

const fs = require('fs')
const path = require('path')
const {parse} = require('url')

const compiler = require('./')

// Match any fools trying the path travelsal thing
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

module.exports = root => {
	if (!root) {
		return new TypeError('root must be specified')
	}

	if (typeof root !== 'string') {
		return new TypeError('root must be a string')
	}

	return (req, res) => {
		const url = parse(req.url).pathname
		if (UP_PATH_REGEXP.test(url)) {
			return res.status(403).end()
		}

		const p = path.join(root, url)
		if (!fs.existsSync(p)) {
			return res.status(404).end()
		}

		const compiled = compiler(fs.readFileSync(p).toString())

		const exported = (name, str = '', quoted = true) => {
			const p = 'module.exports.' + name + ' = '

			if (str === null) {
				return p + 'null;'
			} else if (quoted) {
				const val = str.split('\n')
					.map(x => ('\'' + x + '\''))
					.join('+\n')
				return p + val + ';\n'
			}
			return p + str + ';\n'
		}

		const r = []
		r.push(exported('template', compiled.template.toString(), false))
		r.push(exported('style', compiled.style))
		r.push(exported('name', compiled.name))
		r.push(compiled.script)

		res.end(r.join('\n'))
	}
}
