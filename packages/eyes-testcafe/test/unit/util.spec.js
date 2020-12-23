const assert = require('assert')
const translateArgsToConfig = require('../../src/util/translate-open-args-to-config')
const translateArgsToCheckSettings = require('../../src/util/translate-check-args-to-check-settings')

describe('util', () => {
  describe('config', () => {
    describe('translate check args to check settings', () => {
      it('window fully', () => {
        const args = {
          target: 'window',
          fully: true,
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getStitchContent(), args.fully)
      })
      it('region selector', () => {
        const args = {
          target: 'region',
          selector: '#overflowing-div',
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getTargetElement(), args.selector)
      })
      it.skip('region', () => {
        //{target: 'region', region: {top: 100, left: 0, width: 1000, height: 200}}
      })
      it.skip('ignore', () => {
        //{ignore: [{selector: '#overflowing-div'}, {top: 100, left: 0, width: 1000, height: 200}]}
      })
      it.skip('floating', () => {
        //{
        //    floating: [
        //      {
        //        top: 100,
        //        left: 0,
        //        width: 1000,
        //        height: 100,
        //        maxUpOffset: 20,
        //        maxDownOffset: 20,
        //        maxLeftOffset: 20,
        //        maxRightOffset: 20,
        //      },
        //      {
        //        selector: '#overflowing-div',
        //        maxUpOffset: 20,
        //        maxDownOffset: 20,
        //        maxLeftOffset: 20,
        //        maxRightOffset: 20,
        //      },
        //    ],
        //  }
      })
      it.skip('layout', () => {
        //{layout: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}]}
      })
      it.skip('strict', () => {
        //{strict: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}]}
      })
      it.skip('content', () => {
        // {content: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}]}
      })
      it.skip('accessibility', () => {
        //{
        //  accessibility: [
        //    {accessibilityType: 'RegularText', selector: '#overflowing-div'},
        //    {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
        //  ]
        //}
      })
      it.skip('scriptsHooks', () => {
        //{scriptHooks: {
        //  beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
        //}}
      })
      it.skip('sendDom', () => {
        //{sendDom: false}
      })
    })
    describe('translate open args to config', () => {
      it('works', () => {
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
        const batch = config.getBatch()
        assert.deepStrictEqual(batch.getName(), args.batchName)
        assert.deepStrictEqual(batch.getId(), args.batchId)
        assert.deepStrictEqual(batch.getNotifyOnCompletion(), args.notifyOnCompletion)
        assert.deepStrictEqual(config.getBaselineEnvName(), args.baselineEnvName)
        assert.deepStrictEqual(config.getEnvironmentName(), args.envName)
        assert.deepStrictEqual(config.getIgnoreCaret(), args.ignoreCaret)
        assert.deepStrictEqual(config.getMatchLevel(), args.matchLevel)
        assert.deepStrictEqual(config.getBaselineBranchName(), args.baselineBranchName)
        assert.deepStrictEqual(config.getParentBranchName(), args.parentBranchName)
        assert.deepStrictEqual(config.getSaveFailedTests(), args.saveFailedTests)
        assert.deepStrictEqual(config.getSaveNewTests(), args.saveNewTests)
        assert.deepStrictEqual(
          Object.values(config.getProperties()[0]),
          Object.values(args.properties[0]),
        )
        assert.deepStrictEqual(config.getIgnoreDisplacements(), args.ignoreDisplacements)
        assert.deepStrictEqual(config.getCompareWithParentBranch(), args.compareWithParentBranch)
        assert.deepStrictEqual(config.getIgnoreBaseline(), args.ignoreBaseline)
        assert.deepStrictEqual(config.getAccessibilityValidation(), args.accessibilityValidation)
      })
      it('skips undefined entries', () => {
        const config = translateArgsToConfig({})
        assert.deepStrictEqual(config.getMatchLevel(), 'Strict')
        assert.deepStrictEqual(config.getIgnoreDisplacements(), false)
        assert.deepStrictEqual(config.getAccessibilityValidation(), undefined)
      })
    })
  })
})
