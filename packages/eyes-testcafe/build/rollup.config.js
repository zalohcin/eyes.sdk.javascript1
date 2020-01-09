'use strict'

const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const builtins = require('@joseph184/rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const polyfill = require('rollup-plugin-polyfill')
const wrapeAndExportPlugin = require('./wrapeAndExportPlugin')
const prepareForClientFunctionPlugin = require('./prepareForClientFunctionPlugin')

const inputFileName = '@applitools/dom-capture/src/browser/captureFrameAndPoll.js'
const fileName = 'captureFrameAndPoll'
const fileNameIE = 'captureFrameAndPollForIE'

const domCaptureConfig = {
  input: inputFileName,
  output: {
    file: `dist/${fileName}.js`,
    format: 'iife',
    name: fileName,
  },
  plugins: [
    builtins(),
    globals(),
    resolve({}),
    commonjs({include: '../../node_modules/**', ignoreGlobal: true}),
    babel({
      plugins: [
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-regenerator',
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: false,
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: false,
          },
        ],
      ],
      runtimeHelpers: true,
    }),
    prepareForClientFunctionPlugin(fileName),
    wrapeAndExportPlugin(fileName),
  ],
}

const domCaptureForIEConfig = {
  input: inputFileName,
  output: {
    file: `dist/${fileNameIE}.js`,
    format: 'iife',
    name: fileNameIE,
  },
  plugins: [
    // IE polyfill
    polyfill(['core-js/stable', 'regenerator-runtime/runtime', 'url-polyfill', 'whatwg-fetch'], {
      method: 'require',
    }),
    // For using third party modules in node_modules
    resolve({}),
    // CommonJS modules to ES6 (need it for resolve)
    commonjs({include: '../../node_modules/**', ignoreGlobal: true}),
    // Allow requiring node globals
    builtins(),
    // Add node globals like process etc
    globals(),
    // Testcafe limitations, async/await/genertaors
    babel({
      plugins: [
        '@babel/plugin-transform-spread',
        '@babel/plugin-transform-regenerator',
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: false,
            corejs: false,
            helpers: false,
            regenerator: true,
            useESModules: false,
          },
        ],
      ],
      runtimeHelpers: true,
    }),
    // More Testcafe limitations
    prepareForClientFunctionPlugin(fileNameIE),
    // Function structure
    wrapeAndExportPlugin(fileNameIE),
  ],
}

module.exports = [domCaptureConfig, domCaptureForIEConfig]
