const assert = require('assert')
const spec = require('../../src/spec-driver')

describe('spec driver', async () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(function(driver, done) {
      driver.url(url)
      done()
    })
    after(function(driver, done) {
      return driver.end(function() {
        done()
      })
    })
    it('isDriver(driver)', function(driver) {
      return assert.ok(spec.isDriver(driver))
    })
    it('isDriver(wrong)', function(_driver) {
      return assert.ok(!spec.isDriver({}))
    })
    it('isElement(element)', async function(driver) {
      const element = await driver.element('css selector', 'div')
      assert.ok(spec.isElement(element))
    })
    it('isElement(wrong)', function(_driver) {
      spec.isElement({})
    })
    // NOTE: Nightwatch separates the strategy from the selector - so it's always 2 values
    // e.g., using 'css selector', with 'div'
    it('isSelector(string)', function(_driver) {
      assert.ok(spec.isSelector('div'))
    })
    it('isSelector(wrong)', function(_driver) {
      assert.ok(!spec.isSelector())
    })
    it('isEqualElements(element, element)', async function(driver) {
      const element = await driver.element('css selector', 'div')
      assert.ok(spec.isEqualElements(driver, element, element))
    })
    it('isEqualElements(element1, element2)', async function(driver) {
      const element1 = await driver.element('css selector', 'div')
      const element2 = await driver.element('css selector', 'h1')
      assert.ok(!spec.isEqualElements(driver, element1, element2))
    })
    it('executeScript(strings, ...args)', async function(driver) {
      const script = 'return arguments'
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result[0], args)
    })
    it('executeScript(function, ...args)', async function(driver) {
      const script = function() {
        return arguments
      }
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result[0], args)
    })
    it('executeScript(element)', async function(driver) {
      const element = await driver.element('css selector', 'div')
      const script = function() {
        return arguments
      }
      const result = await spec.executeScript(driver, script, element)
      assert.deepStrictEqual(result[0], element)
    })
    it('findElement(selector)', async function(driver) {
      const element = await spec.findElement(driver, '#overflowing-div')
      assert.ok(spec.isElement(element))
    })
    it('findElement(non-existent)', async function(driver) {
      const element = await spec.findElement(driver, 'blah')
      assert.ok(!spec.isElement(element))
    })
    it('findElements(selector)', async function(driver) {
      const elements = await spec.findElements(driver, 'div')
      assert.ok(Array.isArray(elements))
      assert.ok(elements.length > 0)
      assert.ok(spec.isElement(elements[0]))
    })
    it('findElements(non-existent)', async function(driver) {
      const elements = await spec.findElements(driver, 'blah')
      assert.ok(Array.isArray(elements))
      assert.ok(!elements.length)
    })
    it('mainContext()', async function(driver) {
      try {
        const mainDocument = await driver.element('css selector', 'html')
        await driver.frame('frame1')
        await driver.frame('frame1-1')
        const frameDocument = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
        await spec.mainContext(driver)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
      } finally {
        await driver.frame()
      }
    })
    it('parentContext()', async function(driver) {
      try {
        await driver.frame('frame1')
        const parentDocument = await driver.element('css selector', 'html')
        await driver.frame('frame1-1')
        const frameDocument = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
        await spec.parentContext(driver)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
      } finally {
        await driver.frame()
      }
    })
    // TODO: suboptimal solution, revisit
    it('childContext(element)', async function(driver) {
      try {
        await driver.frame('frame1')
        const expectedDocument = await driver.element('css selector', 'html')
        await driver.frame()
        const frameElement = await driver.element('css selector', '[name="frame1"]')
        await spec.childContext(driver, frameElement)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
      } finally {
        await driver.frame()
      }
    })
    it('getSessionId()', function(driver) {
      const sessionId = driver.sessionId
      assert.deepStrictEqual(spec.getDriverInfo(driver).sessionId, sessionId)
    })
    it('getTitle()', async function(driver) {
      const expected = await driver.getTitle()
      assert.deepStrictEqual(await spec.getTitle(driver), expected)
    })
    it('getUrl()', async function(driver) {
      const result = await driver.url()
      const expected = result.value
      assert.deepStrictEqual(await spec.getUrl(driver), expected)
    })
    it('visit()', async function(driver) {
      try {
        const blank = 'about:blank'
        await spec.visit(driver, blank)
        const result = await driver.url()
        const actual = result.value
        assert.deepStrictEqual(actual, blank)
      } finally {
        await driver.url(url)
      }
    })
    it('isMobile()', async function(driver) {
      const {isMobile} = await spec.getDriverInfo(driver)
      assert.deepStrictEqual(isMobile, false)
    })
    it.skip('takeScreenshot()', async function(_driver) {})
  })

  //describe('mobile driver (@mobile)', async () => {
  //  before(function(_driver, done) {
  //    //;[driver, destroyDriver] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
  //    done()
  //  })
  //  after(function(_driver, done) {
  //    //await destroyDriver()
  //    done()
  //  })
  //  it.skip('isMobile()', function(_driver) {
  //    //isMobile({expected: true}
  //  })
  //  it.skip('getDeviceName()', function(_driver) {
  //    //getDeviceName({expected: 'Google Pixel 3a XL GoogleAPI Emulator'})
  //  })
  //  it.skip('getPlatformName()', function(_driver) {
  //    //getPlatformName({expected: 'Android'})
  //  })
  //  it.skip('isNative()', function(_driver) {
  //    //isNative({expected: false})
  //  })
  //  it.skip('getOrientation()', function(_driver) {
  //    //getOrientation({expected: 'portrait'})
  //  })
  //  it.skip('getPlatformVersion()', function(_driver) {
  //    //getPlatformVersion({expected: '10'})
  //  })
  //})
  //function getWindowRect() {
  //  return async () => {
  //    const {x, y} = await driver
  //      .manage()
  //      .window()
  //      .getPosition()
  //    const {width, height} = await driver
  //      .manage()
  //      .window()
  //      .getSize()
  //    const rect = {x, y, width, height}
  //    const result = await spec.getWindowRect(driver)
  //    assert.deepStrictEqual(result, rect)
  //  }
  //}
  //function setWindowRect({input, expected} = {}) {
  //  return async () => {
  //    await spec.setWindowRect(driver, input)
  //    const {x, y} = await driver
  //      .manage()
  //      .window()
  //      .getPosition()
  //    const {width, height} = await driver
  //      .manage()
  //      .window()
  //      .getSize()
  //    const rect = {x, y, width, height}
  //    assert.deepStrictEqual(rect, expected)
  //  }
  //}
  //function getOrientation({expected} = {}) {
  //  return async () => {
  //    const result = await spec.getOrientation(driver)
  //    assert.strictEqual(result, expected)
  //  }
  //}
  //function isNative({expected} = {}) {
  //  return async () => {
  //    const {isNative} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(isNative, expected)
  //  }
  //}
  //function getDeviceName({expected} = {}) {
  //  return async () => {
  //    const {deviceName} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(deviceName, expected)
  //  }
  //}
  //function getPlatformName({expected} = {}) {
  //  return async () => {
  //    const {platformName} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(platformName, expected)
  //  }
  //}
  //function getPlatformVersion({expected} = {}) {
  //  return async () => {
  //    const {platformVersion} = await spec.getDriverInfo(driver)
  //    assert.strictEqual(platformVersion, expected)
  //  }
  //}
})
