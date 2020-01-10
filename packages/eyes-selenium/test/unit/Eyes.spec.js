'use strict'

const assert = require('assert')
const {Builder, Capabilities} = require('selenium-webdriver')

const fakeEyesServer = require('@applitools/sdk-fake-eyes-server')

const {
  Eyes,
  VisualGridRunner,
  EyesSelenium,
  EyesVisualGrid,
  Configuration,
  StitchMode,
  RectangleSize,
  ProxySettings,
  BatchInfo,
  PropertyData,
  Target,
} = require('../../index')

describe('Eyes', function() {
  this.timeout(60 * 1000)

  it('should create EyesSelenium by default', async function() {
    const eyes = new Eyes()
    assert.ok(!eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesSelenium)
  })

  it('should create EyesVisualGrid with VisualGridRunner', async function() {
    const eyes = new Eyes(new VisualGridRunner())
    assert.ok(eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('should create an EyesSelenium instance through fromBrowserInfo', () => {
    const eyes = Eyes.fromBrowserInfo()
    assert.ok(eyes instanceof EyesSelenium)
  })

  it('should create an EyesVisualGrid instance through fromBrowserInfo', () => {
    const eyes = Eyes.fromBrowserInfo(undefined, undefined, {
      browser: [{name: 'iPhone 4', width: 400, height: 600}],
    })
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('set configuration from object', async function() {
    const eyes = new Eyes(new VisualGridRunner())
    const date = new Date()
    eyes.setConfiguration({
      apiKey: 'sameApiKey',
      forceFullPageScreenshot: true,
      stitchMode: 'Scroll',
      browsersInfo: [
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
      viewportSize: {
        width: 450,
        height: 500,
      },
      proxy: 'http://localhost:8888',
      batch: {
        id: 'randomId',
        name: 'Batch name',
        startedAt: date,
      },
      properties: [
        {
          name: 'prop',
          value: 'value',
        },
      ],
      baselineEnvName: 'baselineEnvName',
      sendDom: false,
    })

    assert.ok(eyes.getConfiguration() instanceof Configuration)
    assert.strictEqual(eyes.getApiKey(), 'sameApiKey')
    assert.strictEqual(eyes.getForceFullPageScreenshot(), true)
    assert.strictEqual(eyes.getStitchMode(), StitchMode.SCROLL)
    assert.strictEqual(eyes.getConfiguration().getBrowsersInfo().length, 2)
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[0], {
      width: 800,
      height: 600,
      name: 'firefox',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[1], {
      deviceName: 'iPhone 4',
      screenOrientation: 'portrait',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getViewportSize(), new RectangleSize(450, 500))
    assert.deepStrictEqual(eyes.getProxy(), new ProxySettings('http://localhost:8888'))
    assert.deepStrictEqual(eyes.getBatch(), new BatchInfo('Batch name', date, 'randomId'))
    assert.strictEqual(eyes.getConfiguration().getProperties().length, 1)
    assert.deepStrictEqual(
      eyes.getConfiguration().getProperties()[0],
      new PropertyData('prop', 'value'),
    )
    assert.strictEqual(eyes.getBaselineEnvName(), 'baselineEnvName')
    assert.strictEqual(eyes.getSendDom(), false)
  })

  it('should wait before screenshots', async function() {
    try {
      const driver = await new Builder().withCapabilities(Capabilities.chrome()).build()
      const eyes = new Eyes()
      const server = await fakeEyesServer({logger: {log: () => {}}})
      const config = new Configuration()
      config.setServerUrl(`http://localhost:${server.port}`)
      config.setApiKey('fakeApiKey')
      eyes.setConfiguration(config)
      eyes.setWaitBeforeScreenshots(1000)
      let startTime
      let duration
      const thrownScreenshotDone = Symbol()
      eyes.getScreenshot = function() {
        duration = Date.now() - startTime
        throw thrownScreenshotDone
      }
      await eyes.open(driver, this.test.parent.title, this.test.title)
      startTime = Date.now()
      try {
        await eyes.check('wait', Target.window().fully())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= 1000)
        } else {
          assert.fail()
        }
      }

      await eyes.close()
      await driver.quit()
      await server.close()
    } catch (err) {
      console.log(err)
    }
  })
})
