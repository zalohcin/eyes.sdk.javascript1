const assert = require('assert')
const {Builder, By, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const specs = require('../../src/SpecWrappedDriver')

describe('SpecWrappedDriver', async () => {
  describe('headless desktop', async () => {
    let driver
    const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

    before(async () => {
      driver = await new Builder()
        .withCapabilities(Capabilities.chrome())
        .setChromeOptions(new ChromeOptions().headless().addArguments('disable-infobars'))
        .build()
      await driver.get(url)
    })

    after(async () => {
      await driver.quit()
    })

    it('executeScript(strings, ...args)', async () => {
      const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
      const expected = await driver.executeScript('return arguments', ...args)
      const result = await specs.executeScript(driver, 'return arguments', ...args)
      assert.deepStrictEqual(result, expected)
    })
    it('sleep(number)', async () => {
      const sleep = 1000
      const startAt = Date.now()
      await specs.sleep(driver, sleep)
      const duration = Date.now() - startAt
      assert.ok(duration >= sleep && duration <= sleep + 10)
    })
    it('switchToFrame(element)', async () => {
      const element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      const expected = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      await specs.switchToFrame(driver, element)
      const result = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      assert.deepStrictEqual(result, expected)
    })
    it('switchToFrame(null)', async () => {
      const top = await driver.executeScript('return document')
      const element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      const frame = await driver.executeScript('return document')
      assert.notStrictEqual(await frame.getId(), await top.getId())
      await specs.switchToFrame(driver, null)
      const result = await driver.executeScript('return document')
      assert.strictEqual(await result.getId(), await top.getId())
    })
    it('findElement(by)', async () => {
      const expected = await driver.findElement(By.css('#overflowing-div'))
      const result = await specs.findElement(driver, By.css('#overflowing-div'))
      assert.strictEqual(await result.getId(), await expected.getId())
    })
    it('findElements(by)', async () => {
      const expected = await driver.findElements(By.css('div'))
      const result = await specs.findElements(driver, By.css('div'))
      await Promise.all(
        expected.map(async (element, index) => {
          assert.strictEqual(await element.getId(), await result[index].getId())
        }),
      )
    })
    it('getWindowLocation()', async () => {
      const {x, y} = await driver
        .manage()
        .window()
        .getRect()
      const result = await specs.getWindowLocation(driver)
      assert.deepStrictEqual(result, {x, y})
    })
    it('getWindowSize()', async () => {
      const {width, height} = await driver
        .manage()
        .window()
        .getRect()
      const result = await specs.getWindowSize(driver)
      assert.deepStrictEqual(result, {width, height})
    })
    it('setWindowSize({width, height})', async () => {
      const location = {width: 300, height: 310}
      await specs.setWindowSize(driver, location)
      const {width, height} = await driver
        .manage()
        .window()
        .getRect()
      assert.deepStrictEqual({width, height}, location)
    })
    it('getSessionId()', async () => {
      const session = await driver.getSession()
      const expected = session.getId()
      const result = await specs.getSessionId(driver)
      assert.deepStrictEqual(result, expected)
    })
    it('getTitle()', async () => {
      const expected = await driver.getTitle()
      const result = await specs.getTitle(driver)
      assert.deepStrictEqual(result, expected)
    })
    it('getUrl()', async () => {
      const result = await specs.getUrl(driver)
      assert.deepStrictEqual(result, url)
    })
    it('visit()', async () => {
      const blank = 'about:blank'
      await specs.visit(driver, blank)
      const actual = await driver.getCurrentUrl()
      assert.deepStrictEqual(actual, blank)
      await driver.get(url)
    })
    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.deepStrictEqual(result, false)
    })
  })

  describe('onscreen desktop', async () => {
    let driver

    before(async () => {
      driver = await new Builder()
        .withCapabilities(Capabilities.chrome())
        .setChromeOptions(new ChromeOptions().addArguments('disable-infobars'))
        .build()
    })

    after(async () => {
      await driver.quit()
    })

    it('setWindowLocation({x, y})', async () => {
      const location = {x: 100, y: 110}
      await specs.setWindowLocation(driver, location)
      const {x, y} = await driver
        .manage()
        .window()
        .getRect()
      assert.deepStrictEqual({x, y}, location)
    })
  })

  describe.skip('mobile', async () => {
    let driver

    before(async () => {
      driver = await new Builder()
        .withCapabilities({
          browserName: 'safari',
          platformName: 'iOS',
          platformVersion: '11.0',
          deviceName: 'iPad Air 2 Simulator',
          deviceOrientation: 'portrait',
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
          idleTimeout: 360,
        })
        .usingServer('https://ondemand.saucelabs.com:443/wd/hub')
        .build()
    })

    after(async () => {
      await driver.quit()
    })

    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.strictEqual(result, true)
    })

    it('isAndroid()', async () => {
      const result = await specs.isAndroid(driver)
      assert.strictEqual(result, true)
    })

    it('isIOS()', async () => {
      const result = await specs.isIOS(driver)
      assert.strictEqual(result, false)
    })

    it('getOrientation()', async () => {
      await driver.setOrientation('landscape')
      const landscape = await specs.getOrientation(driver)
      assert.strictEqual(landscape, 'landscape')
      await driver.setOrientation('portrait')
      const portrait = await specs.getOrientation(driver)
      assert.strictEqual(portrait, 'portrait')
    })
  })
})
