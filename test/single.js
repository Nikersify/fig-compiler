// bunch of small tests, mostly checking for unwelcome exceptions

import test from 'ava'
import compiler from '../'

test('empty template', t => {
	const fixture = ''
	const c = compiler(fixture)

	t.is(c.template({}), '')
	t.is(c.style, '')
	t.is(c.script, '')
	t.is(c.name, undefined)
})

test('only label', t => {
	const fixture = 'label comp'
	const c = compiler(fixture)

	t.is(c.template({}), '')
	t.is(c.style, '')
	t.is(c.script, '')
	t.is(c.name, 'comp')
})

test('only style', t => {
	const fixture = `style
	.head { display: none; }`
	const c = compiler(fixture)

	t.is(c.template({}), '')
	t.is(c.style, '.head { display: none; }')
	t.is(c.script, '')
	t.is(c.name, undefined)
})

test('only script', t => {
	const fixture = `script
	console.log('good morning')`
	const c = compiler(fixture)

	t.is(c.template({}), '')
	t.is(c.style, '')
	t.is(c.script, 'console.log(\'good morning\')')
	t.is(c.name, undefined)
})

test('only template', t => {
	const fixture = `template
	h1= hello`
	const c = compiler(fixture)

	t.is(c.template({}), '<h1></h1>')
	t.is(c.template({ hello: 'hi' }), '<h1>hi</h1>')
	t.is(c.script, '')
	t.is(c.name, undefined)
})
