const {VisualGridRunner} = require('@applitools/eyes-sdk-core')
const {EyesFactory} = require('../../src/TestCafeSDK')
const eyes = new EyesFactory(new VisualGridRunner())
const assert = require('assert')

fixture`legacy vg api`.after(async () => {
  if (eyes.getIsOpen()) await eyes.close(false)
})
test('eyes.open with init params', async driver => {
  assert.doesNotThrow(async () => {
    await eyes.open({t: driver, appName: 'app-name', testName: 'test-name'})
  })
})
test('eyes.open with config params', async driver => {
  const init = {
    t: driver,
    appName: 'app-name',
    testName: 'test-name',
  }
  const browser = [{width: 1024, height: 768, name: 'ie11'}]
  assert.doesNotThrow(async () => {
    await eyes.open({
      ...init,
      browser,
    })
  })
  const config = eyes.getConfiguration()
  assert.deepStrictEqual(config.getBrowsersInfo(), browser)
})
test('eyes.checkWindow', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow'})
  await eyes.checkWindow()
  await eyes.close(true)
})
test.skip('eyes.checkWindow tag', async _t => {})
test.skip('eyes.checkWindow target', async _t => {})
test.skip('eyes.checkWindow fully', async _t => {})
test.skip('eyes.checkWindow selector', async _t => {})
test.skip('eyes.checkWindow region', async _t => {})
test.skip('eyes.checkWindow ignore', async _t => {})
test.skip('eyes.checkWindow floating', async _t => {})
test.skip('eyes.checkWindow layout', async _t => {})
test.skip('eyes.checkWindow strict', async _t => {})
test.skip('eyes.checkWindow content', async _t => {})
test.skip('eyes.checkWindow accessibility', async _t => {})
test.skip('eyes.checkWindow scriptHooks', async _t => {})
test.skip('eyes.checkWindow sendDom', async _t => {})
test.skip('eyes.waitForResults', async _t => {})
