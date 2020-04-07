'use strict'

const {
  ContextBasedScaleProviderFactory,
  CoordinatesType,
  EyesBase,
  FailureReports,
  FixedScaleProviderFactory,
  FullPageCaptureAlgorithm,
  Location,
  MutableImage,
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
  Configuration,
  ClassicRunner,
  FrameChain,
} = require('@applitools/eyes-sdk-core')

const {DomCapture} = require('@applitools/dom-utils')
const {RectangleSize} = require('@applitools/eyes-sdk-core')

const ImageProviderFactory = require('./capture/ImageProviderFactory')
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider')
const CssTranslateElementPositionProvider = require('./positioning/CssTranslateElementPositionProvider')
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider')
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory')
const WDIODriver = require('./wrappers/WDIODriver')
const WDIOElement = require('./wrappers/WDIOElement')
const EyesWDIOScreenshot = require('./capture/EyesWDIOScreenshot')
const EyesWDIOScreenshotFactory = require('./capture/EyesWDIOScreenshotFactory')
const EyesWDIOUtils = require('./EyesWDIOUtils')
const ElementPositionProvider = require('./positioning/ElementPositionProvider')
const StitchMode = require('./StitchMode')
const Target = require('./fluent/Target')
const ReadOnlyPropertyHandler = require('@applitools/eyes-sdk-core/index').ReadOnlyPropertyHandler
const ImageRotation = require('./positioning/ImageRotation')

const VERSION = require('../package.json').version

// eslint-disable-next-line no-unused-vars
const DEFAULT_STITCHING_OVERLAP = 50 // px
const DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100 // Milliseconds

class EyesWDIO extends EyesBase {
  static get UNKNOWN_DEVICE_PIXEL_RATIO() {
    return 0
  }

  static get DEFAULT_DEVICE_PIXEL_RATIO() {
    return 1
  }

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {String} [serverUrl] The Eyes server URL.
   * @param {Boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {ClassicRunner} [runner] - Set shared ClassicRunner if you want to group results.
   **/
  constructor(serverUrl, isDisabled = false, runner = new ClassicRunner()) {
    super(serverUrl, isDisabled, new Configuration())
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)

    /** @type {WDIODriver} */
    this._driver = undefined
    /** @type {EyesJsExecutor} */
    this._executor = undefined
    /** @type {EyesElementFinder} */
    this._finder = undefined
    /** @type {EyesBrowsingContext} */
    this._context = undefined
    /** @type {boolean} */
    this._dontGetTitle = false

    this._imageRotationDegrees = 0
    this._automaticRotation = true
    /** @type {boolean} */
    this._isLandscape = false
    this._hideScrollbars = null
    /** @type {boolean} */
    this._checkFrameOrElement = false

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
    /** @type {ElementPositionProvider} */
    this._elementPositionProvider = undefined
    /** @type {int} */
    this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY
    /** @type {string}*/
    this._domUrl
    /** @type {EyesWDIOScreenshotFactory} */
    this._screenshotFactory = undefined
    /** @type {WDIOElement} */
    this._scrollRootElement = undefined
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
      const vs = await EyesWDIOUtils.getTopContextViewportSize(this._driver)
      this._configuration.setViewportSize(vs.toJSON())
    }

    if (this._isDisabled) {
      this._logger.verbose('Ignored')
      return driver
    }

    if (driver && driver.isMobile) {
      // set viewportSize to null if browser is mobile
      viewportSize = null
    }

    this._screenshotFactory = new EyesWDIOScreenshotFactory(this._logger, this)

    const userAgentString = await EyesWDIOUtils.getUserAgent(this._executor)
    if (userAgentString) {
      this._userAgent = UserAgent.parseUserAgentString(userAgentString, true)
    }

    this._imageProvider = ImageProviderFactory.getImageProvider(
      this._userAgent,
      this,
      this._logger,
      this._driver,
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

    this._devicePixelRatio = EyesWDIO.UNKNOWN_DEVICE_PIXEL_RATIO

    this._initPositionProvider()

    return this._driver
  }

  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @param {String} tag An optional tag to be associated with the snapshot.
   * @param {int} matchTimeout The amount of time to retry matching (Milliseconds).
   * @return {Promise} A promise which is resolved when the validation is finished.
   */
  checkWindow(tag, matchTimeout) {
    return this.check(tag, Target.window().timeout(matchTimeout))
  }

  /**
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   *
   * @param {Integer|String|By|WDIOElement} element The element which is the frame to switch to. (as
   * would be used in a call to driver.frame() ).
   * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
   * @param {String} tag An optional tag to be associated with the match.
   * @return {Promise} A promise which is resolved when the validation is finished.
   */
  checkFrame(element, matchTimeout, tag) {
    return this.check(
      tag,
      Target.frame(element)
        .timeout(matchTimeout)
        .fully(),
    )
  }

  /**
   * Visually validates a region in the screenshot.
   *
   * @param {By|Region} region The WebDriver selector used for finding the region to validate.
   * @param {String} tag An optional tag to be associated with the screenshot.
   * @param {int} matchTimeout The amount of time to retry matching.
   * @return {Promise} A promise which is resolved when the validation is finished.
   */
  checkRegion(region, tag, matchTimeout) {
    return this.check(tag, Target.region(region).timeout(matchTimeout))
  }

  /**
   * Visually validates a region in the screenshot.
   *
   * @param {By} by The WebDriver selector used for finding the region to validate.
   * @param {String} tag An optional tag to be associated with the screenshot.
   * @param {int} matchTimeout The amount of time to retry matching.
   * @return {Promise} A promise which is resolved when the validation is finished.
   */
  checkRegionBy(by, tag, matchTimeout) {
    return this.checkRegion(by, tag, matchTimeout)
  }

  /**
   * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by the given selector.
   *
   * @param {String} frameNameOrId The name or id of the frame to switch to. (as would be used in a call to driver.frame()).
   * @param {By} selector A Selector specifying the region to check.
   * @param {int|null} matchTimeout The amount of time to retry matching. (Milliseconds)
   * @param {String} tag An optional tag to be associated with the snapshot.
   * @param {boolean} stitchContent If {@code true}, stitch the internal content of the region (i.e., perform {@link #checkElement(By, int, String)} on the region.
   * @return {Promise} A promise which is resolved when the validation is finished.
   */
  checkRegionInFrame(frameNameOrId, selector, matchTimeout, tag, stitchContent) {
    return this.check(
      tag,
      Target.region(selector, frameNameOrId)
        .timeout(matchTimeout)
        .stitchContent(stitchContent),
    )
  }

  /**
   *
   * @param {By} selector
   * @param matchTimeout
   * @param tag
   * @returns {Promise.<*>}
   */
  checkElementBySelector(selector, matchTimeout, tag) {
    return this.check(tag, Target.region(selector).timeout(matchTimeout))
  }

  /**
   *
   * @param name
   * @param {WebdriverioCheckSettings} checkSettings
   * @returns {Promise.<*>}
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings')

    checkSettings.ignoreCaret(checkSettings.getIgnoreCaret() || this.getIgnoreCaret())

    this._checkSettings = checkSettings

    await this._context.framesRefresh()

    let result
    await this.getPositionProvider().setPosition(Location.ZERO)

    this._logger.verbose(`check("${name}", checkSettings) - begin`)
    this._stitchContent = checkSettings.getStitchContent()
    const targetRegion = checkSettings.getTargetRegion()
    const switchedToFrameCount = await this._switchToFrame(checkSettings)
    this._regionToCheck = null
    this._targetElementLocation = null

    await this._tryHideScrollbars()

    if (targetRegion) {
      this._targetElementLocation = targetRegion.getLocation()
      const source = await EyesWDIOUtils.getCurrentUrl(this._driver)
      result = await super.checkWindowBase(
        new RegionProvider(targetRegion),
        name,
        false,
        checkSettings,
        source,
      )
    } else if (checkSettings) {
      const targetSelector = checkSettings.targetSelector
      let targetElement = checkSettings.targetElement
      if (!targetElement && targetSelector) {
        targetElement = await this._finder.findElement(targetSelector)
      } else if (WDIOElement.isCompatible(targetElement)) {
        targetElement = new WDIOElement(this._logger, this._driver, targetElement)
      }

      if (targetElement) {
        this._targetElement = targetElement
        if (this._stitchContent) {
          result = await this._checkElement(name, checkSettings)
        } else {
          result = await this._checkRegion(name, checkSettings)
        }
        this._targetElement = null
      } else if (checkSettings.getFrameChain().length > 0) {
        if (this._stitchContent) {
          result = await this._checkFullFrameOrElement(name, checkSettings)
        } else {
          result = await this._checkFrameFluent(name, checkSettings)
        }
      } else {
        const originalPosition = await this.getPositionProvider().getState()
        await this.getPositionProvider().setPosition(Location.ZERO)
        const source = await EyesWDIOUtils.getCurrentUrl(this._driver)
        result = await super.checkWindowBase(
          new NullRegionProvider(),
          name,
          false,
          checkSettings,
          source,
        )
        await this.getPositionProvider().restoreState(originalPosition)
      }
    }

    await this._tryRestoreScrollbars()

    // if (!result) {
    //   result = new MatchResult()
    // }

    this._targetElement = null
    this._targetElementLocation = null

    await this._switchToParentFrame(switchedToFrameCount)

    this._stitchContent = false
    this._logger.verbose('check - done!')

    return result
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
        if (throwEx && isErrorCaught) {
          throw results
        }
        return results
      })

    return this._closePromise
  }

  /**
   * @return {Promise}
   */
  async closeAsync() {
    await this.close(false)
  }

  /**
   * @return {Promise}
   */
  async abortAsync() {
    await this.abort()
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkRegion(name, checkSettings) {
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

    const source = await EyesWDIOUtils.getCurrentUrl(this._driver)
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
  async _checkElement(name, checkSettings) {
    const eyesElement = this._targetElement

    this._regionToCheck = null
    let originalPositionMemento

    let result
    const that = this
    let originalScrollPosition, originalOverflow, error
    const originalPositionProvider = this.getPositionProvider()
    const scrollPositionProvider = new ScrollPositionProvider(this._logger, this._executor)

    return this.getPositionProvider()
      .getState()
      .then(originalPositionMemento_ => {
        originalPositionMemento = originalPositionMemento_

        return this._ensureElementVisible(eyesElement)
      })
      .then(() => {
        return scrollPositionProvider.getCurrentPosition()
      })
      .then(originalScrollPosition_ => {
        originalScrollPosition = originalScrollPosition_
        return eyesElement.getLocation()
      })
      .then(pl => {
        that._targetElementLocation = pl
        that._checkFrameOrElement = true

        return eyesElement
          .getCssProperty('display')
          .then(displayStyle => {
            if (displayStyle !== 'inline') {
              that._elementPositionProvider = new ElementPositionProvider(
                that._logger,
                that._driver,
                eyesElement,
              )
            } else {
              that._elementPositionProvider = null
            }
          })
          .then(() => {
            if (that._hideScrollbars) {
              return eyesElement.getOverflow().then(originalOverflow_ => {
                originalOverflow = originalOverflow_
                // Set overflow to "hidden".
                return eyesElement.setOverflow('hidden')
              })
            }
          })
          .then(async () => {
            const [
              [clientWidth, clientHeight],
              [borderLeftWidth, borderTopWidth],
            ] = await Promise.all([
              eyesElement.getProperty('clientWidth', 'clientHeight'),
              eyesElement.getCssProperty('border-left-width', 'border-top-width'),
            ])

            const elementRegion = new Region(
              new Location(
                Math.round(pl.getX() + Number.parseFloat(borderLeftWidth)),
                Math.round(pl.getY() + Number.parseFloat(borderTopWidth)),
              ),
              new RectangleSize(Math.round(clientWidth), Math.round(clientHeight)),
              CoordinatesType.CONTEXT_AS_IS,
            )

            that._logger.verbose('Element region: ' + elementRegion)

            that._logger.verbose('replacing regionToCheck')
            that._regionToCheck = elementRegion

            // todo isSizeEmpty
            if (
              !(that._effectiveViewport.getWidth() <= 0 || that._effectiveViewport.getHeight() <= 0)
            ) {
              that._regionToCheck.intersect(that._effectiveViewport)
            }

            const isElement = true
            const insideAFrame = that._context.frameChain.size > 0
            if (
              isElement &&
              insideAFrame &&
              that._configuration.getStitchMode() === StitchMode.CSS
            ) {
              that.setPositionProvider(
                new CssTranslateElementPositionProvider(that._logger, that._driver, eyesElement),
              )
            }

            const source = await EyesWDIOUtils.getCurrentUrl(this._driver)
            return super.checkWindowBase(
              new NullRegionProvider(),
              name,
              false,
              checkSettings,
              source,
            )
          })
      })
      .catch(error_ => {
        error = error_
      })
      .then(r => {
        result = r
        if (originalOverflow) {
          return eyesElement.setOverflow(originalOverflow)
        }
      })
      .then(() => {
        that._checkFrameOrElement = false
        that.setPositionProvider(originalPositionProvider)
        that._regionToCheck = null
        that._elementPositionProvider = null
        that._targetElementLocation = null

        return originalPositionProvider.restoreState(originalPositionMemento)
      })
      .then(() => {
        if (originalScrollPosition) {
          // return scrollPositionProvider.setPosition(originalScrollPosition)
        }
      })
      .then(() => {
        if (error) {
          throw error
        }

        return result
      })
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFullFrameOrElement(name, checkSettings) {
    this._checkFrameOrElement = true
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

    const source = await EyesWDIOUtils.getCurrentUrl(this._driver)
    const r = await super.checkWindowBase(
      new RegionProviderImpl(),
      name,
      false,
      checkSettings,
      source,
    )
    this._checkFrameOrElement = false
    return r
  }

  async _getFullFrameOrElementRegion() {
    const that = this
    if (that._checkFrameOrElement) {
      return that._ensureFrameVisible().then(fc => {
        // FIXME - Scaling should be handled in a single place instead

        return that._updateScalingParams().then(scaleProviderFactory => {
          let screenshotImage
          return that._imageProvider
            .getImage()
            .then(screenshotImage_ => {
              screenshotImage = screenshotImage_
              return that._debugScreenshotsProvider.save(
                screenshotImage_,
                'checkFullFrameOrElement',
              )
            })
            .then(() => {
              const scaleProvider = scaleProviderFactory.getScaleProvider(
                screenshotImage.getWidth(),
              )
              // TODO: do we need to scale the image? We don't do it in Java
              return screenshotImage.scale(scaleProvider.getScaleRatio())
            })
            .then(screenshotImage_ => {
              screenshotImage = screenshotImage_
              return that._context.frames(fc)
            })
            .then(() => {
              const screenshot = new EyesWDIOScreenshot(that._logger, that, screenshotImage)
              return screenshot.init()
            })
            .then(screenshot => {
              that._logger.verbose('replacing regionToCheck')
              that.setRegionToCheck(screenshot.getFrameWindow())
              // return screenshot.getFrameWindow();
              return Region.EMPTY
            })
        })
      })
    }

    return Region.EMPTY
  }

  /**
   * @private
   * @return {Promise}
   */
  async _checkFrameFluent(name, checkSettings) {
    const frameChain = this._context.frameChain
    const targetFrame = frameChain.pop()
    this._targetElement = targetFrame.getReference()

    await this._context.framesDoScroll(frameChain)
    const r = await this._checkRegion(name, checkSettings)
    this._targetElement = null
    this._targetElementLocation = Location.ZERO
    await this._context.frame(targetFrame)
    return r
  }

  /**
   * @private
   * @return {Promise.<int>}
   */
  async _switchToParentFrame(switchedToFrameCount) {
    if (switchedToFrameCount > 0) {
      await this._context.frameParent()
      return this._switchToParentFrame(switchedToFrameCount - 1)
    }

    return switchedToFrameCount
  }

  /**
   * @private
   * @return {Promise.<int>}
   */
  async _switchToFrame(checkSettings) {
    if (!checkSettings) {
      return 0
    }

    const frameChain = checkSettings.getFrameChain()

    let switchedToFrameCount = 0
    for (const frameLocator of frameChain) {
      const b = await this._switchToFrameLocator(frameLocator)
      if (b) {
        switchedToFrameCount += 1
      }
    }
    return switchedToFrameCount
  }

  /**
   * @private
   * @return {Promise.<boolean>}
   */
  async _switchToFrameLocator(frameLocator) {
    let reference
    if (frameLocator.getFrameIndex()) {
      reference = frameLocator.getFrameIndex()
    } else if (frameLocator.getFrameNameOrId()) {
      reference = frameLocator.getFrameNameOrId()
    } else if (frameLocator.getFrameElement()) {
      reference = frameLocator.getFrameElement()
    } else if (frameLocator.getFrameSelector()) {
      reference = await this._finder.findElement(frameLocator.getFrameSelector())
    }

    if (reference) {
      await this._context.frame(reference)
      const frame = this._context.frameChain.peek()
      if (frame) {
        let scrollRootElement = frameLocator.getScrollRootElement()
        if (!scrollRootElement && frameLocator.getScrollRootSelector()) {
          scrollRootElement = await this._finder.findElement(frameLocator.getScrollRootSelector())
        }
        if (scrollRootElement) {
          frame.setScrollRootElement(scrollRootElement)
        }
      }
      return true
    }

    return false
  }

  /**
   * @private
   * @return {Promise}
   */
  async _tryHideScrollbars() {
    const isMobile = await EyesWDIOUtils.isMobileDevice(this._driver)
    if (isMobile) return
    if (this._hideScrollbars || this._scrollRootElement) {
      const originalFrameChain = this._context.frameChain
      await this._context.frameDefault()

      this._logger.verbose('hiding scrollbars of default content')
      const scrollRootElement = await this.getScrollRootElement()
      this._originalOverflow = await EyesWDIOUtils.setOverflow(
        this._executor,
        'hidden',
        scrollRootElement,
      )

      for (const frame of originalFrameChain) {
        await this._context.frame(frame.getReference())
        await frame.hideScrollbars()
      }
      this._logger.verbose('done hiding scrollbars.')
    }
  }

  /**
   * @private
   * @return {Promise}
   */
  async _tryRestoreScrollbars() {
    const isMobile = await EyesWDIOUtils.isMobileDevice(this._driver)
    if (isMobile) return
    if (this._hideScrollbars) {
      const originalFrameChain = this._context.frameChain
      await this._context.frameDefault()
      const scrollRootElement = await this.getScrollRootElement()
      await EyesWDIOUtils.setOverflow(this._executor, this._originalOverflow, scrollRootElement)

      for (const frame of originalFrameChain) {
        await this._context.frame(frame)
        await frame.restoreScrollbars()
      }
      this._logger.verbose('done hiding scrollbars.')
    }
  }

  /**
   * @private
   * @param {WebElement} element
   * @return {Promise<void>}
   */
  async _ensureElementVisible(element) {
    if (!element) {
      // No element? we must be checking the window.
      return Promise.resolve()
    }

    if (EyesWDIOUtils.isMobileDevice(this._driver)) {
      this._logger.verbose(`NATIVE context identified, skipping 'ensure element visible'`)
      return
    }

    const elementFrameBounds = await element.getBounds()
    const frameOffset = await this._context.frameChain.getCurrentFrameOffset()
    const elementViewportBounds = elementFrameBounds.offset(frameOffset.getX(), frameOffset.getY())
    const viewportBounds = await this._getViewportScrollBounds()
    if (!viewportBounds.contains(elementViewportBounds)) {
      await this._ensureFrameVisible()
      const elementLocation = await element.getLocation()
      await this.getPositionProvider().setPosition(elementLocation)
    }
  }

  /**
   * @private
   * @return {Promise.<FrameChain>}
   */
  async _ensureFrameVisible() {
    const originalFrameChain = this._context.frameChain
    const positionProvider = this.getPositionProvider()

    let position = new Location(0, 0)
    for (let index = originalFrameChain.size - 1; index >= 0; --index) {
      const frame = originalFrameChain.getFrame(index)
      await this._context.frameParent()
      const reg = new Region(Location.ZERO, frame.getInnerSize())
      this._effectiveViewport.intersect(reg)
      position = position.offsetByLocation(frame.getLocation())
      await positionProvider.setPosition(position)
      position = position.offsetNegative(await positionProvider.getCurrentPosition())
    }

    await this._context.frames(originalFrameChain)
    return originalFrameChain
  }

  /**
   * @private
   * @return {Promise.<Region>}
   */
  async _getViewportScrollBounds() {
    const originalFrameChain = this._context.frameChain
    await this._context.frameDefault()
    const spp = new ScrollPositionProvider(this._logger, this._executor)
    const location = await spp.getCurrentPosition()
    const size = await this.getViewportSize()
    const viewportBounds = new Region(location, size)
    await this._context.frames(originalFrameChain)
    return viewportBounds
  }

  /**
   * Updates the state of scaling related parameters.
   *
   * @protected
   * @return {Promise.<ScaleProviderFactory>}
   */
  async _updateScalingParams() {
    // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
    if (
      this._devicePixelRatio === EyesWDIO.UNKNOWN_DEVICE_PIXEL_RATIO &&
      this._scaleProviderHandler.get() instanceof NullScaleProvider
    ) {
      this._logger.verbose('Trying to extract device pixel ratio...')

      const that = this
      return EyesWDIOUtils.getDevicePixelRatio(that._executor)
        .then(ratio => {
          that._devicePixelRatio = ratio
        })
        .catch(async err => {
          if (EyesWDIOUtils.isMobileDevice(that._driver)) {
            const viewportSize = await this.getViewportSize()
            that._devicePixelRatio = await EyesWDIOUtils.getMobilePixelRatio(
              this._driver,
              viewportSize,
            )
          } else {
            throw err
          }
        })
        .catch(err => {
          that._logger.verbose('Failed to extract device pixel ratio! Using default.', err)
          that._devicePixelRatio = EyesWDIO.DEFAULT_DEVICE_PIXEL_RATIO
        })
        .then(() => {
          that._logger.verbose(`Device pixel ratio: ${that._devicePixelRatio}`)
          that._logger.verbose('Setting scale provider...')
          return that._getScaleProviderFactory()
        })
        .catch(err => {
          that._logger.verbose('Failed to set ContextBasedScaleProvider.', err)
          that._logger.verbose('Using FixedScaleProvider instead...')
          return new FixedScaleProviderFactory(
            1 / that._devicePixelRatio,
            that._scaleProviderHandler,
          )
        })
        .then(factory => {
          that._logger.verbose('Done!')
          return factory
        })
    }

    // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
    const nullProvider = new SimplePropertyHandler()
    return new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider)
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const entireSize = await this.getPositionProvider().getEntireSize()
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
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {Location} cursor  The cursor's position relative to the control.
   */
  async addMouseTrigger(action, control, cursor) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`)
      return
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`)
      return
    }

    if (
      !FrameChain.isSameFrameChain(this._context.frameChain, this._lastScreenshot.getFrameChain())
    ) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return
    }

    EyesBase.prototype.addMouseTriggerBase.call(this, action, control, cursor)
  }

  /**
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {WDIOElement} element The WDIOElement on which the click was called.
   * @return {Promise}
   */
  async addMouseTriggerForElement(action, element) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`)
      return Promise.resolve()
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`)
      return Promise.resolve()
    }

    if (
      !FrameChain.isSameFrameChain(this._context.frameChain, this._lastScreenshot.getFrameChain())
    ) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return Promise.resolve()
    }

    ArgumentGuard.notNull(element, 'element')

    const loc = await element.getLocation()
    const ds = await element.getSize()
    const elementRegion = new Region(loc.x, loc.y, ds.width, ds.height)
    EyesBase.prototype.addMouseTriggerBase.call(
      this,
      action,
      elementRegion,
      elementRegion.getMiddleOffset(),
    )
  }

  /**
   * Adds a keyboard trigger.
   *
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {String} text  The trigger's text.
   */
  addTextTrigger(control, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`)
      return
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`)
      return
    }

    if (
      !FrameChain.isSameFrameChain(this._context.frameChain, this._lastScreenshot.getFrameChain())
    ) {
      this._logger.verbose(`Ignoring ${text} (different frame)`)
      return
    }

    EyesBase.prototype.addTextTriggerBase.call(this, control, text)
  }

  /**
   * Adds a keyboard trigger.
   *
   * @param {WDIOElement} element The element for which we sent keys.
   * @param {String} text  The trigger's text.
   * @return {Promise}
   */
  async addTextTriggerForElement(element, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`)
      return Promise.resolve()
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`)
      return Promise.resolve()
    }

    if (
      !FrameChain.isSameFrameChain(this._context.frameChain, this._lastScreenshot.getFrameChain())
    ) {
      this._logger.verbose(`Ignoring ${text} (different frame)`)
      return Promise.resolve()
    }

    ArgumentGuard.notNull(element, 'element')

    const p1 = await element.getLocation()
    const ds = await element.getSize()
    const elementRegion = new Region(Math.ceil(p1.x), Math.ceil(p1.y), ds.width, ds.height)
    EyesBase.prototype.addTextTrigger.call(this, elementRegion, text)
  }

  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   *
   * @override
   * @inheritDoc
   */
  async getViewportSize() {
    const viewportSize = this._viewportSizeHandler.get()
    return viewportSize ? viewportSize : EyesWDIOUtils.getTopContextViewportSize(this._driver)
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

    if (!EyesWDIOUtils.isMobileDevice(this._driver)) {
      ArgumentGuard.notNull(viewportSize, 'viewportSize')
      viewportSize = new RectangleSize(viewportSize)

      const originalFrame = this._context.frameChain
      await this._context.frameDefault()
      try {
        await EyesWDIOUtils.setViewportSize(
          this._logger,
          this._driver,
          new RectangleSize(viewportSize),
        )
        this._effectiveViewport = new Region(Location.ZERO, viewportSize)
      } catch (e) {
        await this._context.frames(originalFrame)
        throw new TestFailedError('Failed to set the viewport size', e)
      }

      await this._context.frames(originalFrame)
    }

    this._viewportSizeHandler.set(new RectangleSize(viewportSize))
  }

  /**
   *
   * @param {By} locator
   * @returns {Region}
   */
  async getRegionByLocator(locator) {
    const element = await this._finder.findElement(locator)
    const elementSize = await element.getSize()
    const point = await element.getLocation()
    return new Region(point.x, point.y, elementSize.width, elementSize.height)
  }

  /** @private */
  _initPositionProvider() {
    // Setting the correct position provider.
    const stitchMode = this._configuration.getStitchMode()
    this._logger.verbose(`initializing position provider. stitchMode: ${stitchMode}`)
    switch (stitchMode) {
      case StitchMode.CSS:
        this.setPositionProvider(new CssTranslatePositionProvider(this._logger, this._executor))
        break
      default:
        this.setPositionProvider(new ScrollPositionProvider(this._logger, this._executor))
    }
  }

  /**
   * Get jsExecutor
   * @return {EyesJsExecutor}
   */
  get jsExecutor() {
    return this._executor
  }

  /** @override */
  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...')
      return await DomCapture.getFullWindowDom(this._logger, this._driver)
    } catch (ignored) {
      return ''
    }
  }

  /**
   * @override
   */
  async getDomUrl() {
    return this._domUrl
  }

  /**
   * @override
   */
  setDomUrl(domUrl) {
    return (this._domUrl = domUrl)
  }

  /**
   * @return {boolean}
   */
  getHideCaret() {
    return this._hideCaret
  }

  /**
   * @param {boolean} hideCaret
   */
  setHideCaret(hideCaret) {
    this._hideCaret = hideCaret
  }

  /**
   *
   * @returns {Promise.<EyesWDIOScreenshot>}
   * @override
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()')

    const scaleProviderFactory = await this._updateScalingParams()

    const originalFrameChain = this._context.frameChain

    const fullPageCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      new ScrollPositionProvider(this._logger, this._executor),
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this.getStitchOverlap(),
      this._imageProvider,
    )

    let activeElement = null
    if (this.getHideCaret()) {
      try {
        activeElement = await this._executor.executeScript(
          'var activeElement = document.activeElement; activeElement && activeElement.blur(); return activeElement;',
        )
      } catch (err) {
        this._logger.verbose(`WARNING: Cannot hide caret! ${err}`)
      }
    }

    let result
    if (this._checkFrameOrElement) {
      this._logger.verbose('Check frame/element requested')

      await this._context.frames(originalFrameChain)

      let scrolledElement = this.getElementPositionProvider().element
      if (!scrolledElement) {
        scrolledElement = await this._finder.findElement('html')
      }
      await this._executor.executeScript(
        'var e = arguments[0]; if (e != null) e.setAttribute("data-applitools-scroll", "true");',
        scrolledElement,
      )
      const entireFrameOrElement = await fullPageCapture.getStitchedRegion(
        this._regionToCheck,
        null,
        this.getElementPositionProvider(),
      )

      this._logger.verbose('Building screenshot object...')
      const size = new RectangleSize(
        entireFrameOrElement.getWidth(),
        entireFrameOrElement.getHeight(),
      )
      result = await EyesWDIOScreenshot.fromFrameSize(
        this._logger,
        this,
        entireFrameOrElement,
        size,
      )
    } else if (this.getForceFullPageScreenshot() || this._stitchContent) {
      this._logger.verbose('Full page screenshot requested.')

      // Save the current frame path.
      const originalFramePosition =
        originalFrameChain.size > 0
          ? originalFrameChain.getDefaultContentScrollPosition()
          : new Location(Location.ZERO)

      await this._context.frameDefault()

      const scrollRootElement = await this.getScrollRootElement()
      await this._executor.executeScript(
        'var e = arguments[0]; if (e != null) e.setAttribute("data-applitools-scroll", "true");',
        scrollRootElement,
      )
      const fullPageImage = await fullPageCapture.getStitchedRegion(
        Region.EMPTY,
        null,
        this._positionProviderHandler.get(),
      )

      await this._context.frames(originalFrameChain)
      result = await EyesWDIOScreenshot.fromScreenshotType(
        this._logger,
        this,
        fullPageImage,
        null,
        originalFramePosition,
      )
    } else {
      await this._ensureElementVisible(this._targetElement)

      this._logger.verbose('Screenshot requested...')
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

      this._logger.verbose('Creating screenshot object...')
      result = await EyesWDIOScreenshot.fromScreenshotType(this._logger, this, screenshotImage)
    }

    if (this.getHideCaret() && activeElement != null) {
      try {
        await this._executor.executeScript('arguments[0].focus();', activeElement)
      } catch (err) {
        this._logger.verbose(`WARNING: Could not return focus to active element! ${err}`)
      }
    }

    this._logger.verbose('Done!')
    return result
  }

  /**
   * @return {Promise<Location>}
   */
  async getImageLocation() {
    if (this._targetElementLocation) {
      return this._targetElementLocation
    }

    return Location.ZERO
  }

  async getAppEnvironment() {
    const appEnv = await super.getAppEnvironment()

    if (!appEnv._os) {
      const os = await EyesWDIOUtils.getOS(this._driver)
      if (os) {
        appEnv.setOs(os)
      }
    }
    return appEnv
  }

  async getInferredEnvironment() {
    try {
      const userAgent = await EyesWDIOUtils.getUserAgent(this._executor)
      return userAgent ? 'useragent:' + userAgent : userAgent
    } catch (err) {
      return null
    }
  }

  /**
   * @override
   */
  getBaseAgentId() {
    return `eyes.webdriverio/${VERSION}`
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

    EyesBase.prototype.setFailureReport.call(this, mode)
  }

  /**
   * Set the image rotation degrees.
   * @param degrees The amount of degrees to set the rotation to.
   * @deprecated use {@link setRotation} instead
   */
  setForcedImageRotation(degrees) {
    this.setRotation(new ImageRotation(degrees))
  }

  /**
   * Get the rotation degrees.
   * @return {number} The rotation degrees.
   * @deprecated use {@link getRotation} instead
   */
  getForcedImageRotation() {
    return this.getRotation().getRotation()
  }

  /**
   * @param {By} locator
   */
  setScrollRootElement(locator) {
    this._scrollRootElement = this._finder.findElement(locator)
  }

  /**
   * @return {WebElement}
   */
  async getScrollRootElement() {
    let scrollRootElement = null

    if (!EyesWDIOUtils.isMobileDevice(this._driver)) {
      scrollRootElement = this._scrollRootElement
        ? this._scrollRootElement
        : await this._finder.findElement('html')
    }

    return scrollRootElement
  }

  /**
   * @param {ImageRotation} rotation The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation
  }

  async getAUTSessionId() {
    if (!this._driver) {
      return undefined
    }
    return EyesWDIOUtils.getAUTSessionId(this._driver)
  }

  async getTitle() {
    if (!this._dontGetTitle) {
      try {
        return await EyesWDIOUtils.getTitle(this._driver)
      } catch (e) {
        this._logger.verbose(`failed (${e})`)
        this._dontGetTitle = true
      }
    }
    return ''
  }

  /**
   * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
   *
   * @param {boolean} shouldForce Whether to force a full page screenshot or not.
   */
  setForceFullPageScreenshot(shouldForce) {
    this._configuration.setForceFullPageScreenshot(shouldForce)
  }

  /**
   * @return {boolean} Whether Eyes should force a full page screenshot.
   */
  getForceFullPageScreenshot() {
    return this._configuration.getForceFullPageScreenshot()
  }

  /**
   *
   * @returns {Region}
   */
  get regionToCheck() {
    return this._regionToCheck
  }

  /**
   *
   * @param {Region} regionToCheck
   */
  setRegionToCheck(regionToCheck) {
    this._regionToCheck = regionToCheck
  }

  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} waitBeforeScreenshots The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   */
  setWaitBeforeScreenshots(waitBeforeScreenshots) {
    if (waitBeforeScreenshots <= 0) {
      this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS
    } else {
      this._waitBeforeScreenshots = waitBeforeScreenshots
    }
  }

  /**
   * @return {number} The time to wait just before taking a screenshot.
   */
  getWaitBeforeScreenshots() {
    return this._waitBeforeScreenshots
  }

  /**
   * @return {PositionProvider} The currently set position provider.
   */
  getElementPositionProvider() {
    return this._elementPositionProvider
      ? this._elementPositionProvider
      : this.getPositionProvider()
  }

  /**
   * @return {?WDIODriver}
   */
  getDriver() {
    return this._driver
  }

  getRemoteWebDriver() {
    return this._driver.unwrapped
  }

  /**
   * Sets the stitching overlap in pixels.
   *
   * @param {number} stitchOverlap - The width (in pixels) of the overlap.
   */
  setStitchOverlap(stitchOverlap) {
    this._configuration.setStitchOverlap(stitchOverlap)
  }

  /**
   * @return {number} - Returns the stitching overlap in pixels.
   */
  getStitchOverlap() {
    return this._configuration.getStitchOverlap()
  }

  /**
   * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if it wasn't possible to extract it.
   */
  getDevicePixelRatio() {
    return this._devicePixelRatio
  }

  /**
   * @return {boolean}
   */
  shouldStitchContent() {
    return this._stitchContent
  }

  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar, use {@link StitchMode#CSS}.
   * Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} mode The stitch mode to set.
   */
  setStitchMode(mode) {
    this._logger.verbose(`setting stitch mode to ${mode}`)

    this._configuration.setStitchMode(mode)
    if (this._driver) {
      this._initPositionProvider()
    }
  }

  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} shouldHide Whether to hide the scrollbars or not.
   */
  setHideScrollbars(shouldHide) {
    this._hideScrollbars = shouldHide
  }

  async getScreenshotUrl() {
    return undefined
  }

  setCorsIframeHandle(_corsIframeHandle) {}

  getCorsIframeHandle() {
    return null
  }

  /**
   * @return {object}
   */
  getRunner() {
    return this._runner
  }

  setApiKey(apiKey) {
    this._configuration.setApiKey(apiKey)
  }

  getApiKey() {
    return this._configuration.getApiKey()
  }

  /**
   * @return {boolean}
   */
  getSendDom() {
    return !EyesWDIOUtils.isMobileDevice(this._driver) && super.getSendDom()
  }

  async getAndSaveRenderingInfo() {
    const renderingInfo = await this._runner.getRenderingInfoWithCache()
    this._serverConnector.setRenderingInfo(renderingInfo)
  }

  async _getAndSaveBatchInfoFromServer(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    return this._runner.getBatchInfoWithCache(batchId)
  }
}

exports.EyesWDIO = EyesWDIO
