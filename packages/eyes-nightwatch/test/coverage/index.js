const {initializeSdk, overrideTests} = require('@applitools/sdk-shared/coverage-tests/generic')
const testFrameworkTemplate = require('./nightwatch-template')

module.exports = {
  name: 'eyes-nightwatch',
  outPath: './test/generic',
  ext: '.spec.js',
  initializeSdk,
  testFrameworkTemplate,
  overrideTests: {
    ...overrideTests,
    'check region by native selector': {skip: true},
    'check region by selector on ie': {skip: true},
    'check window after manual scroll on safari 11': {skip: true},
    'check window after manual scroll on safari 12': {skip: true},
    'check window fully on android chrome emulator on mobile page': {skip: true},
    'check window fully on android chrome emulator on mobile page with horizontal scroll': {
      skip: true,
    },
    'check window fully on page with horizontal scroll with css stitching': {skip: true},
    'check window fully on page with horizontal scroll with scroll stitching': {skip: true},
  },
}
