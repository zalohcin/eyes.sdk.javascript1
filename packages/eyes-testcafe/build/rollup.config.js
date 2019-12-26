'use strict'

const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const builtins = require('@joseph184/rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const polyfill = require('rollup-plugin-polyfill');
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
    name: fileName
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
  ]
}

const domCaptureForIEConfig = {
  input: inputFileName,
  output: {
    file: `dist/${fileNameIE}.js`,
    format: 'iife',
    name: fileNameIE
  },
  plugins:[
    polyfill(
      ['core-js/stable', 'regenerator-runtime/runtime', 'url-polyfill', 'whatwg-fetch'],
      { method: 'require' },
    ),
    resolve({}),
    commonjs({include: '**', ignoreGlobal: true}),
    builtins(),
    globals(),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {ie: 10}
          }
        ]
      ]
    }),
    prepareForClientFunctionPlugin(fileNameIE),
    wrapeAndExportPlugin(fileNameIE),
  ]
}

module.exports = [domCaptureConfig, domCaptureForIEConfig]