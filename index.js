const pug = require('pug')

module.exports = (input, opts = {}) => {
	const res = {}

	const lines = input.split('\n')

	const tagContent = tag => {
		let index = lines.findIndex(x => x.indexOf(tag) === 0)
		if (index === -1) {
			return ''
		}
		index += 1

		const endIndex = lines.slice(index)
			.findIndex(x => /^\S/.test(x))

		const content = (endIndex === -1) ?
			lines.slice(index) :
			lines.slice(index, index + endIndex)

		// Slice off leading indentation if needed
		if (content.length > 0) {
			const indentIndex = content[0].search(/\S/)
			content.forEach((x, i) => {
				content[i] = x.slice(indentIndex)
			})
		}

		content.unshift(lines[index - 1].slice(tag.length + 1))

		return content.join('\n').trim()
	}

	// Template
	const compiled = pug.compileClient(tagContent('template'), {
		debug: Boolean(opts.debug),
		compileDebug: Boolean(opts.debug)
	})

	// Wrap string of pug & its runtime into a function
	res.template = Function('locals', // eslint-disable-line no-new-func
		compiled + '\nreturn template(locals);')

	// Style
	res.style = tagContent('style').split('\n').join('').split('\t').join('')

	// Script
	res.script = tagContent('script')

	// Name
	res.name = tagContent('label') || opts.defaultName

	return res
}
