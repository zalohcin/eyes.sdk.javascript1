const assert = require('assert')
const {Runner} = require('protractor')
const specs = require('../../src/SpecWrappedDriver')

describe('SpecWrappedDriver', () => {
  describe('headless desktop', async () => {
    let driver
    const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

    before(async () => {
      const runner = new Runner({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['headless'],
          },
        },
        logLevel: 'ERROR',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        allScriptsTimeout: 11000,
        getPageTimeout: 10000,
      })
      driver = await runner.createBrowser().ready
      driver.by = driver.constructor.By
      driver.waitForAngularEnabled(false)
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
      const element = await driver.findElement(driver.by.name('frame1'))
      await driver.switchTo().frame(element)
      const expected = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      await specs.switchToFrame(driver, element)
      const result = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      assert.deepStrictEqual(await result.getId(), await expected.getId())
    })

    it('switchToFrame(null)', async () => {
      const top = await driver.executeScript('return document')
      const element = await driver.findElement(driver.by.name('frame1'))
      await driver.switchTo().frame(element)
      const frame = await driver.executeScript('return document')
      assert.notStrictEqual(await frame.getId(), await top.getId())
      await specs.switchToFrame(driver, null)
      const result = await driver.executeScript('return document')
      assert.strictEqual(await result.getId(), await top.getId())
    })

    it('findElement(by)', async () => {
      const expected = await driver.findElement(driver.by.css('#overflowing-div'))
      const result = await specs.findElement(driver, driver.by.css('#overflowing-div'))
      assert.strictEqual(await result.getId(), await expected.getId())
    })

    it('findElements(by)', async () => {
      const expected = await driver.findElements(driver.by.css('div'))
      const result = await specs.findElements(driver, driver.by.css('div'))
      await Promise.all(
        expected.map(async (element, index) => {
          assert.strictEqual(await element.getId(), await result[index].getId())
        }),
      )
    })

    it('findElement(byHash)', async () => {
      const expected = await driver.findElement({id: 'overflowing-div'})
      const result = await specs.findElement(driver, {id: 'overflowing-div'})
      assert.strictEqual(await result.getId(), await expected.getId())
    })

    it('findElements(byHash)', async () => {
      const expected = await driver.findElements({tagName: 'div'})
      const result = await specs.findElements(driver, {tagName: 'div'})
      await Promise.all(
        expected.map(async (element, index) => {
          assert.strictEqual(await element.getId(), await result[index].getId())
        }),
      )
    })

    it('findElement(non-existent)', async () => {
      const result = await specs.findElement(driver, driver.by.css('non-existent'))
      assert.strictEqual(result, null)
    })

    it('findElements(non-existent)', async () => {
      const result = await specs.findElements(driver, driver.by.css('non-existent'))
      assert.deepStrictEqual(result, [])
    })

    it('getWindowLocation()', async () => {
      const {x, y} = await driver
        .manage()
        .window()
        .getPosition()
      const result = await specs.getWindowLocation(driver)
      assert.deepStrictEqual(result, {x, y})
    })

    it('getWindowSize()', async () => {
      const {width, height} = await driver
        .manage()
        .window()
        .getSize()
      const result = await specs.getWindowSize(driver)
      assert.deepStrictEqual(result, {width, height})
    })

    it('setWindowSize({width, height})', async () => {
      const size = {width: 300, height: 310}
      await specs.setWindowSize(driver, size)
      const {width, height} = await driver
        .manage()
        .window()
        .getSize()
      assert.deepStrictEqual({width, height}, size)
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
      const runner = new Runner({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['headless'],
          },
        },
        seleniumAddress: 'http://localhost:4444/wd/hub',
        allScriptsTimeout: 11000,
        getPageTimeout: 10000,
      })
      driver = await runner.createBrowser().ready
      driver.by = driver.constructor.By
      driver.waitForAngularEnabled(false)
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
        .getPosition()
      assert.deepStrictEqual({x, y}, location)
    })
  })

  describe.skip('mobile browser', async () => {
    let driver

    before(async () => {
      const runner = new Runner({
        capabilities: {
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          platformName: 'Android',
          platformVersion: '10.0',
          deviceOrientation: 'landscape',
          appiumVersion: '1.8.0',
          browserName: 'Chrome',
          browserVersion: 'latest',
        },
        seleniumAddress: 'https://ondemand.saucelabs.com/wd/hub',
        allScriptsTimeout: 11000,
        getPageTimeout: 10000,
      })
      driver = await runner.createBrowser().ready
      driver.by = driver.constructor.By
      driver.waitForAngularEnabled(false)
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

    it('isNative()', async () => {
      const result = await specs.isNative(driver)
      assert.strictEqual(result, false)
    })

    it('getOrientation()', async () => {
      const result = await specs.getOrientation(driver)
      assert.strictEqual(result, 'landscape')
    })

    it('getPlatformVersion()', async () => {
      const result = await specs.getPlatformVersion(driver)
      assert.strictEqual(result, '10')
    })
  })
})
