const translateArgsToConfig = require('../../src/util/translate-args-to-config')
const assert = require('assert')

describe('util', () => {
  describe('config', () => {
    const args = {
      testName: 'test-name',
      browser: [{width: 1024, height: 768, name: 'ie11'}],
      batchId: 'batch-id',
      batchName: 'batch-name',
      baselineEnvName: 'baseline-env-name',
      envName: 'env-name',
      ignoreCaret: true,
      matchLevel: 'None',
      baselineBranchName: 'baseline-branch-name',
      saveFailedTests: true,
      saveNewTests: true,
      properties: [{name: 'My prop', value: 'My value'}],
      ignoreDisplacements: true,
      compareWithParentBranch: true,
      ignoreBaseline: true,
      notifyOnCompletion: true,
      accessibilityValidation: {level: 'AA', guidelinesVersion: 'WCAG_2_0'},
    }
    const config = translateArgsToConfig(args)
    assert.deepStrictEqual(config.getTestName(), args.testName)
    assert.deepStrictEqual(config.getBrowsersInfo(), args.browser)
    // TODO: sort out
    //config.getBatch() // id & name
    assert.deepStrictEqual(config.getBaselineEnvName(), args.baselineEnvName)
    assert.deepStrictEqual(config.getEnvironmentName(), args.envName)
    assert.deepStrictEqual(config.getIgnoreCaret(), args.ignoreCaret)
    // TODO: fix
    //assert.deepStrictEqual(config.getMatchLevel(), args.matchLevel)
    assert.deepStrictEqual(config.getBaselineBranchName(), args.baselineBranchName)
    assert.deepStrictEqual(config.getParentBranchName(), args.parentBranchName)
    assert.deepStrictEqual(config.getSaveFailedTests(), args.saveFailedTests)
    assert.deepStrictEqual(config.getSaveNewTests(), args.saveNewTests)
    const props = config.getProperties()
    assert.deepStrictEqual(Object.values(props[0]), Object.values(args.properties[0]))
    // TODO: fix
    //assert.deepStrictEqual(config.getIgnoreDisplacements(), args.ignoreDisplacements)
    assert.deepStrictEqual(config.getCompareWithParentBranch(), args.compareWithParentBranch)
    assert.deepStrictEqual(config.getIgnoreBaseline(), args.ignoreBaseline)
    // TODO: find where this is passed
    // notifyOnCompletion ?
    // TODO: fix
    //assert.deepStrictEqual(config.getAccessibilityValidation(), args.accessibilityValidation)
  })
})
