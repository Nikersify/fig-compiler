const pug = require('pug')

module.exports = (input, opts = {}) => {
	const res = {}

	const lines = input.split('\n')

	const tagContent = tag => {
		let index = lines.findIndex(x => x.indexOf(tag) === 0)
		if (index === -1) return ''
		index += 1

		const endIndex = lines.slice(index)
			.findIndex(x => /^\S/.test(x))

		const content = (endIndex !== -1) ?
			lines.slice(index, index + endIndex) :
			lines.slice(index)

		// slice off leading indentation if needed
		if (content.length) {
			const indentIndex = content[0].search(/\S/)
			content.forEach((x, i) => {
				content[i] = x.slice(indentIndex)
			})
		}

		content.unshift(lines[index - 1].slice(tag.length + 1))

		return content.join('\n').trim()
	}

	// template
	const compiled = pug.compileClient(tagContent('template'), {
		debug: !!opts.debug,
		compileDebug: !!opts.debug
	})

	// wrap string of pug & its runtime into a function
	res.template = Function('locals',
		compiled + '\n' + 'return template(locals);')

	// style
	res.style = tagContent('style').split('\n').join('').split('\t').join('')

	// script
	res.script = tagContent('script')

	// name
	res.name = tagContent('label') || opts.defaultName

	return res
}
