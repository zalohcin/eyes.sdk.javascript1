const assert = require('assert')
const spec = require('../../src/spec-driver')

describe('spec driver', async () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(function(driver, done) {
      driver.url(url)
      done()
    })
    after(function(browser, done) {
      return browser.end(function() {
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
      const mainDocument = await driver.element('css selector', 'html')
      await driver.frame('frame1')
      await driver.frame('frame1-1')
      const frameDocument = await driver.element('css selector', 'html')
      assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
      await spec.mainContext(driver)
      const resultDocument = await driver.element('css selector', 'html')
      assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
    })
    it('parentContext()', async function(driver) {
      await driver.frame('frame1')
      const parentDocument = await driver.element('css selector', 'html')
      await driver.frame('frame1-1')
      const frameDocument = await driver.element('css selector', 'html')
      assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
      await spec.parentContext(driver)
      const resultDocument = await driver.element('css selector', 'html')
      assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
    })
    // TODO: suboptimal solution, revisit
    it('childContext(element)', async function(driver) {
      await driver.frame('frame1')
      const expectedDocument = await driver.element('css selector', 'html')
      await driver.frame()
      const frameElement = await driver.element('css selector', '[name="frame1"]')
      await spec.childContext(driver, frameElement)
      const resultDocument = await driver.element('css selector', 'html')
      assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
    })
    it('getSessionId()', function(driver) {
      const sessionId = driver.sessionId
      assert.deepStrictEqual(spec.getDriverInfo(driver).sessionId, sessionId)
    })
    it('getTitle()', async function(driver) {
      const expected = await driver.getTitle()
      assert.deepStrictEqual(await spec.getTitle(driver), expected)
    })
    //it.skip('getUrl()', getUrl())
    //it.skip('visit()', visit())
    //it.skip('isMobile()', isMobile({expected: false}))
    //it.skip('getPlatformName()', getPlatformName({expected: 'linux'}))
  })

  //describe('onscreen desktop (@webdriver)', async () => {
  //  before(async () => {
  //    ;[driver, destroyDriver] = await spec.build({browser: 'chrome', headless: false})
  //  })
  //  after(async () => {
  //    await destroyDriver()
  //  })
  //  it.skip('getWindowRect()', getWindowRect())
  //  it.skip(
  //    'setWindowRect({x, y, width, height})',
  //    setWindowRect({
  //      input: {x: 0, y: 0, width: 510, height: 511},
  //      expected: {x: 0, y: 0, width: 510, height: 511},
  //    }),
  //  )
  //  it.skip(
  //    'setWindowRect({x, y})',
  //    setWindowRect({
  //      input: {x: 11, y: 12},
  //      expected: {x: 11, y: 12, width: 510, height: 511},
  //    }),
  //  )
  //  it.skip(
  //    'setWindowRect({width, height})',
  //    setWindowRect({
  //      input: {width: 551, height: 552},
  //      expected: {x: 11, y: 12, width: 551, height: 552},
  //    }),
  //  )
  //})

  //describe('mobile driver (@mobile)', async () => {
  //  before(async () => {
  //    ;[driver, destroyDriver] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
  //  })
  //  after(async () => {
  //    await destroyDriver()
  //  })
  //  it.skip('isMobile()', isMobile({expected: true}))
  //  it.skip('getDeviceName()', getDeviceName({expected: 'Google Pixel 3a XL GoogleAPI Emulator'}))
  //  it.skip('getPlatformName()', getPlatformName({expected: 'Android'}))
  //  it.skip('isNative()', isNative({expected: false}))
  //  it.skip('getOrientation()', getOrientation({expected: 'portrait'}))
  //  it.skip('getPlatformVersion()', getPlatformVersion({expected: '10'}))
  //})

  //function isDriver({input, expected}) {
  //  return async () => {
  //    const isDriver = await spec.isDriver(input || driver)
  //    assert.strictEqual(isDriver, expected)
  //  }
  //}
  //function isElement({input, expected}) {
  //  return async () => {
  //    const element = await input()
  //    const isElement = await spec.isElement(element)
  //    assert.strictEqual(isElement, expected)
  //  }
  //}
  //function isSelector({input, expected}) {
  //  return async () => {
  //    const isSelector = await spec.isSelector(input)
  //    assert.strictEqual(isSelector, expected)
  //  }
  //}
  //function isEqualElements({input, expected}) {
  //  return async () => {
  //    const {element1, element2} = await input()
  //    const result = await spec.isEqualElements(driver, element1, element2)
  //    assert.deepStrictEqual(result, expected)
  //  }
  //}
  //function executeScript() {
  //  return async () => {
  //    const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
  //    const expected = await driver.executeScript('return arguments', ...args)
  //    const result = await spec.executeScript(driver, 'return arguments', ...args)
  //    assert.deepStrictEqual(result, expected)
  //  }
  //}
  //function mainContext() {
  //  return async () => {
  //    try {
  //      const mainDocument = await driver.findElement({css: 'html'})
  //      await driver.switchTo().frame(await driver.findElement({css: '[name="frame1"]'}))
  //      await driver.switchTo().frame(await driver.findElement({css: '[name="frame1-1"]'}))
  //      const frameDocument = await driver.findElement({css: 'html'})
  //      assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
  //      await spec.mainContext(driver)
  //      const resultDocument = await driver.findElement({css: 'html'})
  //      assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
  //    } finally {
  //      await driver
  //        .switchTo()
  //        .defaultContent()
  //        .catch(() => null)
  //    }
  //  }
  //}
  //function parentContext() {
  //  return async () => {
  //    try {
  //      await driver.switchTo().frame(await driver.findElement({css: '[name="frame1"]'}))
  //      const parentDocument = await driver.findElement({css: 'html'})
  //      await driver.switchTo().frame(await driver.findElement({css: '[name="frame1-1"]'}))
  //      const frameDocument = await driver.findElement({css: 'html'})
  //      assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
  //      await spec.parentContext(driver)
  //      const resultDocument = await driver.findElement({css: 'html'})
  //      assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
  //    } finally {
  //      await driver
  //        .switchTo()
  //        .frame(null)
  //        .catch(() => null)
  //    }
  //  }
  //}
  //function childContext() {
  //  return async () => {
  //    try {
  //      const element = await driver.findElement({css: '[name="frame1"]'})
  //      await driver.switchTo().frame(element)
  //      const expectedDocument = await driver.findElement({css: 'html'})
  //      await driver.switchTo().frame(null)
  //      await spec.childContext(driver, element)
  //      const resultDocument = await driver.findElement({css: 'html'})
  //      assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
  //    } finally {
  //      await driver
  //        .switchTo()
  //        .frame(null)
  //        .catch(() => null)
  //    }
  //  }
  //}
  //function findElement({input, expected} = {}) {
  //  return async () => {
  //    input = typeof input === 'function' ? input() : input
  //    const result = expected !== undefined ? expected : await driver.findElement(input)
  //    const element = await spec.findElement(driver, input)
  //    if (element !== result) {
  //      assert.ok(await spec.isEqualElements(driver, element, result))
  //    }
  //  }
  //}
  //function findElements({input, expected} = {}) {
  //  return async () => {
  //    input = typeof input === 'function' ? input() : input
  //    const result = expected !== undefined ? expected : await driver.findElements(input)
  //    const elements = await spec.findElements(driver, input)
  //    assert.strictEqual(elements.length, result.length)
  //    for (const [index, element] of elements.entries()) {
  //      assert.ok(await spec.isEqualElements(driver, element, result[index]))
  //    }
  //  }
  //}
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
  //function getSessionId() {
  //  return async () => {
  //    const session = await driver.getSession()
  //    const expected = await session.getId()
  //    const {sessionId} = await spec.getDriverInfo(driver)
  //    assert.deepStrictEqual(sessionId, expected)
  //  }
  //}
  //function getTitle() {
  //  return async () => {
  //    const expected = await driver.getTitle()
  //    const result = await spec.getTitle(driver)
  //    assert.deepStrictEqual(result, expected)
  //  }
  //}
  //function getUrl() {
  //  return async () => {
  //    const result = await spec.getUrl(driver)
  //    assert.deepStrictEqual(result, url)
  //  }
  //}
  //function visit() {
  //  return async () => {
  //    const blank = 'about:blank'
  //    await spec.visit(driver, blank)
  //    const actual = await driver.getCurrentUrl()
  //    assert.deepStrictEqual(actual, blank)
  //    await driver.get(url)
  //  }
  //}
  //function isMobile({expected} = {}) {
  //  return async () => {
  //    const {isMobile} = await spec.getDriverInfo(driver)
  //    assert.deepStrictEqual(isMobile, expected)
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
