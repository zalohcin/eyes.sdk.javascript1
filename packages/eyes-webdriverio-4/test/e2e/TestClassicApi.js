'use strict'

const shared = require('shared-examples-for')
const {By} = require('../../index')

shared.examplesFor('TestClassicApi', function(test) {
  it('TestIgnoreCaret', async () => {
    test.eyes.setIgnoreCaret(true)
    const input = await test.eyes.getDriver().webDriver.findElement(By.xPath('/html/body/input'))
    await input.sendKeys('test')

    await test.eyes.checkRegionBy(By.xPath('/html/body/input'), 'input')
  })
})

module.exports.TestClassicApi = shared
