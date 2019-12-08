'use strict'

const assert = require('assert')
const {
  Eyes,
  FailureReports,
  AccessibilityLevel,
  BatchInfo,
  RectangleSize,
  MatchLevel,
} = require('../../../index')

describe('TestApiExists', function() {
  it('TestApiProperties', async function() {
    const eyes = new Eyes()

    eyes.setAppName('app name')
    eyes.setTestName('test name')
    eyes.setBaselineBranchName('baseline branch name')
    eyes.setParentBranchName('parent branch name')
    eyes.setBranchName('branch name')
    eyes.setBaselineEnvName('baseline env name')
    eyes.setEnvironmentName('env name')
    eyes.setHostApp('host app')
    eyes.setHostOS('windows')
    eyes.setAgentId('some agent id')

    const fullAgentId = eyes.getFullAgentId()

    eyes.setIgnoreCaret(true)
    eyes.setHideCaret(true)
    eyes.setSaveFailedTests(true)
    eyes.setSaveNewTests(true)
    eyes.setSendDom(true)
    eyes.setSaveDiffs(true)

    eyes.setStitchOverlap(20)

    eyes.setBatch(new BatchInfo())
    eyes.setFailureReports(FailureReports.IMMEDIATE)
    eyes.setMatchTimeout(30 * 1000)

    await eyes.setViewportSize(new RectangleSize(1000, 600))
    await eyes.setViewportSize(new RectangleSize(1000, 600))

    eyes.setMatchLevel(MatchLevel.Strict)

    const dpr = eyes.getDevicePixelRatio()
    const sr = eyes.getScaleRatio()
    eyes.setScrollToRegion(true)

    const config = eyes.getConfiguration()

    assert.strictEqual(config.getAppName(), 'app name')
    assert.strictEqual(config.getTestName(), 'test name')
    assert.strictEqual(config.getBaselineBranchName(), 'baseline branch name')
    assert.strictEqual(config.getParentBranchName(), 'parent branch name')
    assert.strictEqual(config.getBranchName(), 'branch name')
    assert.strictEqual(config.getBaselineEnvName(), 'baseline env name')
    assert.strictEqual(config.getEnvironmentName(), 'env name')
    assert.strictEqual(config.getHostApp(), 'host app')
    assert.strictEqual(config.getHostOS(), 'windows')
    assert.strictEqual(config.getAgentId(), 'some agent id')

    assert.strictEqual(config.getIgnoreCaret(), true)
    assert.strictEqual(config.getHideCaret(), true)
    assert.strictEqual(config.getSaveNewTests(), true)
    assert.strictEqual(config.getSendDom(), true)
    assert.strictEqual(config.getSaveDiffs(), true)

    assert.strictEqual(config.getStitchOverlap(), 20)
    assert.deepStrictEqual(config.getBatch(), eyes.getBatch())

    assert.strictEqual(config.getMatchTimeout(), 30 * 1000)
    assert.deepStrictEqual(config.getViewportSize(), new RectangleSize(1000, 600))
    assert.strictEqual(config.getMatchLevel(), MatchLevel.Strict)

    assert.strictEqual(config.getIgnoreDisplacements(), false)
    config.setIgnoreDisplacements(true)
    for (const value of Object.values(AccessibilityLevel)) {
      config.setAccessibilityValidation(value)
      assert.strictEqual(value, config.getAccessibilityValidation())
    }
  })
})
