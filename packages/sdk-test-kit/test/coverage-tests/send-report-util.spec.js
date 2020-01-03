const assert = require('assert')
const {hasPassed, makeSendReport} = require('../../src/coverage-tests/send-report-util')

const fakeErrors = [
  {name: 'Error', message: 'an error', testName: 'blah1', executionMode: {isCssStitching: true}},
  {name: 'Error', message: 'an error', testName: 'blah2', executionMode: {isVisualGrid: true}},
]

const fakeTestsRan = [
  {name: 'blah1', executionMode: {isCssStitching: true}},
  {name: 'blah2', executionMode: {isVisualGrid: true}},
  {name: 'blah3', executionMode: {isVisualGrid: true}},
]

describe('send-report-util', () => {
  it('hasPassed', () => {
    assert.deepStrictEqual(
      hasPassed(fakeErrors, fakeTestsRan[0].name, fakeTestsRan[0].executionMode),
      false,
    )
    assert.deepStrictEqual(
      hasPassed(fakeErrors, fakeTestsRan[1].name, fakeTestsRan[1].executionMode),
      false,
    )
    assert.deepStrictEqual(
      hasPassed(fakeErrors, fakeTestsRan[2].name, fakeTestsRan[2].executionMode),
      true,
    )
  })
  it('makeSendReport', () => {
    const expectedReportSchema = {
      sdk: 'js_selenium_4',
      group: 'selenium',
      sandbox: true,
      results: [
        {
          test_name: 'blah1',
          parameters: {
            browser: 'chrome',
            mode: 'css',
          },
          passed: false,
        },
        {
          test_name: 'blah2',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: false,
        },
        {
          test_name: 'blah3',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: true,
        },
      ],
    }
    assert.deepStrictEqual(
      makeSendReport({errors: fakeErrors, sdkName: 'eyes-selenium', testsRan: fakeTestsRan}),
      expectedReportSchema,
    )
  })
})
