const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const replace = require('rollup-plugin-replace');
const wrapBundle = require('./src/wrapBundle');
const babel = require('rollup-plugin-babel');
const polyfill = require('rollup-plugin-polyfill');
const addVersionPrefix = require('./src/addVersionPrefix');
const {version} = require('./package.json');

const captureDomConfig = config({
  inputFileName: 'src/browser/captureFrame.js',
  outputFileName: 'captureDom',
});
const captureDomCjsConfig = config({
  inputFileName: 'src/browser/captureFrame.js',
  outputFileName: 'captureDomCjs',
  type: 'cjs',
});
const captureDomAndPollConfig = config({
  inputFileName: 'src/browser/captureFrameAndPoll.js',
  outputFileName: 'captureDomAndPoll',
});
const captureDomForIEConfig = config({
  inputFileName: 'src/browser/captureFrame.js',
  outputFileName: 'captureDomForIE',
  usePolyfillAndBabel: true,
});
const captureDomAndPollForIEConfig = config({
  inputFileName: 'src/browser/captureFrameAndPoll.js',
  outputFileName: 'captureDomAndPollForIE',
  usePolyfillAndBabel: true,
});

module.exports = [
  captureDomConfig,
  captureDomCjsConfig,
  captureDomAndPollConfig,
  captureDomForIEConfig,
  captureDomAndPollForIEConfig,
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
        ? polyfill(
            inputFileName,
            [
              'core-js/stable',
              'regenerator-runtime/runtime',
              'url-polyfill',
              'whatwg-fetch',
              'abortcontroller-polyfill',
            ],
            {
              method: 'commonjs',
            },
          )
        : undefined,
      resolve({}),
      commonjs({include: '**', ignoreGlobal: true}),
      builtins(),
      globals(),
      replace({
        include: 'src/browser/captureFrame.js',
        DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED: version,
      }),
      usePolyfillAndBabel
        ? babel({
            exclude: 'node_modules/**',
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
