import vm from 'vm'

import express from 'express'
import request from 'supertest'
import test from 'ava'

import fig from '../connect'

test.cb(t => {
	const app = express()

	app.use(fig('test/fixtures'))

	request(app)
		.get('/Simple.fig')
		.expect(200)
		.then(res => {
			const str = res.text

			const script = new vm.Script(str)
			const module = {
				exports: {}
			}
			const sandbox = {
				module,
				exports: module.exports
			}
			script.runInContext(vm.createContext(sandbox))

			t.is(typeof sandbox.exports.name, 'string')
			t.is(typeof sandbox.exports.template({heck: 42}), 'string')
			t.is(typeof sandbox.exports.style, 'string')
			t.is(typeof sandbox.exports.default, 'function')

			t.end()
		})
		.catch(err => {
			t.fail(err)
		})
})
