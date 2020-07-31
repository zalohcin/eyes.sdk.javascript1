module.exports = {
  spec: [
    './test/coverage/generic/*.spec.js',
    '../sdk-shared/coverage-tests/custom/**.spec.js',
  ],
  parallel: true,
  jobs: 15,
  timeout: 0,
  reported: 'spec-xunit-file',
  grep: /^[\w\s]*?(\((?:@(webdriver|mobile|native|native-selectors|chrome|firefox|ie|ie|edge|safari|safari) ?)+\))?$/,
}
