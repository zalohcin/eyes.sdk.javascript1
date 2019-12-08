'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')

const {
  Eyes,
  VisualGridRunner,
  ClassicRunner,
  Target,
  BrowserType,
  RectangleSize,
} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestAbort', function() {
  this.timeout(5 * 60 * 1000)
  ;[{useVisualGrid: true}, {useVisualGrid: false}].forEach(({useVisualGrid}) => {
    let driver_, eyes_, runner_

    describe(`useVisualGrid: ${useVisualGrid}`, function() {
      it('TestAbortIfNotClosed', async function() {
        await eyes_.check(useVisualGrid ? 'VG' : 'SEL', Target.window())
        await GeneralUtils.sleep(15 * 1000)
        await eyes_.abort()
      })

      beforeEach(async () => {
        driver_ = SeleniumUtils.createChromeDriver()
        await driver_.get('data:text/html,<p>Test</p>')
        runner_ = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
        eyes_ = new Eyes(runner_)
        eyes_.setBatch(TestDataProvider.BatchInfo)
        const testName = useVisualGrid ? 'Test Abort_VG' : 'Test Abort'

        const config = eyes_.getConfiguration()
        config.addBrowser(800, 600, BrowserType.CHROME)
        eyes_.setConfiguration(config)

        await eyes_.open(driver_, testName, testName, new RectangleSize(1200, 800))
      })

      afterEach(async () => {
        await driver_.quit()
      })
    })
  })
})
