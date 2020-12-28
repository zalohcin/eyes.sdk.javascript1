const {VisualGridRunner} = require('@applitools/eyes-sdk-core')
const {Eyes} = require('../../src/TestCafeSDK')
const eyes = new Eyes(new VisualGridRunner({testConcurrency: 10}))
const assert = require('assert')
const {v4: uuidv4} = require('uuid')
process.env.APPLITOOLS_BATCH_NAME = 'JS Coverage Tests - eyes-testcafe (legacy API)'
process.env.APPLITOOLS_BATCH_ID = uuidv4()

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
test.skip('eyes.checkWindow tag', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow tag'})
  await eyes.checkWindow('tag')
  await eyes.checkWindow({tag: 'tag'})
  await eyes.close(false)
  // assert tags in jobs
})
test('eyes.checkWindow fully', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow fully'})
  await eyes.checkWindow({target: 'window', fully: true})
  await eyes.close(true)
})
test('eyes.checkWindow selector', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow selector'})
  await eyes.checkWindow({target: 'region', selector: '#overflowing-div'})
  await eyes.close(true)
})
test('eyes.checkWindow region', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow region'})
  await eyes.checkWindow({target: 'region', region: {top: 100, left: 0, width: 1000, height: 200}})
  await eyes.close(true)
})
test('eyes.checkWindow ignore', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow ignore'})
  await eyes.checkWindow({
    ignore: [{selector: '#overflowing-div'}, {top: 100, left: 0, width: 1000, height: 200}],
  })
  await eyes.close(true)
})
test('eyes.checkWindow floating', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow floating'})
  await eyes.checkWindow({
    floating: [
      {
        top: 100,
        left: 0,
        width: 1000,
        height: 100,
        maxUpOffset: 20,
        maxDownOffset: 20,
        maxLeftOffset: 20,
        maxRightOffset: 20,
      },
      {
        selector: '#overflowing-div',
        maxUpOffset: 20,
        maxDownOffset: 20,
        maxLeftOffset: 20,
        maxRightOffset: 20,
      },
    ],
  })
  await eyes.close(true)
})
test('eyes.checkWindow layout', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow layout'})
  await eyes.checkWindow({
    layout: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
  })
  await eyes.close(true)
})
test('eyes.checkWindow strict', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow strict'})
  await eyes.checkWindow({
    strict: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
  })
  await eyes.close(true)
})
test('eyes.checkWindow content', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow content'})
  await eyes.checkWindow({
    content: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
  })
  await eyes.close(true)
})
test('eyes.checkWindow accessibility', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({
    t,
    appName: 'eyes-testcafe',
    testName: 'legacy api test: checkWindow accessibility',
  })
  await eyes.checkWindow({
    accessibility: [
      {accessibilityType: 'RegularText', selector: '#overflowing-div'},
      {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
    ],
  })
  await eyes.close(true)
})
test('eyes.checkWindow scriptHooks', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({
    t,
    appName: 'eyes-testcafe',
    browser: [{width: 800, height: 600, name: 'chrome'}],
    testName: 'legacy api test: checkWindow scriptHooks',
  })
  await eyes.checkWindow({
    scriptHooks: {
      beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
    },
  })
  await eyes.close(true)
})
test.skip('eyes.checkWindow sendDom', async t => {
  await t.navigateTo('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  await eyes.open({t, appName: 'eyes-testcafe', testName: 'legacy api test: checkWindow sendDom'})
  await eyes.checkWindow({
    sendDom: false,
  })
  await eyes.close(false)
  // assert dom not sent
})
test.skip('eyes.waitForResults', async _t => {})
