const {getNameFromObject} = require('../common/util')

function convertExecutionModeToBareName(executionMode) {
  return getNameFromObject(executionMode)
    .replace(/^is/, '')
    .replace(/stitching$/i, '')
    .toLowerCase()
}

function convertSdkNameToReportName(sdkName) {
  switch (sdkName) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    default:
      throw 'Unsupported SDK'
  }
}

function hasPassed(errors, testName, executionMode) {
  return !(errors[testName] && !!errors[testName][getNameFromObject(executionMode)])
}

function makeSendReport({sdkName, testsRan, e}) {
  return {
    sdk: convertSdkNameToReportName(sdkName),
    group: 'selenium', // TODO: make dynamic
    sandbox: true, // TODO: make dynamic
    results: testsRan.map(test => {
      return {
        test_name: test.name,
        parameters: {
          browser: 'chrome',
          mode: convertExecutionModeToBareName(test.executionMode),
        },
        passed: hasPassed(e, test.name, test.executionMode),
      }
    }),
  }
}

module.exports = {
  makeSendReport,
}
