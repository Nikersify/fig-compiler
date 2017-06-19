const pug = require('pug')
const babel = require('babel-core')

module.exports = (input, opts) => {
	const res = {}

	const lines = input.split('\n')

	const tagContent = tag => {
		let index = lines.findIndex(x => x.indexOf(tag) === 0)
		if (index === -1) return null
		index += 1

		let endIndex = lines.slice(index)
			.findIndex(x => /^\S/.test(x))

		let content
		if (endIndex !== -1)
			content = lines.slice(index, index + endIndex)
		else
			content = lines.slice(index)

		const indentIndex = content[0].search(/\S/)
		return content.map(x => x.slice(indentIndex)).join('\n')
	}

	// template
	res.template = pug.compileClient(tagContent('template'))

	// style
	res.style = tagContent('style').split('\n').join('').split('\t').join('')

	// script
	const scriptContent = tagContent('script')
	const transformed = babel.transform(scriptContent, {
		presets: require('babel-preset-es2015')
	})
	res.script = transformed.code

	// name
	res.name = opts.defaultName

	return res
}
