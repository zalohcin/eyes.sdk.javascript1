module.exports = {
  spec: [
    // './test/coverage/generic/*.spec.js',
    '/Users/ep/Documents/eyes.sdk.javascript1/packages/sdk-coverage-tests/coverage-tests/custom/check-region-ie-11.spec.js',
  ],
  parallel: true,
  jobs: 15,
  timeout: 0,
  require: './test/util/hooks.js',
  reported: 'spec-xunit-file',
  grep: /^.*(\(@ie11\))?$/,
}
