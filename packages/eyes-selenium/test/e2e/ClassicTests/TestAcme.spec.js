'use strict'

const {By} = require('selenium-webdriver')
const {TestSetup} = require('../TestSetup')
const {TestDataProvider} = require('../TestDataProvider')
const {Target, RectangleSize} = require('../../../index')

describe('TestAcme', function() {
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
      'Eyes Selenium SDK - ACME',
      row.options,
      row.useVisualGrid,
      row.stitchMode,
    )
    testSetup.setTestedPageSize(new RectangleSize(1024, 768))

    describe(testSetup.toString(), function() {
      it('TestAcmeTable', async function() {
        await testSetup.getDriver().get('file:///C:/temp/fluentexample/Account%20-%20ACME.html')
        await testSetup.getEyes().check(
          'main window with table',
          Target.window()
            .fully()
            .ignoreRegions(By.className('toolbar'))
            .layoutRegions(
              By.id('orders-list-desktop'),
              By.className('snapshot-topic'),
              By.id('results-count'),
            )
            .strict(),
        )
      })

      it('TestAcmeLogin', async function() {
        await testSetup.getDriver().get('https://afternoon-savannah-68940.herokuapp.com/#')
        const username = await testSetup.getDriver().findElement(By.id('username'))
        await username.sendKeys('adamC')
        const password = await testSetup.getDriver().findElement(By.id('password'))
        await password.sendKeys('MySecret123?')
        await testSetup.getEyes().check(Target.region(username), Target.region(password))
      })
    })
  })
})
