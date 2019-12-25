const assert = require('assert')
const {sendReport} = require('../../src/coverage-tests/send-report')

describe('send-report', async () => {
  it.skip('should send a payload and get a 200 response from the report server', async () => {
    const result = await sendReport({
      sdk: 'js_selenium_4',
      group: 'selenium',
      sandbox: true,
      results: [
        {
          test_name: 'TestCheckRegion',
          parameters: {
            browser: 'chrome',
            mode: 'css',
          },
          passed: false,
        },
        {
          test_name: 'TestCheckRegion',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: false,
        },
        {
          test_name: 'TestCheckWindow',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: true,
        },
      ],
    })
    assert.ok(result.status === 200)
  })
})
