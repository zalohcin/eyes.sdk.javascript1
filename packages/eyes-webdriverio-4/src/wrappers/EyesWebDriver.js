const {
  ArgumentGuard,
  TypeUtils,
  EyesJsBrowserUtils,
  MutableImage,
  RectangleSize,
  Location,
} = require('@applitools/eyes-sdk-core')

const FrameChain = require('../frames/FrameChain')
const Frame = require('../frames/Frame')
const SeleniumService = require('../services/selenium/SeleniumService')
const EyesWebElement = require('./EyesWebElement')
const EyesWDIOUtils = require('../EyesWDIOUtils')
const WDIOJSExecutor = require('../WDIOJSExecutor')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const By = require('../By')

class EyesWebDriver {
  constructor(webdriver, eyes, logger) {
    if (webdriver instanceof EyesWebDriver) {
      return webdriver
    }

    this._webdriver = webdriver.getPrototype()
    this._isMobile = webdriver.isMobile
    this._isIOS = webdriver.isIOS
    this._isAndroid = webdriver.isAndroid
    this._desiredCapabilities = webdriver.desiredCapabilities
    this._seleniumService = new SeleniumService(webdriver.requestHandler)
    this._eyes = eyes
    this._logger = logger
    this._jsExecutor = new WDIOJSExecutor(this)
    this._scrollPosition = new ScrollPositionProvider(this._logger, this._jsExecutor)
    this._frameChain = new FrameChain(this._logger)
    this._rotation = null

    return new Proxy(this, {
      get(target, key, receiver) {
        if (key in target) {
          return Reflect.get(target, key, receiver)
        }
        return Reflect.get(target._webdriver, key)
      },
    })
  }

  get desiredCapabilities() {
    return this._desiredCapabilities
  }

  get isMobile() {
    return this._isMobile
  }

  get isAndroid() {
    return this._isAndroid
  }

  get isIOS() {
    return this._isIOS
  }

  get remoteWebDriver() {
    return this._webdriver
  }

  get eyes() {
    return this._eyes
  }

  get jsExecutor() {
    return this._jsExecutor
  }

  get frameChain() {
    return this._frameChain
  }

  get rotation() {
    return this._rotation
  }

  /**
   * @param {number} rotation The image rotation data.
   */
  set rotation(rotation) {
    this._rotation = rotation
  }

  async element(locator) {
    const selector = locator.value || locator
    const result = await this._webdriver.element(selector)
    const element = result.value
    if (element === null && result.type === 'NoSuchElement' && result.state === 'failure') {
      throw new Error(result.message)
    }
    return new EyesWebElement(element, locator, this, this._logger)
  }

  async elements(locator) {
    const selector = locator.value || locator
    const result = await this._webdriver.elements(selector)
    const elements = result.value
    return elements.map(element => new EyesWebElement(element, locator, this, this._logger))
  }

  async execute(script, ...args) {
    try {
      const result = await this._webdriver.execute(
        script,
        ...args.map(arg => (arg instanceof EyesWebElement ? arg.jsonElement : arg)),
      )
      this._logger.verbose('Done!')
      return result.value
    } catch (err) {
      this._logger.verbose('WARNING: execute script error: ' + err)
      throw err
    }
  }

  async executeAsync(script, ...args) {
    try {
      const result = await this._webdriver.executeAsync(
        script,
        ...args.map(arg => (arg instanceof EyesWebElement ? arg.jsonElement : arg)),
      )
      this._logger.verbose('Done!')
      return result.value
    } catch (err) {
      this._logger.verbose('WARNING: execute async script error: ' + err)
      throw err
    }
  }

  async frame(arg) {
    if (!arg) {
      this._logger.verbose('EyesWebDriver.frame(null)')
      return this.frameDefault()
    }

    let frame
    if (TypeUtils.isInteger(arg)) {
      const frameIndex = arg
      this._logger.verbose(`EyesWebDriver.frame(${frameIndex})`)
      this._logger.verbose('Getting frames list...')
      const frames = await this.elements('frame, iframe')
      if (frameIndex > frames.length) {
        throw new TypeError(`Frame index [${frameIndex}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      frame = await this.frameInit(frames[frameIndex])
    } else if (TypeUtils.isString(arg)) {
      const frameNameOrId = arg
      this._logger.verbose(`EyesWebDriver.frame(${frameNameOrId})`)
      this._logger.verbose('Getting frames by name...')
      let frames = await this.elements(By.name(frameNameOrId))
      if (frames.length === 0) {
        this._logger.verbose('No frames Found! Trying by id...')
        frames = await this.elements(By.id(frameNameOrId))
        if (frames.length === 0) {
          throw new TypeError(`No frame with name or id '${frameNameOrId}' exists!`)
        }
      }
      frame = await this.frameInit(frames[0])
    } else if (arg instanceof EyesWebElement) {
      this._logger.verbose('EyesWebDriver.frame(wdioElement)')
      frame = await this.frameInit(arg)
    } else if (EyesWebElement.isWDIOElement(arg)) {
      this._logger.verbose('EyesWebDriver.frame(wdioElement)')
      frame = await this.frameInit(new EyesWebElement(arg, '', this, this._logger))
    } else if (arg instanceof Frame) {
      frame = arg
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }

    this._logger.verbose('Done! Switching to frame...')
    await this._webdriver.frame(frame.getReference().jsonElement)
    await this._frameChain.push(frame)
    this._logger.verbose('Done!')
  }

  async frameParent() {
    this._logger.verbose('EyesWebDriver.frameParent()')
    await this._webdriver.frameParent()
    if (this._frameChain.size > 0) {
      this._logger.verbose('Making preparations...')
      this._frameChain.pop()
    }
    this._logger.verbose('Done! Switching to parent frame..')
  }

  async frameDefault() {
    this._logger.verbose('EyesWebDriver.frameDefault()')
    if (this._frameChain.size > 0) {
      this._logger.verbose('Making preparations...')
      this._frameChain.clear()
    }
    this._logger.verbose('Done! Switching to default content...')
    await this._webdriver.frame()
    this._logger.verbose('Done!')
  }

  async frameInit(element) {
    const [
      rect,
      [clientWidth, clientHeight],
      [borderLeftWidth, borderTopWidth],
      originalOverflow,
      originalLocation,
    ] = await EyesWebElement.refreshElement(() => {
      return Promise.all([
        element.getRect(),
        element.getProperties(['clientWidth', 'clientHeight']),
        element.getCssProperties(['border-left-width', 'border-top-width']),
        element.getOverflow(),
        EyesWDIOUtils.getCurrentScrollPosition(element.driver.jsExecutor),
      ])
    }, element)

    return new Frame({
      logger: this._logger,
      driver: this,
      element,
      size: new RectangleSize(Math.round(rect.width), Math.round(rect.height)),
      innerSize: new RectangleSize(Math.round(clientWidth), Math.round(clientHeight)),
      location: new Location(
        Math.round(rect.x + Number.parseFloat(borderLeftWidth)),
        Math.round(rect.y + Number.parseFloat(borderTopWidth)),
      ),
      originalLocation,
      originalOverflow,
    })
  }

  async frames(arg) {
    if (arg instanceof FrameChain) {
      const frameChain = arg
      this._logger.verbose('EyesWebDriver.frames(frameChain)')
      await this.frameDefault()
      for (const frame of frameChain) {
        await this.frame(frame.getReference())
      }
      this._logger.verbose('Done switching into nested frames!')
    } else if (TypeUtils.isArray(arg)) {
      const framePath = arg
      this._logger.verbose('EyesWebDriver.frames(framesPath)')
      for (const frameNameOrId of framePath) {
        await this.frame(frameNameOrId)
      }
      this._logger.verbose('Done switching into nested frames!')
    }
  }

  // TODO try to remove
  async framesDoScroll(frameChain) {
    this._logger.verbose('EyesWebDriver.framesDoScroll(frameChain)')
    await this.frameDefault()
    this._frameDefaultPositionMemento = await this._scrollPosition.getState()
    for (const frame of frameChain) {
      this._logger.verbose('Scrolling by parent scroll position...')
      const frameLocation = frame.getLocation()
      await this._scrollPosition.setPosition(frameLocation)
      await this.frame(frame)
    }
    this._logger.verbose('Done switching into nested frames!')
  }

  // TODO
  async framesRefresh() {
    const currentFrame = this._frameChain.peek()
    const framePath = []
    let targetFrame
    while ((targetFrame = await this.getTargetFrame())) {
      if (currentFrame && currentFrame.getReference().elementId === targetFrame.ELEMENT) break
      await this.frameParent()
      const xpath = await EyesJsBrowserUtils.getElementXpath(this._jsExecutor, targetFrame)
      framePath.unshift(new EyesWebElement(targetFrame, By.xPath(`/${xpath}`), this, this._logger))
    }

    await this.frames(framePath)
  }

  // TODO
  async takeScreenshot() {
    // Get the image as base64.
    const screenshot64 = await this._webdriver.saveScreenshot()
    let screenshot = new MutableImage(screenshot64)
    screenshot = await EyesWebDriver.normalizeRotation(
      this._logger,
      this._tsInstance,
      screenshot,
      this._rotation,
    )
    return screenshot.getImageBase64()
  }

  async getUserAgent() {
    try {
      let {value: userAgent} = await this._webdriver.execute('return navigator.userAgent')
      this._logger.verbose('user agent: ' + userAgent)
      return userAgent
    } catch (e) {
      this._logger.verbose('Failed to obtain user-agent string')
      return null
    }
  }

  async getTargetFrame() {
    const {value: element} = await this._webdriver.execute('return window.frameElement')
    return element
  }

  // TODO
  async getDefaultContentViewportSize(forceQuery = false) {
    this._logger.verbose('getDefaultContentViewportSize()')
    if (this._defaultContentViewportSize && !forceQuery) {
      this._logger.verbose('Using cached viewport size: ', this._defaultContentViewportSize)
      return this._defaultContentViewportSize
    }
    const currentFrames = this._frameChain.clone()
    if (currentFrames.size > 0) {
      await this.frameDefault()
    }
    this._logger.verbose('Extracting viewport size...')
    this._defaultContentViewportSize = await EyesWDIOUtils.getViewportSizeOrDisplaySize(
      this._logger,
      this,
    )
    this._logger.verbose('Done! Viewport size: ', this._defaultContentViewportSize)
    if (currentFrames.size > 0) {
      await this.frames(currentFrames)
    }
    return this._defaultContentViewportSize
  }

  async getCurrentUrl() {
    if (!EyesWDIOUtils.isMobileDevice(this._webdriver)) {
      return this._webdriver.getUrl()
    } else {
      return null
    }
  }

  async url(url) {
    this._frameChain.clear()
    return this._webdriver.url(url)
  }

  /**
   * @param {Command} cmd
   * @returns {Promise<void>}
   */
  executeCommand(cmd) {
    return this._seleniumService.execute(cmd)
  }
}

module.exports = EyesWebDriver
