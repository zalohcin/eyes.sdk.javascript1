'use strict'

const {
  ContextBasedScaleProviderFactory,
  CoordinatesType,
  FailureReports,
  FixedScaleProviderFactory,
  FullPageCaptureAlgorithm,
  EyesScreenshotNew: EyesScreenshot,
  EyesScreenshotFactory,
  ImageProviderFactory,
  Location,
  RectangleSize,
  NullCutProvider,
  NullScaleProvider,
  NullRegionProvider,
  ScaleProviderIdentityFactory,
  Region,
  RegionProvider,
  TestFailedError,
  TypeUtils,
  UserAgent,
  ArgumentGuard,
  SimplePropertyHandler,
  ReadOnlyPropertyHandler,
  ClassicRunner,
  EyesUtils,
  StitchMode,
  CssTranslatePositionProvider,
  CssTranslateElementPositionProvider,
  ScrollPositionProvider,
  ScrollElementPositionProvider,
  RegionPositionCompensationFactory,
  MatchResult,
} = require('@applitools/eyes-sdk-core')
const {DomCapture} = require('@applitools/dom-utils')
const WDIODriver = require('./wrappers/WDIODriver')
const WDIOElement = require('./wrappers/WDIOElement')
const EyesCore = require('./EyesCore')

const VERSION = require('../package.json').version

/**
 * @typedef {import('@applitools/eyes-sdk-core').EyesWrappedDriver} EyesWrappedDriver
 * @typedef {import('@applitools/eyes-sdk-core').EyesWrappedElement} EyesWrappedElement
 * @typedef {import('@applitools/eyes-sdk-core').EyesBrowsingContext} EyesBrowsingContext
 * @typedef {import('@applitools/eyes-sdk-core').EyesElementFinder} EyesElementFinder
 * @typedef {import('@applitools/eyes-sdk-core').EyesDriverController} EyesDriverController
 * @typedef {import('@applitools/eyes-sdk-core').EyesJsExecutor} EyesJsExecutor
 */

class EyesWDIO extends EyesCore {
  static get UNKNOWN_DEVICE_PIXEL_RATIO() {
    return 0
  }

  static get DEFAULT_DEVICE_PIXEL_RATIO() {
    return 1
  }

  /**
   * @override
   */
  getBaseAgentId() {
    return `eyes.webdriverio/${VERSION}`
  }

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {String} [serverUrl] The Eyes server URL.
   * @param {Boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {ClassicRunner} [runner] - Set shared ClassicRunner if you want to group results.
   **/
  constructor(serverUrl, isDisabled = false, runner = new ClassicRunner()) {
    super(serverUrl, isDisabled)
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)

    /** @type {EyesWrappedDriver} */
    this._driver = undefined
    /** @type {EyesJsExecutor} */
    this._executor = undefined
    /** @type {EyesElementFinder} */
    this._finder = undefined
    /** @type {EyesBrowsingContext} */
    this._context = undefined
    /** @type {EyesDriverController} */
    this._controller = undefined
    /** @type {boolean} */
    this._dontGetTitle = false

    this._imageRotationDegrees = 0
    this._automaticRotation = true
    /** @type {boolean} */
    this._isLandscape = false
    /** @type {boolean} */
    this._checkFullFrameOrElement = false

    /** @type {String} */
    this._originalDefaultContentOverflow = false
    /** @type {String} */
    this._originalFrameOverflow = false

    /** @type {String} */
    this._originalOverflow = null
    this._rotation = undefined
    /** @type {ImageProvider} */
    this._imageProvider = undefined
    /** @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined
    /** @type {number} */
    this._devicePixelRatio = EyesWDIO.UNKNOWN_DEVICE_PIXEL_RATIO
    /** @type {Region} */
    this._regionToCheck = null
    /** @type {WDIOElement} */
    this._targetElement = null
    /** @type {Location} */
    this._targetElementLocation = null
    /** @type {ScrollElementPositionProvider} */
    this._elementPositionProvider = undefined
    /** @type {int} */
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY
    /** @type {string}*/
    this._domUrl
    /** @type {EyesScreenshotFactory} */
    this._screenshotFactory = undefined
    /** @type {WDIOElement} */
    this._scrollRootElement = null
    /** @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }

  /**
   * @param {Object} driver
   * @param {String} [appName] - Application name
   * @param {String} [testName] - Test name
   * @param {RectangleSize|{width: number, height: number}} [viewportSize] - Viewport size
   * @param {SessionType} [sessionType] - The type of test (e.g.,  standard test / visual performance test).
   * @returns {Promise<WDIODriver>}
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver')

    this._logger.verbose('Running using Webdriverio module')

    this._driver = new WDIODriver(this._logger, driver)
    this._executor = this._driver.executor
    this._finder = this._driver.finder
    this._context = this._driver.context
    this._controller = this._driver.controller

    this._configuration.setAppName(
      TypeUtils.getOrDefault(appName, this._configuration.getAppName()),
    )
    this._configuration.setTestName(
      TypeUtils.getOrDefault(testName, this._configuration.getTestName()),
    )
    this._configuration.setViewportSize(
      TypeUtils.getOrDefault(viewportSize, this._configuration.getViewportSize()),
    )
    this._configuration.setSessionType(
      TypeUtils.getOrDefault(sessionType, this._configuration.getSessionType()),
    )

    if (!this._configuration.getViewportSize()) {
      const vs = await EyesUtils.getTopContextViewportSize(this._logger, this._driver)
      this._configuration.setViewportSize(vs.toJSON())
    }

    if (this._isDisabled) {
      this._logger.verbose('Ignored')
      return driver
    }

    this._devicePixelRatio = EyesWDIO.UNKNOWN_DEVICE_PIXEL_RATIO

    if (await this._controller.isMobileDevice()) {
      // set viewportSize to null if browser is mobile
      this._configuration.setViewportSize(null)
    }
    const userAgentString = await this._controller.getUserAgent()
    if (userAgentString) {
      this._userAgent = UserAgent.parseUserAgentString(userAgentString, true)
    }

    this._screenshotFactory = new EyesScreenshotFactory(this._logger, this)
    this._imageProvider = ImageProviderFactory.getImageProvider(
      this._logger,
      this._driver,
      this._rotation,
      this,
      this._userAgent,
      this._rotation,
    )
    this._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(
      this._userAgent,
      this,
      this._logger,
    )

    await this.openBase(
      this._configuration.getAppName(),
      this._configuration.getTestName(),
      this._configuration.getViewportSize(),
      this._configuration.getSessionType(),
    )

    return this._driver
  }

  /**
   *
   * @param name
   * @param {WebdriverioCheckSettings} checkSettings
   * @returns {Promise.<*>}
   */
  async check(name, checkSettings) {
    if (this._configuration.getIsDisabled()) {
      this._logger.log(`check('${name}', ${checkSettings}): Ignored`)
      return new MatchResult()
    }

    ArgumentGuard.notNull(checkSettings, 'checkSettings')
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name)
    } else {
      name = checkSettings.getName()
    }

    checkSettings.ignoreCaret(checkSettings.getIgnoreCaret() || this.getIgnoreCaret())
    this._logger.verbose(`check("${name}", checkSettings) - begin`)
    this._checkSettings = checkSettings

    await this._context.framesRefresh()

    const scrollRootElement = checkSettings.getScrollRootElement()
    if (this._context.frameChain.isEmpty) {
      if (scrollRootElement) {
        this._scrollRootElement = scrollRootElement
      }
      if (this._scrollRootElement) {
        await this._scrollRootElement.init(this._driver)
      }
    } else {
      if (scrollRootElement) {
        await scrollRootElement.init(this._driver)
        this._context.frameChain.current.scrollRootElement = scrollRootElement
      }
      if (this._scrollRootElement) {
        await this._context.framesSwitchAndReturn(null, () =>
          this._scrollRootElement.init(this._driver),
        )
      }
    }

    this.setPositionProvider(this._createPositionProvider(this._scrollRootElement))

    return this._beforeAndAfterCheck(checkSettings, async () => {
      this._stitchContent = checkSettings.getStitchContent()
      this._regionToCheck = null
      this._targetElementLocation = null
      let result
      const targetRegion = checkSettings.getTargetRegion()
      const targetElement = checkSettings.targetElement
      if (targetRegion) {
        this._targetElementLocation = targetRegion.getLocation()
        const source = await this._controller.getSource()
        result = await super.checkWindowBase(
          new RegionProvider(targetRegion),
          name,
          false,
          checkSettings,
          source,
        )
      } else if (targetElement) {
        this._targetElement = await targetElement.init(this._driver)
        if (this._stitchContent) {
          result = await this._checkFullElement(name, checkSettings)
        } else {
          result = await this._checkElement(name, checkSettings)
        }
        this._targetElement = null
      } else if (checkSettings.getFrameChain().length > 0) {
        if (this._stitchContent) {
          result = await this._checkFullFrame(name, checkSettings)
        } else {
          result = await this._checkFrame(name, checkSettings)
        }
      } else {
        const source = await this._controller.getSource()
        result = await super.checkWindowBase(
          new NullRegionProvider(),
          name,
          false,
          checkSettings,
          source,
        )
      }
      if (!result) {
        result = new MatchResult()
      }
      this._targetElement = null
      this._targetElementLocation = null
      this._stitchContent = false
      this._logger.verbose('check - done!')
      return result
    })
  }

  async _beforeAndAfterCheck(checkSettings, operation) {
    const originalFrameChain = this._context.frameChain
    const appendFrameChain = checkSettings.frameChain
    const isMobile = await this._controller.isMobileDevice()

    const shouldHideScrollbars =
      !isMobile &&
      (this._configuration.getHideScrollbars() ||
        (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent))
    if (shouldHideScrollbars) {
      await this._context.frameDefault()
      if (!this._scrollRootElement) {
        const element = await EyesUtils.getScrollRootElement(this._logger, this._executor)
        this._scrollRootElement = new WDIOElement(this._logger, this._driver, element)
      }
      await this._scrollRootElement.hideScrollbars()
      for (const frame of originalFrameChain) {
        await this._context.frame(frame.toReference())
        await frame.hideScrollbars()
      }
    }
    for (const frame of appendFrameChain) {
      await this._context.frame(frame)
      if (shouldHideScrollbars) await frame.hideScrollbars()
    }

    try {
      return await operation()
    } finally {
      if (shouldHideScrollbars) {
        const fullFrameChain = this._context.frameChain
        for (let index = fullFrameChain.size - 1; index >= 0; --index) {
          await fullFrameChain.frameAt(index).restoreScrollbars()
          await this._context.frameParent()
        }
        await this._scrollRootElement.restoreScrollbars()
      }
      await this._context.frames(originalFrameChain)
    }
  }

  /**
   * @private
   * @return {PositionProvider}
   */
  _createPositionProvider(scrollRootElement) {
    const stitchMode = this._configuration.getStitchMode()
    this._logger.verbose('initializing position provider. stitchMode:', stitchMode)

    if (stitchMode === StitchMode.CSS) {
      return new CssTranslatePositionProvider(this._logger, this._executor, scrollRootElement)
    } else {
      return new ScrollPositionProvider(this._logger, this._executor, scrollRootElement)
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkElement(name, checkSettings) {
    const that = this
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      /** @override */
      async getRegion() {
        const rect = await that._targetElement.getRect()
        that._targetElementLocation = rect.getLocation()
        return new Region(
          Math.ceil(rect.getLeft()),
          Math.ceil(rect.getTop()),
          rect.getWidth(),
          rect.getHeight(),
          CoordinatesType.CONTEXT_RELATIVE,
        )
      }
    }

    const source = await this._controller.getSource()
    const r = await super.checkWindowBase(
      new RegionProviderImpl(),
      name,
      false,
      checkSettings,
      source,
    )
    this._logger.verbose('Done! trying to scroll back to original position..')
    return r
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFullElement(name, checkSettings) {
    this._regionToCheck = null
    const frameChain = this._context.frameChain
    const scrollRootElement = !frameChain.isEmpty
      ? frameChain.current.scrollRootElement
      : this._scrollRootElement

    const positionProvider = this._createPositionProvider(scrollRootElement)
    const originalPositionMemento = await positionProvider.getState()

    try {
      await EyesUtils.ensureElementVisible(
        this._logger,
        this._driver,
        this._positionProviderHandler.get(),
        this._targetElement,
      )
      if (!frameChain.isEmpty) {
        const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
        this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
      }

      this._checkFullFrameOrElement = true

      const displayStyle = await this._targetElement.getCssProperty('display')
      if (displayStyle !== 'inline') {
        const insideAFrame = this._context.frameChain.size > 0
        if (insideAFrame && this._configuration.getStitchMode() === StitchMode.CSS) {
          this._elementPositionProvider = new CssTranslateElementPositionProvider(
            this._logger,
            this._driver,
            this._targetElement,
          )
        } else {
          this._elementPositionProvider = new ScrollElementPositionProvider(
            this._logger,
            this._driver,
            this._targetElement,
          )
        }
      } else {
        this._elementPositionProvider = null
      }

      if (this._configuration.getHideScrollbars()) {
        await this._targetElement.hideScrollbars()
      }

      const [rect, [borderLeftWidth, borderTopWidth]] = await Promise.all([
        this._targetElement.getRect(),
        this._targetElement.getCssProperty('border-left-width', 'border-top-width'),
      ])
      this._targetElementLocation = await rect.getLocation()
      this._regionToCheck = new Region(
        Math.round(rect.getLeft() + Number.parseFloat(borderLeftWidth)),
        Math.round(rect.getTop() + Number.parseFloat(borderTopWidth)),
        Math.round(rect.getWidth()),
        Math.round(rect.getHeight()),
        CoordinatesType.CONTEXT_AS_IS,
      )
      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport)
      }
      this._logger.verbose('Element region: ' + this._regionToCheck)

      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        name,
        false,
        checkSettings,
        source,
      )
    } finally {
      await this._targetElement.restoreScrollbars()
      this._checkFullFrameOrElement = false
      this._regionToCheck = null
      this._elementPositionProvider = null
      this._targetElementLocation = null
      await positionProvider.restoreState(originalPositionMemento)
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFrame(name, checkSettings) {
    const targetFrame = this._context.frameChain.current
    this._targetElement = targetFrame.element
    await this._context.frameParent()

    const r = await this._checkElement(name, checkSettings)
    this._targetElement = null
    this._targetElementLocation = Location.ZERO
    await this._context.frame(targetFrame)
    return r
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFullFrame(name, checkSettings) {
    this._checkFullFrameOrElement = true
    this._logger.verbose('checkFullFrameOrElement()')

    const that = this
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      /** @override */
      async getRegion() {
        const region = await that._getFullFrameOrElementRegion()
        that._targetElementLocation = region.getLocation()
        return region
      }
    }

    const source = await this._controller.getSource()
    const r = await super.checkWindowBase(
      new RegionProviderImpl(),
      name,
      false,
      checkSettings,
      source,
    )
    this._checkFullFrameOrElement = false
    return r
  }

  async _getFullFrameOrElementRegion() {
    if (this._checkFullFrameOrElement) {
      await EyesUtils.ensureFrameVisible(
        this._logger,
        this._context,
        this._positionProviderHandler.get(),
      )
      // FIXME - Scaling should be handled in a single place instead
      const scaleProviderFactory = await this._updateScalingParams()
      let screenshotImage = await this._imageProvider.getImage()
      await this._debugScreenshotsProvider.save(screenshotImage, 'checkFullFrameOrElement')
      const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth())
      // TODO: do we need to scale the image? We don't do it in Java
      screenshotImage = await screenshotImage.scale(scaleProvider.getScaleRatio())
      const screenshot = await EyesScreenshot.fromScreenshotType(
        this._logger,
        this,
        screenshotImage,
      )
      this._logger.verbose('replacing regionToCheck')
      this.setRegionToCheck(screenshot.getFrameWindow())
    }
    return Region.EMPTY
  }

  /**
   *
   * @returns {Promise<EyesScreenshot>}
   * @override
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()')

    const isMobile = await this._controller.isMobileDevice()

    let activeElement = null
    if (this._configuration.getHideCaret() && !isMobile) {
      activeElement = await EyesUtils.blurElement(this._logger, this._executor)
    }

    let result
    if (this._checkFullFrameOrElement) {
      result = await this._getFullFrameOrElementScreenshot()
    } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
      result = await this._getFullPageScreenshot()
    } else {
      result = await this._getViewportScreenshot()
    }

    if (this._configuration.getHideCaret() && activeElement) {
      await EyesUtils.focusElement(this._logger, this._executor, activeElement)
    }

    this._logger.verbose('Done!')
    return result
  }

  async getScreenshotUrl() {
    return undefined
  }

  async _getFullFrameOrElementScreenshot() {
    this._logger.verbose('Check full frame/element requested')

    const scaleProviderFactory = await this._updateScalingParams()
    const frameChain = this._context.frameChain
    const scrollRootElement = !frameChain.isEmpty
      ? frameChain.current.scrollRootElement
      : this._scrollRootElement
    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._executor,
      scrollRootElement,
    )
    const fullPageCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this._configuration.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      originProvider,
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider,
    )

    const positionProvider = !this._elementPositionProvider
      ? this._createPositionProvider(scrollRootElement)
      : this._positionProviderHandler.get()

    await positionProvider.markScrollRootElement()
    const fullFrameOrElementImage = await fullPageCapture.getStitchedRegion(
      this._regionToCheck,
      null,
      positionProvider,
    )

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromFrameSize(
      this._logger,
      this,
      fullFrameOrElementImage,
      fullFrameOrElementImage.getSize(),
    )
  }

  async _getFullPageScreenshot() {
    this._logger.verbose('Full page screenshot requested.')

    const scaleProviderFactory = await this._updateScalingParams()
    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._executor,
      this._scrollRootElement,
    )
    const fullCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this._configuration.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      originProvider,
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider,
    )
    const positionProvider = this._positionProviderHandler.get()
    const fullPageImage = await this._context.framesSwitchAndReturn(null, async () => {
      await positionProvider.markScrollRootElement()
      return fullCapture.getStitchedRegion(Region.EMPTY, null, positionProvider)
    })

    const frameChain = this._context.frameChain
    const originalFramePosition = !frameChain.isEmpty
      ? frameChain.first.parentScrollLocation
      : Location.ZERO

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(
      this._logger,
      this,
      fullPageImage,
      null,
      originalFramePosition,
    )
  }

  async _getViewportScreenshot() {
    this._logger.verbose('Screenshot requested...')
    const scaleProviderFactory = await this._updateScalingParams()

    await EyesUtils.ensureElementVisible(
      this._logger,
      this._driver,
      this._positionProviderHandler.get(),
      this._targetElement,
    )

    let screenshotImage = await this._imageProvider.getImage()
    await this._debugScreenshotsProvider.save(screenshotImage, 'original')

    const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth())
    if (scaleProvider.getScaleRatio() !== 1) {
      this._logger.verbose('scaling...')
      screenshotImage = await screenshotImage.scale(scaleProvider.getScaleRatio())
      await this._debugScreenshotsProvider.save(screenshotImage, 'scaled')
    }

    const cutProvider = this._cutProviderHandler.get()
    if (!(cutProvider instanceof NullCutProvider)) {
      this._logger.verbose('cutting...')
      screenshotImage = await cutProvider.cut(screenshotImage)
      await this._debugScreenshotsProvider.save(screenshotImage, 'cut')
    }

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(this._logger, this, screenshotImage)
  }

  /**
   * Updates the state of scaling related parameters.
   *
   * @protected
   * @return {Promise<ScaleProviderFactory>}
   */
  async _updateScalingParams() {
    // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
    if (
      this._devicePixelRatio !== EyesWDIO.UNKNOWN_DEVICE_PIXEL_RATIO &&
      !(this._scaleProviderHandler.get() instanceof NullScaleProvider)
    ) {
      // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
      const nullProvider = new SimplePropertyHandler()
      return new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider)
    }

    this._logger.verbose('Trying to extract device pixel ratio...')
    this._devicePixelRatio = await EyesUtils.getDevicePixelRatio(this._logger, this._driver)
      .catch(async err => {
        const isMobile = await this._controller.isMobileDevice()
        if (!isMobile) throw err
        const viewportSize = await this.getViewportSize()
        this._devicePixelRatio = await EyesUtils.getMobilePixelRatio(
          this._logger,
          this._driver,
          viewportSize,
        )
      })
      .catch(err => {
        this._logger.verbose('Failed to extract device pixel ratio! Using default.', err)
        this._devicePixelRatio = EyesWDIO.DEFAULT_DEVICE_PIXEL_RATIO
      })

    this._logger.verbose(`Device pixel ratio: ${this._devicePixelRatio}`)
    this._logger.verbose('Setting scale provider...')
    const factory = await this._getScaleProviderFactory().catch(err => {
      this._logger.verbose('Failed to set ContextBasedScaleProvider.', err)
      this._logger.verbose('Using FixedScaleProvider instead...')
      return new FixedScaleProviderFactory(1 / this._devicePixelRatio, this._scaleProviderHandler)
    })
    this._logger.verbose('Done!')
    return factory
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const entireSize = await EyesUtils.getCurrentFrameContentEntireSize(
      this._logger,
      this._executor,
    )
    return new ContextBasedScaleProviderFactory(
      this._logger,
      entireSize,
      this._viewportSizeHandler.get(),
      this._devicePixelRatio,
      false,
      this._scaleProviderHandler,
    )
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    let isErrorCaught = false
    this._closePromise = super
      .close(true)
      .catch(err => {
        isErrorCaught = true
        return err
      })
      .then(results => {
        if (this._runner) {
          this._runner._allTestResult.push(results)
        }
        if (isErrorCaught) {
          if (throwEx) throw results
          else return results.getTestResults()
        }
        return results
      })
  }

  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...')
      return await DomCapture.getFullWindowDom(this._logger, this._driver)
    } catch (ignored) {
      return ''
    }
  }

  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   *
   * @override
   * @inheritDoc
   */
  async getViewportSize() {
    const viewportSize = this._viewportSizeHandler.get()
    return viewportSize
      ? viewportSize
      : EyesUtils.getTopContextViewportSize(this._logger, this._driver)
  }

  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   *
   * @protected
   * @override
   */
  async setViewportSize(viewportSize) {
    if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
      this._logger.verbose('Ignored (viewport size given explicitly)')
      return Promise.resolve()
    }

    if (!(await this._controller.isMobileDevice())) {
      ArgumentGuard.notNull(viewportSize, 'viewportSize')
      viewportSize = new RectangleSize(viewportSize)
      try {
        await EyesUtils.setViewportSize(this._logger, this._driver, new RectangleSize(viewportSize))
        this._effectiveViewport = new Region(Location.ZERO, viewportSize)
      } catch (e) {
        throw new TestFailedError('Failed to set the viewport size', e)
      }
    }

    this._viewportSizeHandler.set(new RectangleSize(viewportSize))
  }

  async getAppEnvironment() {
    const appEnv = await super.getAppEnvironment()

    if (!appEnv._os) {
      const os = await this._controller.getMobileOS()
      if (os) {
        appEnv.setOs(os)
      }
    }
    return appEnv
  }

  /**
   * Set the failure report.
   * @param {FailureReports} mode Use one of the values in FailureReports.
   */
  setFailureReport(mode) {
    if (mode === FailureReports.IMMEDIATE) {
      this._failureReportOverridden = true
      mode = FailureReports.ON_CLOSE
    }

    EyesCore.prototype.setFailureReport.call(this, mode)
  }

  /**
   * @return {boolean}
   */
  async getSendDom() {
    return !(await this._controller.isMobileDevice()) && super.getSendDom()
  }

  async getInferredEnvironment() {
    try {
      const userAgent = await this._controller.getUserAgent()
      return userAgent ? 'useragent:' + userAgent : userAgent
    } catch (err) {
      return null
    }
  }

  async getAndSaveRenderingInfo() {
    const renderingInfo = await this._runner.getRenderingInfoWithCache()
    this._serverConnector.setRenderingInfo(renderingInfo)
  }

  async _getAndSaveBatchInfoFromServer(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    return this._runner.getBatchInfoWithCache(batchId)
  }

  // TODO Do we need this method?
  /**
   * @param {By} locator
   * @returns {Region}
   */
  async getRegionByLocator(locator) {
    const element = await this._finder.findElement(locator)
    const elementSize = await element.getSize()
    const point = await element.getLocation()
    return new Region(point.x, point.y, elementSize.width, elementSize.height)
  }
}

module.exports = EyesWDIO
