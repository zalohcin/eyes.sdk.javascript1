const {findUnsupportedTests} = require('../cli-util')

function doHealthCheck(sdkImplementation) {
  console.log('Performing health check...\n')
  const unsupportedTests = findUnsupportedTests(sdkImplementation)
  if (unsupportedTests.length) {
    console.log('Unsupported tests found:')
    unsupportedTests.forEach(test => console.log(`- ${test}`))
    console.log('')
  }

  if (!unsupportedTests.length) console.log('Looks good to me.')
}

module.exports = {
  doctor: doHealthCheck,
}
