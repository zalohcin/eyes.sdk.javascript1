const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const replace = require('rollup-plugin-replace');
const wrapBundle = require('./src/wrapBundle');
const babel = require('rollup-plugin-babel');
const polyfill = require('rollup-plugin-polyfill');
const ignore = require('rollup-plugin-ignore');
const addVersionPrefix = require('./src/addVersionPrefix');
const {version} = require('./package.json');

const processPage = config({
  inputFileName: 'src/browser/processPage.js',
  outputFileName: 'processPage',
});
const processPageCJS = config({
  inputFileName: 'src/browser/processPage.js',
  outputFileName: 'processPageCjs',
  type: 'cjs',
});
const processPageAndSerialize = config({
  inputFileName: 'src/browser/processPageAndSerialize.js',
  outputFileName: 'processPageAndSerialize',
});
const processPageAndSerializeForIE = config({
  inputFileName: 'src/browser/processPageAndSerialize.js',
  outputFileName: 'processPageAndSerializeForIE',
  usePolyfillAndBabel: true,
});
const processPageAndSerializePoll = config({
  inputFileName: 'src/browser/processPageAndSerializePoll.js',
  outputFileName: 'processPageAndSerializePoll',
});
const processPageSerializePollForIE = config({
  inputFileName: 'src/browser/processPageAndSerializePoll.js',
  outputFileName: 'processPageAndSerializePollForIE',
  usePolyfillAndBabel: true,
});

module.exports = [
  processPage,
  processPageCJS,
  processPageAndSerialize,
  processPageAndSerializeForIE,
  processPageAndSerializePoll,
  processPageSerializePollForIE,
];

function config({inputFileName, outputFileName, type = 'iife', usePolyfillAndBabel}) {
  return {
    input: inputFileName,
    output: {
      file: `dist/${outputFileName}.js`,
      format: type,
      name: outputFileName,
    },
    plugins: [
      usePolyfillAndBabel
        ? polyfill(inputFileName, ['core-js/stable', 'url-polyfill', 'whatwg-fetch'], {
            method: 'commonjs',
          })
        : undefined,
      json(),
      ignore(['source-map', 'source-map-resolve']),
      resolve({browser: true}),
      commonjs({include: '../../**', ignoreGlobal: true}),
      builtins(),
      globals(),
      replace({
        include: 'src/browser/processPage.js',
        DOM_SNAPSHOT_SCRIPT_VERSION_TO_BE_REPLACED: version,
      }),
      usePolyfillAndBabel
        ? babel({
            exclude: [
              'node_modules/core-js/**',
              'node_modules/url-polyfill/**',
              'node_modules/whatwg-fetch/**',
              'node_modules/rollup-*/**',
            ],
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  targets: {ie: 10},
                },
              ],
            ],
          })
        : undefined,
      type === 'iife' ? wrapBundle(outputFileName) : undefined,
      addVersionPrefix(outputFileName),
    ],
  };
}
