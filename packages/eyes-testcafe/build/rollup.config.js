'use strict';

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('@joseph184/rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportPlugin = require('./wrapeAndExportPlugin');
const prepareForClientFunctionPlugin = require('./prepareForClientFunctionPlugin');

const inputFileName = '@applitools/dom-capture/src/browser/captureFrameAndPoll.js';

exports.input = inputFileName;
exports.output = {
  file: 'dist/captureFrameAndPoll.js',
  format: 'iife',
  name: 'captureFrameAndPoll',
};
exports.plugins = [
  builtins(),
  globals(),
  resolve({}),
  commonjs({ include: '../../node_modules/**', ignoreGlobal: true }),
  babel({
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          modules: false,
          corejs: 3,
        },
      ],
    ],
  }),
  prepareForClientFunctionPlugin,
  wrapeAndExportPlugin,
];
