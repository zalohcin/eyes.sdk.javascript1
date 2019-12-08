'use strict'

const {By} = require('selenium-webdriver')
const {TestSetup} = require('../TestSetup')
const {TestDataProvider} = require('../TestDataProvider')
const {Target} = require('../../../index')

describe('TestScrollRootElementOnSimplePage', function() {
  this.timeout(5 * 60 * 1000)

  let /** @type {TestSetup} */ testSetup
  before(async function() {
    await testSetup.oneTimeSetup()
  })
  beforeEach(async function() {
    await testSetup.setup(this)
  })
  afterEach(async function() {
    await testSetup.tearDown(this)
  })
  after(async function() {
    await testSetup.oneTimeTearDown()
  })

  const dataProvider = TestDataProvider.fixtureArgs()
  dataProvider.forEach(row => {
    testSetup = new TestSetup(
      'Eyes Selenium SDK - Scroll Root Element',
      row.options,
      row.useVisualGrid,
      row.stitchMode,
    )
    testSetup.setTestedPageUrl(
      'https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html',
    )

    describe(testSetup.toString(), function() {
      it('TestCheckWindow_Simple_Body', async function() {
        await testSetup.getEyes().check(
          `Body (${testSetup.getEyes().getStitchMode()} stitching)`,
          Target.window()
            .scrollRootElement(By.css('body'))
            .fully(),
        )
      })

      it('TestCheckWindow_Simple_Html', async function() {
        await testSetup.getEyes().check(
          `Body (${testSetup.getEyes().getStitchMode()} stitching)`,
          Target.window()
            .scrollRootElement(By.css('html'))
            .fully(),
        )
      })
    })
  })
})
