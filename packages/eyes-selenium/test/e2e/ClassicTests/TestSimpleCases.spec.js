'use strict'

const {By} = require('selenium-webdriver')
const {TestSetup} = require('../TestSetup')
const {TestDataProvider} = require('../TestDataProvider')
const {Target, RectangleSize} = require('../../../index')

describe('TestSimpleCases', function() {
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
      'Eyes Selenium SDK - Simple Test Cases',
      row.options,
      row.useVisualGrid,
      row.stitchMode,
    )
    testSetup.setTestedPageUrl('https://applitools.github.io/demo/TestPages/SimpleTestPage/')
    testSetup.setTestedPageSize(new RectangleSize(1024, 600))

    describe(testSetup.toString(), function() {
      it('TestCheckDivOverflowingThePage', async function() {
        await testSetup.getEyes().check('overflowing div', Target.region(By.id('frame1')).fully())
      })
    })
  })
})
