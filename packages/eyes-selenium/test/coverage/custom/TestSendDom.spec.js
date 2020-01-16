'use strict'
const {assertImage} = require('./util/ApiAssertions')
const {getDriver, getEyes, getSetups} = require('./util/TestSetup')
// const {expect} = require('chai')
const {By} = require('selenium-webdriver')
const {/*EyesSelenium,*/ BatchInfo, Target} = require('../../../index')
const appName = 'Test Send Dom'

/*class DomInterceptingEyes extends EyesSelenium {
  async tryCaptureDom() {
    this.domJSON = await super.tryCaptureDom()
    return this.domJSON
  }
}*/

describe(appName, () => {
  let setups = getSetups()
  let batch = new BatchInfo('JS test')
  setups.forEach(function(setup) {
    describe(`Dom intercepted eyes ${setup.title}`, () => {
      let driver
      beforeEach(async function() {
        driver = await getDriver('CHROME')
      })

      afterEach(async function() {
        await driver.quit()
      })
      // assertion require correct json file of the dom
      /*it.skip('TestSendDOM_FullWindow', async () => {
        driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
        let eyes = new DomInterceptingEyes()
        eyes.setBatch(batch)
        eyes.setBranchName('master')
        await eyes.open(driver, 'Test Send DOM', 'Full Window', {
          width: 1024,
          height: 768,
        })
        try {
          await eyes.check('Window', Target.window().fully())
          let actual = eyes.domJSON
          let results = await eyes.close(false)
          await assertImage(results, {hasDom: true})
          let expected = require('./util/expected_dom1.json')
          let json = JSON.stringify(expected)
          expect(actual).to.be.eql(json)
        } finally {
          await eyes.abortIfNotClosed()
        }
      })*/
    })

    describe(`Test run ${setup.title}`, () => {
      let webDriver, eyes
      beforeEach(async function() {
        webDriver = await getDriver('CHROME')
        let defaults = await getEyes(setup.runnerType, setup.stitchMode)
        eyes = defaults.eyes
        eyes.setBatch(batch)
      })

      afterEach(async function() {
        await eyes.abortIfNotClosed()
        await webDriver.quit()
      })

      it(`TestSendDOM_Selector`, async () => {
        await webDriver.get('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html')
        await eyes.open(webDriver, 'Test Send Dom', `Test Send Dom${setup.title}`, {
          width: 1000,
          height: 700,
        })
        await eyes.check('region', Target.region(By.css('#scroll1')))
        let results = await eyes.close(false)
        await assertImage(results, {
          hasDom: true,
        })
      })
      it(`TestNotSendDOM`, async () => {
        await webDriver.get('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html')
        await eyes.open(webDriver, 'Test NOT SendDom', `Test NOT SendDom${setup.title}`, {
          width: 1000,
          height: 700,
        })
        await eyes.check('region', Target.window().sendDom(false))
        let results = await eyes.close(false)
        await assertImage(results, {
          hasDom: false,
        })
      })

      let domCases = [
        {
          url: `https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html`,
          title: `TestSendDOM_1`,
        },
        {
          url: `https://applitools.github.io/demo/TestPages/DomTest/dom_capture_2.html`,
          title: `TestSendDOM_2`,
        },
      ]

      domCases.forEach(domCase => {
        it(`${domCase.title}`, async () => {
          await webDriver.get(domCase.url)
          await eyes.open(webDriver, 'Test Send Dom', `${domCase.title}${setup.title}`)
          await eyes.checkWindow()
          let results = await eyes.close(false)
          await assertImage(results, {hasDom: true})
        })
      })
    })
  })
})
