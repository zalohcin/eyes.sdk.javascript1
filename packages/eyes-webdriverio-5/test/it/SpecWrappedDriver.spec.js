const assert = require('assert')
const {TestSetup} = require('@applitools/sdk-coverage-tests/coverage-tests')
const spec = require('../../src/SpecWrappedDriver')

describe('SpecWrappedDriver', async () => {
  let driver
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  async function isEqualElements(leftElement, rightElement) {
    try {
      return await driver.execute(
        (leftElement, rightElement) => leftElement === rightElement,
        leftElement,
        rightElement,
      )
    } catch (err) {
      return false
    }
  }

  function executeScript() {
    return async () => {
      const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
      const expected = await driver.execute('return arguments', ...args)
      const result = await spec.executeScript(driver, 'return arguments', ...args)
      assert.deepStrictEqual(result, expected)
    }
  }
  function sleep() {
    return async () => {
      const sleep = 1000
      const startAt = Date.now()
      await spec.sleep(driver, sleep)
      const duration = Date.now() - startAt
      assert.ok(duration >= sleep && duration <= sleep + 10)
    }
  }
  function switchToFrame_nested() {
    return async () => {
      const element = await driver.findElement('css selector', '[name="frame1"]')
      await driver.switchToFrame(element)
      const expected = await driver.execute('return document.documentElement')
      await driver.switchToFrame(null)
      await spec.switchToFrame(driver, element)
      const result = await driver.execute('return document.documentElement')
      try {
        assert.ok(await isEqualElements(result, expected))
      } finally {
        await driver.switchToFrame(null)
      }
    }
  }
  function switchToFrame_top() {
    return async () => {
      const top = await driver.execute('return document.documentElement')
      const element = await driver.findElement('css selector', '[name="frame1"]')
      await driver.switchToFrame(element)
      const frame = await driver.execute('return document.documentElement')
      assert.ok(!(await isEqualElements(frame, top)))
      await spec.switchToFrame(driver, null)
      const result = await driver.execute('return document.documentElement')
      assert.ok(await isEqualElements(result, top))
    }
  }
  function findElement({input, expected} = {}) {
    return async () => {
      const result = expected !== undefined ? expected : await driver.$(input)
      const element = await spec.findElement(driver, input)
      if (element !== result) {
        assert.ok(await isEqualElements(element, result))
      }
    }
  }
  function findElements({input, expected} = {}) {
    return async () => {
      const result = expected !== undefined ? expected : await driver.$$(input)
      const elements = await spec.findElements(driver, input)
      assert.strictEqual(elements.length, result.length)
      for (const [index, element] of elements.entries()) {
        assert.ok(await isEqualElements(element, result[index]))
      }
    }
  }
  function getWindowLocation({legacy = false} = {}) {
    return async () => {
      const {x, y} = legacy ? await driver.getWindowPosition() : await driver.getWindowRect()
      const result = await spec.getWindowLocation(driver)
      assert.deepStrictEqual(result, {x, y})
    }
  }
  function setWindowLocation({legacy = false, expected} = {}) {
    return async () => {
      legacy
        ? await driver.setWindowSize(300, 300)
        : await driver.setWindowRect(null, null, 300, 300)
      const location = {x: 100, y: 110}
      await spec.setWindowLocation(driver, location)
      const {x, y} = legacy ? await driver.getWindowPosition() : await driver.getWindowRect()
      assert.deepStrictEqual({x, y}, expected || location)
    }
  }
  function getWindowSize({legacy = false} = {}) {
    return async () => {
      const {width, height} = legacy ? await driver.getWindowSize() : await driver.getWindowRect()
      const result = await spec.getWindowSize(driver)
      assert.deepStrictEqual(result, {width, height})
    }
  }
  function setWindowSize({legacy = true, expected} = {}) {
    return async () => {
      const size = {width: 300, height: 310}
      await spec.setWindowSize(driver, size)
      const {width, height} = legacy ? await driver.getWindowSize() : await driver.getWindowRect()
      assert.deepStrictEqual({width, height}, expected || size)
    }
  }
  function getSessionId() {
    return async () => {
      const expected = driver.sessionId
      const result = await spec.getSessionId(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getTitle() {
    return async () => {
      const expected = await driver.getTitle()
      const result = await spec.getTitle(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getUrl() {
    return async () => {
      const result = await spec.getUrl(driver)
      assert.deepStrictEqual(result, url)
    }
  }
  function visit() {
    return async () => {
      const blank = 'about:blank'
      await spec.visit(driver, blank)
      const actual = await driver.getUrl()
      assert.deepStrictEqual(actual, blank)
      await driver.url(url)
    }
  }
  function isMobile({expected} = {}) {
    return async () => {
      const result = await spec.isMobile(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function isAndroid({expected} = {}) {
    return async () => {
      const result = await spec.isAndroid(driver)
      assert.strictEqual(result, expected)
    }
  }
  function isIOS({expected} = {}) {
    return async () => {
      const result = await spec.isIOS(driver)
      assert.strictEqual(result, expected)
    }
  }
  function isNative({expected} = {}) {
    return async () => {
      const result = await spec.isNative(driver)
      assert.strictEqual(result, expected)
    }
  }
  function getOrientation({expected} = {}) {
    return async () => {
      const result = await spec.getOrientation(driver)
      assert.strictEqual(result, expected)
    }
  }
  function getPlatformVersion({expected} = {}) {
    return async () => {
      const result = await spec.getPlatformVersion(driver)
      assert.strictEqual(result, expected)
    }
  }

  describe('headless desktop (@webdriver)', async () => {
    before(async () => {
      driver = await spec.build({capabilities: TestSetup.Browsers.chrome({headless: true})})
      await driver.url(url)
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('executeScript(strings, ...args)', executeScript())
    it('sleep(number)', sleep())
    it('switchToFrame(element)', switchToFrame_nested())
    it('switchToFrame(null)', switchToFrame_top())
    it('findElement(string)', findElement({input: '#overflowing-div'}))
    it('findElements(string)', findElements({input: 'div'}))
    it(
      'findElement(function)',
      findElement({
        input: function() {
          return this.document.getElementById('overflowing-div')
        },
      }),
    )
    it(
      'findElements(function)',
      findElements({
        input: function() {
          return this.document.querySelectorAll('div')
        },
      }),
    )
    it('findElement(non-existent)', findElement({input: 'non-existent', expected: null}))
    it('findElements(non-existent)', findElements({input: 'non-existent', expected: []}))
    it('getWindowSize()', getWindowSize())
    it('setWindowSize({width, height})', setWindowSize())
    it('getSessionId()', getSessionId())
    it('getTitle()', getTitle())
    it('getUrl()', getUrl())
    it('visit()', visit())
    it('isMobile()', isMobile({expected: false}))
  })

  describe('onscreen desktop (@webdriver)', async () => {
    before(async () => {
      driver = await spec.build({capabilities: TestSetup.Browsers.chrome({headless: false})})
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('getWindowLocation()', getWindowLocation())
    it('setWindowLocation({x, y})', setWindowLocation())
  })

  describe('headless desktop (@puppeteer)', async () => {
    before(async () => {
      driver = await spec.build({
        protocol: 'devtools',
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            headless: true,
          },
        },
      })
      await driver.url(url)
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('executeScript(strings, ...args)', executeScript())
    it('sleep(number)', sleep())
    it('switchToFrame(element)', switchToFrame_nested())
    it('switchToFrame(null)', switchToFrame_top())
    it('findElement(string)', findElement({input: '#overflowing-div'}))
    it('findElements(string)', findElements({input: 'div'}))
    it(
      'findElement(function)',
      findElement({
        input: function() {
          return this.document.getElementById('overflowing-div')
        },
      }),
    )
    it(
      'findElements(function)',
      findElements({
        input: function() {
          return this.document.querySelectorAll('div')
        },
      }),
    )
    it('findElement(non-existent)', findElement({input: 'non-existent', expected: null}))
    it('findElements(non-existent)', findElements({input: 'non-existent', expected: []}))
    it('getWindowSize()', getWindowSize())
    it('setWindowSize()', setWindowSize())
    it('getSessionId()', getSessionId())
    it('getTitle()', getTitle())
    it('getUrl()', getUrl())
    it('visit()', visit())
    it('isMobile()', isMobile({expected: false}))
  })

  describe('onscreen desktop (@puppeteer)', async () => {
    before(async () => {
      driver = await spec.build({
        protocol: 'devtools',
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            headless: false,
          },
        },
      })
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('getWindowLocation()', getWindowLocation())
    it('setWindowLocation({x, y})', setWindowLocation({expected: {x: null, y: null}}))
  })

  describe('legacy browser (@webdriver)', async () => {
    before(async () => {
      driver = await spec.build({
        capabilities: {
          browserName: 'internet explorer',
          platformName: 'Windows 10',
          browserVersion: '11.285',
        },
        server: TestSetup.Remotes.sauce(),
      })
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('getWindowSize()', getWindowSize({legacy: true}))
    it('setWindowSize({width, height})', setWindowSize({legacy: true}))
    it('getWindowLocation()', getWindowLocation({legacy: true}))
    it('setWindowLocation({x, y})', setWindowLocation({legacy: true}))
  })

  describe('mobile browser (@appium)', async () => {
    before(async () => {
      driver = await spec.build({
        capabilities: {
          browserName: 'Chrome',
          platformName: 'Android',
          platformVersion: '10.0',
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          deviceOrientation: 'portrait',
        },
        server: TestSetup.Remotes.sauce(),
      })
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('isMobile()', isMobile({expected: true}))
    it('isAndroid()', isAndroid({expected: true}))
    it('isIOS()', isIOS({expected: false}))
    it('isNative()', isNative({expected: false}))
    it('getOrientation()', getOrientation({expected: 'portrait'}))
    it('getPlatformVersion()', getPlatformVersion({expected: '10'}))
  })

  describe('native app (@appium @native)', async () => {
    before(async () => {
      driver = await spec.build({
        capabilities: {
          browserName: '',
          name: 'AndroidNativeAppTest1',
          platformName: 'Android',
          platformVersion: '6.0',
          deviceName: 'Android Emulator',
          deviceOrientation: 'landscape',
          app: 'http://saucelabs.com/example_files/ContactManager.apk',
          clearSystemFiles: true,
          noReset: true,
        },
        server: TestSetup.Remotes.sauce(),
      })
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('isMobile()', isMobile({expected: true}))
    it('isAndroid()', isAndroid({expected: true}))
    it('isIOS()', isIOS({expected: false}))
    it('isNative()', isNative({expected: true}))
    it('getOrientation()', getOrientation({expected: 'landscape'}))
    it('getPlatformVersion()', getPlatformVersion({expected: '6.0'}))
  })
})
