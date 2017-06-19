const cheerio = require('cheerio')
const compiler = require('../')
const css = require('css')
const fs = require('fs')
const path = require('path')
const test = require('tape')

const fixture = fs.readFileSync(path.join(__dirname, 'Fixture.fig')).toString()

test('compiler', t => {
	const compiled = compiler(fixture)

	t.test('name', t => {
		t.equal(typeof compiled.name, 'string', 'is a string')

		t.equal(compiled.name, 'super-component')

		t.end()
	})

	t.test('template', t => {
		t.equal(typeof compiled.template, 'function', 'is a function')

		const locals = { msg: 'hello world' }
		const rendered = compiled.template(locals)
		const $ = cheerio.load(rendered)

		t.test('renders correctly', t => {
			t.equal($('h1').text(), 'hello world')
			t.equal($('button#thing').text(), 'foo')
			t.equal($('label').text(), 'bar')
			t.equal($('section.footer').text(), 'bye')

			t.end()
		})

		t.end()
	})

	t.test('style', t => {
		t.equal(typeof compiled.style, 'string', 'is a string')

		const ast = css.parse(compiled.style)
		const rules = ast.stylesheet.rules

		t.test('renders correctly', t => {
			// h1 { color: red; }
			t.deepEqual(rules[0].selectors, ['h1'])
			t.equal(rules[0].declarations[0].property, 'color')
			t.equal(rules[0].declarations[0].value, 'red')

			// button { border: 2px dashed black; }
			t.deepEqual(rules[1].selectors, ['button'])
			t.equal(rules[1].declarations[0].property, 'border')
			t.equal(rules[1].declarations[0].value, '2px dashed black')

			// label, .section { font-size: 0.5em; }
			t.deepEqual(rules[2].selectors, ['label', '.section'])
			t.equal(rules[2].declarations[0].property, 'font-size')
			t.equal(rules[2].declarations[0].value, '0.5em')

			// exactly 3 rules
			t.equal(rules.length, 3)

			t.end()
		})

		t.end()
	})

	t.test('script', t => {
		t.equal(typeof compiled.script, 'string', 'is a string')

		t.test('renders correctly', t => {
			const Module = module.constructor
			const m = new Module()
			m._compile(compiled.script, '')

			// exported default function
			const fn = m.exports.default

			const view = {}
			fn(view, {}, {})

			t.equal(view.msg, 'today is a great day!')
			t.equal(typeof view.clicked, 'function')

			// other exports
			t.equal(m.exports.foo, 'bar')
			t.equal(m.exports.baz, 'loo')

			t.end()
		})

		t.end()
	})

	t.end()
})
