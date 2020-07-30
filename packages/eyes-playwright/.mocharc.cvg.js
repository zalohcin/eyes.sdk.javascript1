module.exports = {
  spec: [
    './test/coverage/generic/*.spec.js',
    '../sdk-coverage-tests/coverage-tests/custom/**.spec.js',
  ],
  parallel: true,
  jobs: 15,
  timeout: 0,
  require: './test/util/hooks.js',
  reported: 'spec-xunit-file',
  grep: /^[\w\s]*?(\((?:@(chrome|chromium|firefox|webkit|safari) ?)+\))?$/,
}
