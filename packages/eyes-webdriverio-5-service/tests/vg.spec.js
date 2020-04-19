/* global browser */
'use strict'

const assert = require('assert')

describe('vg', () => {
  it('full page', () => {
    browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
    browser.eyesCheck('full page')
    const testResultSummary = browser.eyesGetAllTestResults()
    const allStatuses = Array.from(testResultSummary).map(testResultContainer =>
      testResultContainer.getTestResults().getStatus(),
    )
    assert.strictEqual(
      allStatuses.every(s => s === 'Passed'),
      true,
    )
  })
})
