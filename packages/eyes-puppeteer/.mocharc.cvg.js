const tags = ['chrome', 'chromium']
module.exports = {
  spec: [
    './test/generic/*.spec.js',
    //'../sdk-shared/coverage-tests/custom/**/*.spec.js',
  ],
  parallel: true,
  jobs: 10,
  timeout: 0,
  reporter: 'spec-xunit-file',
  //require: ['../sdk-shared/coverage-tests/util/mocha-hooks.js'],
  grep: new RegExp(`^[\\w\\s]*?(\\((?:@(${tags.join('|')}) ?)+\\))?$`)
}
