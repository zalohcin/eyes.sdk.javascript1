const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {URL} = require('url')
const {remote} = require('webdriverio')
const LegacySelector = require('./LegacySelector')

/**
 * Supported selector type
 * @typedef {string|Function|LegacySelector} SupportedSelector
 */

/**
 * Compatible element type
 * @typedef {UnwrappedElement|ResponseElement} SupportedElement
 */

/**
 * Unwrapped element supported by framework
 * @typedef {Object} UnwrappedElement
 * @property {string} ELEMENT - legacy element id
 * @property {string} element-6066-11e4-a52e-4f735466cecf - element id
 */

/**
 * Response element the object returned from find element operation
 * @typedef {Object} ResponseElement
 * @property {UnwrappedElement} value
 * @property {string} [selector]
 */

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

module.exports = {
  /* -------- ELEMENT -------- */

  isCompatible(element) {
    if (!element) return false
    return Boolean(element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
  },
  isSelector(selector) {
    return (
      TypeUtils.isString(selector) ||
      TypeUtils.isFunction(selector) ||
      selector instanceof LegacySelector
    )
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      if (selector.type === 'css') return `css selector:${selector.selector}`
      else if (selector.type === 'xpath') return `xpath:${selector.selector}`
    }
    return selector
  },
  toEyesSelector(selector) {
    if (selector instanceof LegacySelector) {
      const {using, value} = selector
      if (using === 'css selector') return {type: 'css', selector: value}
      else if (using === 'xpath') return {type: 'xpath', selector: value}
    } else if (TypeUtils.isString(selector)) {
      const match = selector.match(/(css selector|xpath):(.+)/)
      if (match) {
        const [_, using, value] = match
        if (using === 'css selector') return {type: 'css', selector: value}
        else if (using === 'xpath') return {type: 'xpath', selector: value}
      }
    }
    return {selector}
  },
  extractId(element) {
    return element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
  },
  extractElement(element) {
    return {
      [ELEMENT_ID]: this.extractId(element),
      [LEGACY_ELEMENT_ID]: this.extractId(element),
    }
  },
  extractSelector(element) {
    return element.selector
  },
  isStaleElementReferenceResult(result) {
    if (!result) return false
    return result instanceof Error && result.name === 'stale element reference'
  },

  /* -------- DRIVER -------- */

  async executeScript(driver, script, ...args) {
    return driver.execute(script, ...args)
  },
  async sleep(driver, ms) {
    return driver.pause(ms)
  },
  async switchToFrame(driver, reference) {
    return driver.switchToFrame(reference)
  },
  async switchToParentFrame(driver) {
    return driver.switchToParentFrame()
  },
  async findElement(driver, selector) {
    const element = await driver.$(
      selector instanceof LegacySelector ? selector.toString() : selector,
    )
    return !element.error ? element : null
  },
  async findElements(driver, selector) {
    const elements = await driver.$$(
      selector instanceof LegacySelector ? selector.toString() : selector,
    )
    return Array.from(elements)
  },
  async getWindowLocation(driver) {
    const location = TypeUtils.isFunction(driver.getWindowPosition)
      ? await driver.getWindowPosition()
      : await driver.getWindowRect()
    return {x: location.x, y: location.y}
  },
  async setWindowLocation(driver, location = {}) {
    // devtools protocol doesn't support change position on runtime
    if (driver.isDevTools) return
    return TypeUtils.isFunction(driver.setWindowPosition)
      ? driver.setWindowPosition(location.x, location.y)
      : driver.setWindowRect(location.x, location.y, null, null)
  },
  async getWindowSize(driver) {
    const size = TypeUtils.isFunction(driver.getWindowSize)
      ? await driver.getWindowSize()
      : await driver.getWindowRect()
    return {width: size.width, height: size.height}
  },
  async setWindowSize(driver, size = {}) {
    return TypeUtils.isFunction(driver.setWindowSize)
      ? driver.setWindowSize(size.width, size.height)
      : driver.setWindowRect(null, null, size.width, size.height)
  },
  async getOrientation(driver) {
    const orientation = await driver.getOrientation()
    return orientation.toLowerCase()
  },
  async isMobile(driver) {
    return driver.isMobile
  },
  async isAndroid(driver) {
    return driver.isAndroid
  },
  async isIOS(driver) {
    return driver.isIOS
  },
  async isNative(driver) {
    return driver.isMobile && !driver.capabilities.browserName
  },
  async getPlatformVersion(driver) {
    return driver.capabilities.platformVersion
  },
  async getBrowserName(driver) {
    return driver.capabilities.browserName
  },
  async getBrowserVersion(driver) {
    return driver.capabilities.browserVersion
  },
  async getSessionId(driver) {
    return driver.sessionId
  },
  async takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async getUrl(driver) {
    return driver.getUrl()
  },
  async visit(driver, url) {
    return driver.url(url)
  },

  /* -------- TESTING -------- */

  async build({capabilities, server, logLevel = 'silent', protocol = 'webdriver'} = {}) {
    const options = {capabilities, logLevel, automationProtocol: protocol}
    if (server && server.url) {
      const url = new URL(server.url)
      options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
      options.hostname = url.hostname
      options.port = Number(url.port)
      options.path = url.pathname
      if (server.url.includes('saucelabs.com')) {
        if (server.w3c) {
          if (!options.capabilities['sauce:options']) {
            options.capabilities['sauce:options'] = {}
          }
          options.capabilities['sauce:options'].username = server.username
          options.capabilities['sauce:options'].accessKey = server.accessKey
        } else {
          options.capabilities.username = server.username
          options.capabilities.accessKey = server.accessKey
        }
      } else if (server.url.includes('browserstack.com')) {
        if (server.w3c) {
          if (!options.capabilities['bstack:options']) {
            options.capabilities['bstack:options'] = {}
          }
          options.capabilities['bstack:options'].userName = server.username
          options.capabilities['bstack:options'].accessKey = server.accessKey
        } else {
          options.capabilities['browserstack.user'] = server.username
          options.capabilities['browserstack.key'] = server.accessKey
        }
      }
    }
    return remote(options)
  },
  async cleanup(driver) {
    return driver.deleteSession()
  },
  async click(driver, element) {
    const extended = await driver.$(element)
    return extended.click()
  },
  async type(driver, element, keys) {
    const extended = await driver.$(element)
    return extended.setValue(keys)
  },
  async waitUntilDisplayed(driver, selector, timeout) {
    const el = await this.findElement(driver, selector)
    return el.waitForDisplayed({timeout})
  },
  async getElementRect(_driver, element) {
    if (TypeUtils.isFunction(element.getRect)) {
      return element.getRect()
    } else {
      const size = await element.getSize()
      const location = await element.getLocation()
      return {...location, ...size}
    }
  },
}
