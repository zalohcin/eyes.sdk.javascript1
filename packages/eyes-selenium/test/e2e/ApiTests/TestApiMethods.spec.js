'use strict'

const {By} = require('selenium-webdriver')
const {Eyes, VisualGridRunner, ClassicRunner, Target, RectangleSize} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestApiMethods', function() {
  ;[{useVisualGrid: true}, {useVisualGrid: false}].forEach(({useVisualGrid}) => {
    describe(`useVisualGrid: ${useVisualGrid}`, function() {
      it('TestCloseAsync', async function() {
        const driver = SeleniumUtils.createChromeDriver()
        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
        const eyes = new Eyes(runner)
        eyes.setLogHandler(TestUtils.initLogHandler())
        eyes.setBatch(TestDataProvider.BatchInfo)

        try {
          await driver.get('https://applitools.com/helloworld')
          await eyes.open(
            driver,
            this.test.parent.title,
            `${this.test.title}_1`,
            new RectangleSize(800, 600),
          )
          await eyes.check(null, Target.window().withName('step 1'))
          await eyes.closeAsync()

          await driver.findElement(By.css('button')).click()
          await eyes.open(
            driver,
            this.test.parent.title,
            `${this.test.title}_2`,
            new RectangleSize(800, 600),
          )
          await eyes.check(null, Target.window().withName('step 2'))
          await eyes.closeAsync()
          await runner.getAllTestResults()
        } finally {
          await driver.quit()
        }
      })
    })
  })
})
