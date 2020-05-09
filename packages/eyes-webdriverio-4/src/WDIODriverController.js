const {
  Location,
  RectangleSize,
  Region,
  MutableImage,
  EyesDriverOperationError,
} = require('@applitools/eyes-sdk-core')

class WDIODriverController {
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }

  async getWindowRect(handle) {
    const [location, size] = await Promise.all([
      this.getWindowLocation(handle),
      this.getWindowSize(handle),
    ])
    return new Region(location, size)
  }

  async setWindowRect(rect, handle) {
    if (rect instanceof Region) {
      rect = Object.assign(rect.getLocation().toJSON(), rect.getSize().toJSON())
    }
    await Promise.all([
      this.setWindowLocation(handle, {x: rect.x, y: rect.y}),
      this.setWindowSize(handle, {width: rect.width, height: rect.height}),
    ])
  }

  async getWindowLocation(handle) {
    const {value: location} = await this._driver.unwrapped.windowHandlePosition(handle)
    return new Location(location)
  }

  async setWindowLocation(location, handle) {
    if (location instanceof Location) {
      location = location.toJSON()
    }
    await this._driver.unwrapped.windowHandlePosition(handle, location)
  }

  async getWindowSize(handle) {
    const {value: size} = await this._driver.unwrapped.windowHandleSize(handle)
    return new RectangleSize(size)
  }

  async setWindowSize(size, handle) {
    if (size instanceof RectangleSize) {
      size = size.toJSON()
    }
    await this._driver.unwrapped.windowHandleSize(handle, size)
  }

  async takeScreenshot() {
    const screenshot64 = await this._driver.unwrapped.saveScreenshot()
    const image = new MutableImage(screenshot64)
    return image
  }

  async isLandscapeOrientation() {
    try {
      const orientation = await this._driver.unwrapped.getOrientation()
      return orientation === 'landscape'
    } catch (err) {
      throw new EyesDriverOperationError('Failed to get orientation!', err)
    }
  }

  async isMobileDevice() {
    return this._driver.unwrapped.isMobile
  }

  async getMobileOS() {
    if (this._driver.unwrapped.isMobile) {
      let os = ''
      if (this._driver.unwrapped.isAndroid) {
        this._logger.log('Android detected.')
        os = 'Android'
      } else if (this._driver.unwrapped.isIOS) {
        this._logger.log('iOS detected.')
        os = 'iOS'
      } else {
        this._logger.log('Unknown device type.')
      }

      if (os) {
        let version
        if (this._driver.unwrapped.capabilities) {
          version = this._driver.unwrapped.capabilities.platformVersion
        } else if (this._driver.unwrapped.desiredCapabilities) {
          version = this._driver.unwrapped.desiredCapabilities.platformVersion
        }
        if (version) {
          os += ` ${version}`
        }
        this._logger.verbose(`Setting OS: ${os}`)
        return os
      }
    } else {
      this._logger.log('No mobile OS detected.')
    }
  }

  async getAUTSessionId() {
    return this._driver.unwrapped.requestHandler.sessionID || this._driver.unwrapped.sessionId
  }

  async getTitle() {
    return this._driver.unwrapped.getTitle()
  }

  async getUserAgent() {
    try {
      const userAgent = await this._driver.executor.executeScript('return navigator.userAgent')
      this._logger.verbose(`user agent: ${userAgent}`)
      return userAgent
    } catch (err) {
      this._logger.verbose('Failed to obtain user-agent string')
      return null
    }
  }

  async getSource() {
    if (!(await this.isMobileDevice())) {
      return this._driver.unwrapped.getUrl()
    } else {
      return null
    }
  }
}

module.exports = WDIODriverController
