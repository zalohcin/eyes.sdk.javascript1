'use strict'
const {
  StitchMode,
  CoordinatesType,
  ArgumentGuard,
  TypeUtils,
  Location,
  RectangleSize,
  Region,
  UserAgent,
  ReadOnlyPropertyHandler,
  SimplePropertyHandler,
} = require('@applitools/eyes-common')

const {FailureReports} = require('./FailureReports')
const {TestFailedError} = require('./errors/TestFailedError')
const {MatchResult} = require('./match/MatchResult')
const {FullPageCaptureAlgorithm} = require('./capture/FullPageCaptureAlgorithm')
const EyesScreenshot = require('./capture/EyesScreenshotNew')
const EyesScreenshotFactory = require('./capture/EyesScreenshotFactory')
const ImageProviderFactory = require('./capture/ImageProviderFactory')
const NullRegionProvider = require('./positioning/NullRegionProvider')
const RegionProvider = require('./positioning/RegionProvider')
const {NullCutProvider} = require('./cropping/NullCutProvider')
const {NullScaleProvider} = require('./scaling/NullScaleProvider')
const {ScaleProviderIdentityFactory} = require('./scaling/ScaleProviderIdentityFactory')
const {ContextBasedScaleProviderFactory} = require('./scaling/ContextBasedScaleProviderFactory')
const {FixedScaleProviderFactory} = require('./scaling/FixedScaleProviderFactory')
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory')
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider')
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider')
const CssTranslateElementPositionProvider = require('./positioning/CssTranslateElementPositionProvider')
const ScrollElementPositionProvider = require('./positioning/ScrollElementPositionProvider')
const ClassicRunner = require('./runner/ClassicRunner')
const EyesUtils = require('./EyesUtils')
const EyesCore = require('./EyesCore')

const VERSION = require('../package.json').version

/**
 * @typedef {import('./wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./wrappers/EyesBrowsingContext')} EyesBrowsingContext
 * @typedef {import('./wrappers/EyesElementFinder')} EyesElementFinder
 * @typedef {import('./wrappers/EyesDriverController')} EyesDriverController
 * @typedef {import('./wrappers/EyesJsExecutor')} EyesJsExecutor
 */

const UNKNOWN_DEVICE_PIXEL_RATIO = 0
const DEFAULT_DEVICE_PIXEL_RATIO = 1

class EyesClassic extends EyesCore {
  /**
   * Create a specialized version of this class
   * @param {EyesWrappedDriver} WrappedDriver - class which implements {@link EyesWrappedDriver}
   * @param {EyesWrappedElement} WrappedElement - class which implements {@link EyesWrappedElement}
   * @return {EyesClassic} specialized version of this class
   */
  static specialize({WrappedDriver, WrappedElement, CheckSettings, DomCapture}) {
    /**
     * @return {EyesWrappedDriver} class which implements {@link EyesWrappedDriver}
     */
    return class extends EyesClassic {
      static get WrappedDriver() {
        return WrappedDriver
      }
      static get WrappedElement() {
        return WrappedElement
      }
      static get CheckSettings() {
        return CheckSettings
      }
      static get DomCapture() {
        return DomCapture
      }
    }
  }

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   * @param {String} [serverUrl] - Eyes server URL.
   * @param {Boolean} [isDisabled=false] - Set to true to disable Applitools Eyes and use the webdriver directly.
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
    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO
    /** @type {Region} */
    this._regionToCheck = null
    /** @type {PositionProvider} */
    this._targetPositionProvider = undefined
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY
    /** @type {string}*/
    this._domUrl
    /** @type {EyesScreenshotFactory} */
    this._screenshotFactory = undefined
    /** @type {EyesWrappedElement} */
    this._scrollRootElement = null
    /** @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }

  /**
   * @override
   */
  getBaseAgentId() {
    return `eyes.webdriverio/${VERSION}`
  }

  /**
   * @param {Object} driver
   * @param {String} [appName] - Application name
   * @param {String} [testName] - Test name
   * @param {RectangleSize|{width: number, height: number}} [viewportSize] - Viewport size
   * @param {SessionType} [sessionType] - The type of test (e.g.,  standard test / visual performance test).
   * @returns {Promise<EyesWrappedDriver>}
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver')

    this._logger.verbose('Running using Webdriverio module')

    this._driver = new this.constructor.WrappedDriver(this._logger, driver)
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

    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO

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
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')
    ArgumentGuard.notNull(checkSettings, 'checkSettings')

    this._logger.verbose(`check("${name}", checkSettings) - begin`)

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name)
    }

    checkSettings.ignoreCaret(checkSettings.getIgnoreCaret() || this.getIgnoreCaret())
    this._checkSettings = checkSettings // TODO remove

    return this._checkPrepare(checkSettings, async () => {
      const targetRegion = checkSettings.getTargetRegion()
      const targetElement = checkSettings.targetElement
      if (targetRegion) {
        if (this._stitchContent) {
          return this._checkFullRegion(checkSettings, targetRegion)
        } else {
          return this._checkRegion(checkSettings, targetRegion)
        }
      } else if (targetElement) {
        await targetElement.init(this._driver)
        if (this._stitchContent) {
          return this._checkFullElement(checkSettings, targetElement)
        } else {
          return this._checkElement(checkSettings, targetElement)
        }
      } else if (checkSettings.frameChain.length > 0) {
        if (this._stitchContent) {
          return this._checkFullFrame(checkSettings)
        } else {
          return this._checkFrame(checkSettings)
        }
      } else {
        const source = await this._controller.getSource()
        return super.checkWindowBase(
          new NullRegionProvider(),
          checkSettings.getName(),
          false,
          checkSettings,
          source,
        )
      }
    })
  }

  async _checkPrepare(checkSettings, operation) {
    this._stitchContent = checkSettings.getStitchContent()
    // sync stored frame chain with actual browsing context
    await this._context.framesRefresh()
    const originalFrameChain = this._context.frameChain
    const appendFrameChain = checkSettings.frameChain

    const shouldHideScrollbars =
      !(await this._controller.isMobileDevice()) &&
      (this._configuration.getHideScrollbars() ||
        (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent))

    const scrollRootElement = checkSettings.getScrollRootElement()
    if (scrollRootElement) {
      await scrollRootElement.init(this._driver)
      if (originalFrameChain.isEmpty) {
        this._scrollRootElement = scrollRootElement
      } else {
        this._context.frameChain.current.scrollRootElement = scrollRootElement
      }
    }
    // in case scroll root element was set globally, or need to hide scrollbars
    if (this._scrollRootElement || shouldHideScrollbars) {
      await this._context.frameDefault()
      if (this._scrollRootElement) {
        await this._scrollRootElement.init(this._driver)
      } else {
        const element = await EyesUtils.getScrollRootElement(this._logger, this._executor)
        this._scrollRootElement = new this.constructor.WrappedElement(
          this._logger,
          this._driver,
          element,
        )
      }
      if (shouldHideScrollbars) {
        await this._scrollRootElement.hideScrollbars()
      } else {
        await this._context.frames(originalFrameChain)
      }
    }
    this.setPositionProvider(this._createPositionProvider(this._scrollRootElement))

    const absoluteFrameChain = shouldHideScrollbars
      ? Array.from(originalFrameChain, frame => frame.toReference()).concat(appendFrameChain)
      : appendFrameChain

    for (const frame of absoluteFrameChain) {
      await this._context.frame(frame)
      if (shouldHideScrollbars) await frame.hideScrollbars()
    }

    try {
      return await operation()
    } finally {
      if (shouldHideScrollbars) {
        const currentFrameChain = this._context.frameChain
        for (let index = currentFrameChain.size - 1; index >= 0; --index) {
          await currentFrameChain.frameAt(index).restoreScrollbars()
          await this._context.frameParent()
        }
        await this._scrollRootElement.restoreScrollbars()
      }
      await this._context.frames(originalFrameChain)
      this._stitchContent = false
    }
  }

  async _checkRegion(checkSettings, targetRegion) {
    const actualLocation = await EyesUtils.ensureRegionVisible(
      this._logger,
      this._driver,
      this._positionProviderHandler.get(),
      targetRegion,
    )

    const regionToCheck = targetRegion.offset(-actualLocation.getX(), -actualLocation.getY())

    const source = await this._controller.getSource()
    return super.checkWindowBase(
      new RegionProvider(regionToCheck),
      checkSettings.getName(),
      false,
      checkSettings,
      source,
    )
  }

  async _checkFullRegion(checkSettings, targetRegion) {
    try {
      this._shouldCheckFullRegion = true
      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._driver,
        this._positionProviderHandler.get(),
        targetRegion,
      )

      const frameChain = this._context.frameChain
      const scrollRootElement = !frameChain.isEmpty
        ? frameChain.current.scrollRootElement
        : this._scrollRootElement
      this._targetPositionProvider = this._createPositionProvider(scrollRootElement)

      this._regionToCheck = new Region(targetRegion)
      this._regionFullArea = new Region(
        Location.ZERO,
        targetRegion.getSize(),
        CoordinatesType.CONTEXT_RELATIVE,
      )

      if (!frameChain.isEmpty) {
        const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
        this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
      }
      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport)
      }

      this._logger.verbose('Region to check: ' + this._regionToCheck)

      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
      )
    } finally {
      this._regionToCheck = null
      this._targetPositionProvider = null
      this._shouldCheckFullRegion = false
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkElement(checkSettings, targetElement) {
    await EyesUtils.ensureRegionVisible(
      this._logger,
      this._driver,
      this._positionProviderHandler.get(),
      await targetElement.getBounds(),
    )

    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      async getRegion() {
        const rect = await targetElement.getRect()
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
    return super.checkWindowBase(
      new RegionProviderImpl(),
      checkSettings.getName(),
      false,
      checkSettings,
      source,
    )
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFullElement(checkSettings, targetElement) {
    try {
      this._shouldCheckFullRegion = true

      if (this._configuration.getHideScrollbars()) {
        await targetElement.hideScrollbars()
      }

      const region = await targetElement.getContentRect()
      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._driver,
        this._positionProviderHandler.get(),
        region,
      )

      const frameChain = this._context.frameChain
      const displayStyle = await targetElement.getCssProperty('display')
      const hasScroll = await targetElement
        .getProperty('scrollWidth', 'scrollHeight', 'clientWidth', 'clientHeight')
        .then(([scrollWidth, scrollHeight, clientWidth, clientHeight]) => {
          return scrollWidth > clientWidth || scrollHeight > clientHeight
        })
      if (displayStyle !== 'inline' && hasScroll) {
        this._targetPositionProvider =
          this._configuration.getStitchMode() === StitchMode.CSS
            ? new CssTranslateElementPositionProvider(this._logger, this._driver, targetElement)
            : new ScrollElementPositionProvider(this._logger, this._driver, targetElement)
      } else {
        const scrollRootElement = !frameChain.isEmpty
          ? frameChain.current.scrollRootElement
          : this._scrollRootElement
        this._targetPositionProvider = this._createPositionProvider(scrollRootElement)
        this._regionFullArea = new Region(
          Location.ZERO,
          region.getSize(),
          CoordinatesType.CONTEXT_RELATIVE,
        )
      }

      this._regionToCheck = new Region(region)

      // if (!frameChain.isEmpty) {
      //   const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
      //   this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
      // }
      // if (!this._effectiveViewport.isSizeEmpty()) {
      //   this._regionToCheck.intersect(new Region(this._effectiveViewport))
      // }

      this._logger.verbose('Element region: ' + this._regionToCheck)

      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
      )
    } finally {
      this._regionToCheck = null
      this._regionFullArea = null
      this._targetPositionProvider = null
      await targetElement.restoreScrollbars()
      this._shouldCheckFullRegion = false
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFrame(checkSettings) {
    const targetFrame = this._context.frameChain.current
    const targetElement = targetFrame.element
    await this._context.frameParent()
    try {
      return await this._checkElement(checkSettings, targetElement)
    } finally {
      await this._context.frame(targetFrame)
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFullFrame(checkSettings) {
    try {
      this._shouldCheckFullRegion = true
      await EyesUtils.ensureFrameVisible(
        this._logger,
        this._context,
        this._positionProviderHandler.get(),
      )

      const frameChain = this._context.frameChain
      const targetFrame = frameChain.current
      const scrollRootElement = targetFrame.scrollRootElement
      this._targetPositionProvider = this._createPositionProvider(scrollRootElement)

      this._regionToCheck = new Region(
        Location.ZERO,
        targetFrame.innerSize,
        CoordinatesType.CONTEXT_RELATIVE,
      )

      const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
      this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport)
      }

      this._logger.verbose('Element region: ' + this._regionToCheck)

      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
      )
    } finally {
      this._regionToCheck = null
      this._targetPositionProvider = null
      this._shouldCheckFullRegion = false
    }
  }

  /**
   * @private
   * @return {PositionProvider}
   */
  _createPositionProvider(scrollRootElement) {
    const stitchMode = this._configuration.getStitchMode()
    this._logger.verbose('initializing position provider. stitchMode:', stitchMode)

    return stitchMode === StitchMode.CSS
      ? new CssTranslatePositionProvider(this._logger, this._executor, scrollRootElement)
      : new ScrollPositionProvider(this._logger, this._executor, scrollRootElement)
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

    try {
      if (this._shouldCheckFullRegion) {
        return await this._getFullRegionScreenshot()
      } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
        return await this._getFullPageScreenshot()
      } else {
        return await this._getViewportScreenshot()
      }
    } finally {
      if (this._configuration.getHideCaret() && activeElement) {
        await EyesUtils.focusElement(this._logger, this._executor, activeElement)
      }
      this._logger.verbose('Done!')
    }
  }

  async getScreenshotUrl() {
    return undefined
  }

  async _getFullRegionScreenshot() {
    this._logger.verbose('Check full frame/element requested')

    const scaleProviderFactory = await this._updateScalingParams()
    if (!this._targetPositionProvider) {
      const frameChain = this._context.frameChain
      const scrollRootElement = !frameChain.isEmpty
        ? frameChain.current.scrollRootElement
        : this._scrollRootElement
      this._targetPositionProvider = this._createPositionProvider(scrollRootElement)
    }
    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._executor,
      this._targetPositionProvider.scrollRootElement,
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

    await this._targetPositionProvider.markScrollRootElement()
    const fullRegionImage = await fullPageCapture.getStitchedRegion(
      this._regionToCheck,
      this._regionFullArea,
      this._targetPositionProvider,
    )

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromFrameSize(
      this._logger,
      this,
      fullRegionImage,
      fullRegionImage.getSize(),
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

      let scrollRootElement = positionProvider.scrollRootElement
      if (!scrollRootElement) {
        const element = await EyesUtils.getScrollRootElement(this._logger, this._executor)
        scrollRootElement = new this.constructor.WrappedElement(this._logger, this._driver, element)
      }
      // TODO replace with js snippet
      const [
        location,
        [borderLeftWidth, borderTopWidth],
        [clientWidth, clientHeight],
      ] = await Promise.all([
        scrollRootElement.getLocation(),
        scrollRootElement.getCssProperty('border-left-width', 'border-top-width'),
        scrollRootElement.getProperty('clientWidth', 'clientHeight'),
      ])
      const region = new Region(
        Math.round(location.getX() + Number.parseFloat(borderLeftWidth)),
        Math.round(location.getY() + Number.parseFloat(borderTopWidth)),
        Math.round(clientWidth),
        Math.round(clientHeight),
      )
      return fullCapture.getStitchedRegion(region, null, positionProvider)
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
      this._devicePixelRatio !== UNKNOWN_DEVICE_PIXEL_RATIO &&
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
        this._devicePixelRatio = DEFAULT_DEVICE_PIXEL_RATIO
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

    return this._closePromise
  }

  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...')
      return await this.constructor.DomCapture.getFullWindowDom(this._logger, this._driver)
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

module.exports = EyesClassic
