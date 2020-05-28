'use strict';
const {Eyes, Target} = require('../../../../index')
async function makeCheck(runner, batch, driver, appName, testName, checkName) {
  let eyes = new Eyes(runner)
  eyes.setBatch(batch)
  eyes.setHostOS('Linux')
  if(process.env['APPLITOOLS_API_KEY_SDK']){
    eyes.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
  }
  await eyes.open(driver, appName, testName, {width: 1200, height: 800})
  await eyes.check(
    checkName,
    Target.window()
      .fully()
      .ignoreDisplacements(false),
  )
  return eyes
}

module.exports = {
  makeCheck: makeCheck
}
