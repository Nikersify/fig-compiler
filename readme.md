# fig-compiler ![stability](https://img.shields.io/badge/stability-experimental-orange.svg)
> [fig.js](http://github.com/nikersify/fig) component compiler

[![npm](https://img.shields.io/npm/v/fig-compiler.svg)](https://www.npmjs.com/package/fig-compiler)
[![travis](https://travis-ci.org/Nikersify/fig-compiler.svg?branch=master)](https://travis-ci.org/Nikersify/fig-compiler)

# usage

## api

### `obj = compiler(input[, opts])`

Where `input` is a string a of fig component. Available options for the `opts` object are as follows:

- `opts.defaultName` - name set for the component, if the `label` is missing on the component
- `opts.debug` - if set to `true` passes `debug` and `compileDebug` to [pug](https://pugjs.org/api/reference.html), tldr: if `false` output is smaller, at the cost of some pretty error messages

Returns an `obj` which has a few properties:

- `obj.template` - a function compiled by pug that takes a locals object and spits out HTML when asked to
- `obj.style` - just a string containing the contents of the style tag inside the component
- `obj.script` - string of code which just so happens to be ran through `babel` with the `es-2015` preset for your dearest convenience.
- `obj.name` - name of the component, taken from the `label` tag, or `opts.defaultName` if that doesn't exist. Otherwise `undefined`


# install

`npm install fig-compiler`

# license

MIT

# related

- [fig.js](https://github.com/nikersify/fig) - experimental front-end ui framework
- [figify](https://github.com/nikersify/figify) - fig.js browserify transform
- [fig-web](https://github.com/nikersify/fig-web) - fig.js website
