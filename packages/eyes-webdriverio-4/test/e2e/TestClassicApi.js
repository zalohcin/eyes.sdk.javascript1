'use strict'

const shared = require('shared-examples-for')
const {By} = require('../../index')

shared.examplesFor('TestClassicApi', function(test) {
  it('TestIgnoreCaret', async () => {
    test.eyes.setHideCaret(true)
    const input = await test.eyes.getDriver().element(By.xPath('/html/body/input'))
    await input.setValue('test')

    await test.eyes.checkRegionBy(By.xPath('/html/body/input'), 'input')
  })
})

module.exports.TestClassicApi = shared
