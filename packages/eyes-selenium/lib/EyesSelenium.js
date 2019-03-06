'use strict';

const { DomCapture } = require('@applitools/dom-utils');

const {
  Configuration,
  SimplePropertyHandler,
  CoordinatesType,
  Region,
  Location,
  RectangleSize,
  UserAgent,
  ArgumentGuard,
  TypeUtils,
} = require('@applitools/eyes-common');

const {
  FullPageCaptureAlgorithm,
  FixedScaleProviderFactory,
  NullScaleProvider,
  RegionProvider,
  NullRegionProvider,
  ContextBasedScaleProviderFactory,
  ScaleProviderIdentityFactory,
  NullCutProvider,
  MatchResult,
} = require('@applitools/eyes-sdk-core');

const { StitchMode } = require('./config/StitchMode');
const { ImageProviderFactory } = require('./capture/ImageProviderFactory');
const { EyesWebDriverScreenshotFactory } = require('./capture/EyesWebDriverScreenshotFactory');
const { FrameChain } = require('./frames/FrameChain');
const { EyesTargetLocator } = require('./wrappers/EyesTargetLocator');
const { EyesSeleniumUtils } = require('./EyesSeleniumUtils');
const { EyesWebElement } = require('./wrappers/EyesWebElement');
const { EyesWebDriverScreenshot } = require('./capture/EyesWebDriverScreenshot');
const { RegionPositionCompensationFactory } = require('./positioning/RegionPositionCompensationFactory');
const { ScrollPositionProvider } = require('./positioning/ScrollPositionProvider');
const { ElementPositionProvider } = require('./positioning/ElementPositionProvider');
const { Eyes } = require('./Eyes');

/**
 * The main API gateway for the SDK.
 *
 * @ignore
 */
class EyesSelenium extends Eyes {
  /** @var {Logger} EyesSelenium#_logger */
  /** @var {SeleniumConfiguration} EyesSelenium#_configuration */
  /** @var {ImageMatchSettings} EyesSelenium#_defaultMatchSettings */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   */
  constructor(serverUrl, isDisabled) {
    super(serverUrl, isDisabled);

    /** @type {boolean} */
    this._checkFrameOrElement = false;

    /** @type {Location} */
    this._imageLocation = undefined;

    /** @type {UserAgent} */
    this._userAgent = undefined;
    /** @type {ImageProvider} */
    this._imageProvider = undefined;
    /** @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined;

    /** @type {EyesWebElement|WebElement} */
    this._targetElement = undefined;
    /** @type {PositionMemento} */
    this._positionMemento = undefined;
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY;
    /** @type {EyesWebDriverScreenshotFactory} */
    this._screenshotFactory = undefined;
  }

  /**
   * @inheritDoc
   */
  async open(driver, varArg1, varArg2, varArg3, varArg4) {
    ArgumentGuard.notNull(driver, 'driver');

    if (varArg1 instanceof Configuration) {
      this._configuration.mergeConfig(varArg1);
    } else {
      this._configuration.setAppName(varArg1);
      this._configuration.setTestName(varArg2);
      this._configuration.setViewportSize(varArg3);
      this._configuration.setSessionType(varArg4);
    }

    if (this.getIsDisabled()) {
      this._logger.verbose('Ignored');
      return driver;
    }

    if (this._configuration.getStitchMode() === StitchMode.CSS) {
      this.setSendDom(true);
    }

    this._initDriver(driver);

    this._screenshotFactory = new EyesWebDriverScreenshotFactory(this._logger, this._driver);

    const uaString = await this._driver.getUserAgent();
    if (uaString) {
      this._userAgent = UserAgent.parseUserAgentString(uaString, true);
    }

    this._imageProvider = ImageProviderFactory.getImageProvider(this._userAgent, this, this._logger, this._driver);
    this._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(this._userAgent, this, this._logger);

    await super.openBase(this._configuration.getAppName(), this._configuration.getTestName(), this._configuration.getViewportSize(), this._configuration.getSessionType());

    this._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;

    this._initPositionProvider();

    this._driver.setRotation(this._rotation);
    return this._driver;
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @inheritDoc
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    } else {
      name = checkSettings.getName();
    }

    if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
      this._logger.verbose(`URL: ${await this._driver.getCurrentUrl()}`);
    }

    this._logger.verbose(`check(${checkSettings}) - begin`);
    this._stitchContent = checkSettings.getStitchContent();
    const targetRegion = checkSettings.getTargetRegion();

    this._originalFC = new FrameChain(this._logger, this._driver.getFrameChain());

    const switchedToFrameCount = await this._switchToFrame(checkSettings);

    this._scrollRootElement = null;
    this._regionToCheck = null;
    this._imageLocation = null;

    let result = null;

    const switchTo = this._driver.switchTo();
    let originalFC = null;

    if (targetRegion) {
      originalFC = await this._tryHideScrollbars();
      this._imageLocation = targetRegion.getLocation();
      result = await super.checkWindowBase(new RegionProvider(targetRegion), name, false, checkSettings);
    } else if (checkSettings) {
      let targetElement = checkSettings.getTargetElement();

      const targetSelector = checkSettings.getTargetSelector();
      if (!targetElement && targetSelector) {
        targetElement = await this._driver.findElement(targetSelector);
      }

      if (targetElement) {
        originalFC = await this._tryHideScrollbars();
        this._targetElement = targetElement instanceof EyesWebElement ? targetElement :
          new EyesWebElement(this._logger, this._driver, targetElement);
        if (this._stitchContent) {
          result = await this._checkElement(undefined, name, checkSettings);
        } else {
          result = await this._checkRegionByElement(name, checkSettings);
        }
        this._targetElement = null;
      } else if (checkSettings.getFrameChain().length > 0) {
        originalFC = await this._tryHideScrollbars();
        if (this._stitchContent) {
          result = await this._checkFullFrameOrElement(name, checkSettings);
        } else {
          result = await this._checkFrameFluent(name, checkSettings);
        }
      } else {
        if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
          // required to prevent cut line on the last stitched part of the page on some browsers (like firefox).
          await switchTo.defaultContent();
          originalFC = await this._tryHideScrollbars();
        }
        result = await super.checkWindowBase(new NullRegionProvider(), name, false, checkSettings);
      }
    }

    if (!result) {
      result = new MatchResult();
    }

    await this._switchToParentFrame(switchedToFrameCount);

    if (this._positionMemento != null) {
      await this._positionProviderHandler.get().restoreState(this._positionMemento);
      this._positionMemento = null;
    }

    await switchTo.resetScroll();

    if (originalFC) {
      await this._tryRestoreScrollbars(originalFC);
    }

    await this._trySwitchToFrames(this._driver, switchTo, this._originalFC);

    this._stitchContent = false;
    this._imageLocation = null;

    this._logger.verbose('check - done!');
    return result;
  }

  /**
   * @private
   * @param {EyesWebDriver} driver
   * @param {EyesTargetLocator} switchTo
   * @param {FrameChain} frames
   * @return {Promise<void>}
   */
  async _trySwitchToFrames(driver, switchTo, frames) {
    if (await EyesSeleniumUtils.isMobileDevice(driver)) {
      return;
    }

    try {
      await switchTo.frames(frames);
    } catch (err) {
      this._logger.log(`WARNING: Failed to switch to original frame chain! ${err}`);
    }
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkFrameFluent(name, checkSettings) {
    const frameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const targetFrame = frameChain.pop();
    this._targetElement = targetFrame.getReference();

    await this._driver.switchTo().framesDoScroll(frameChain);
    const result = await this._checkRegionByElement(name, checkSettings);
    this._targetElement = null;
    return result;
  }

  /**
   * @private
   * @return {Promise<number>}
   */
  async _switchToParentFrame(switchedToFrameCount) {
    if (switchedToFrameCount > 0) {
      await this._driver.switchTo().parentFrame();
      return this._switchToParentFrame(switchedToFrameCount - 1);
    }

    return switchedToFrameCount;
  }

  /**
   * @private
   * @param {SeleniumCheckSettings} checkSettings
   * @return {Promise<number>}
   */
  async _switchToFrame(checkSettings) {
    if (!checkSettings) {
      return 0;
    }

    const frameChain = checkSettings.getFrameChain();

    return await frameChain.reduce(async (prevPromise, frameLocator) => {
      let switchedToFrameCount = await prevPromise;
      if (await this._switchToFrameLocator(frameLocator)) {
        switchedToFrameCount += 1;
      }
      return switchedToFrameCount;
    }, Promise.resolve(0));
  }

  /**
   * @private
   * @return {Promise<boolean>}
   */
  async _switchToFrameLocator(frameLocator) {
    const switchTo = this._driver.switchTo();

    if (frameLocator.getFrameIndex()) {
      await switchTo.frame(frameLocator.getFrameIndex());
      return true;
    }

    if (frameLocator.getFrameNameOrId()) {
      await switchTo.frame(frameLocator.getFrameNameOrId());
      return true;
    }

    if (frameLocator.getFrameElement()) {
      const frameElement = frameLocator.getFrameElement();
      if (frameElement) {
        await switchTo.frame(frameElement);
        return true;
      }
    }

    if (frameLocator.getFrameSelector()) {
      const frameElement = this._driver.findElement(frameLocator.getFrameSelector());
      if (frameElement) {
        await switchTo.frame(frameElement);
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkFullFrameOrElement(name, checkSettings) {
    const self = this;
    this._checkFrameOrElement = true;
    this._logger.verbose('checkFullFrameOrElement()');

    /**
     * @private
     * @type {RegionProvider}
     */
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /** @inheritDoc */
      async getRegion() {
        const region = await self._getFullFrameOrElementRegion();
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const result = await super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings);
    this._checkFrameOrElement = false;
    return result;
  }

  /**
   * @private
   * @return {Promise<Region>}
   */
  async _getFullFrameOrElementRegion() {
    if (this._checkFrameOrElement) {
      const fc = await this._ensureFrameVisible();

      // FIXME - Scaling should be handled in a single place instead
      const scaleProviderFactory = await this._updateScalingParams();

      const screenshotImage = await this._imageProvider.getImage();

      await this._debugScreenshotsProvider.save(screenshotImage, 'checkFullFrameOrElement');

      scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());

      const switchTo = this._driver.switchTo();
      await switchTo.frames(fc);

      const screenshot = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, screenshotImage);
      this._logger.verbose('replacing regionToCheck');
      this.setRegionToCheck(screenshot.getFrameWindow());
    }

    return Region.EMPTY;
  }

  /**
   * @private
   * @return {Promise<FrameChain>}
   */
  async _ensureFrameVisible() {
    const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
    const fc = new FrameChain(this._logger, this._driver.getFrameChain());
    while (fc.size() > 0) {
      // driver.getRemoteWebDriver().switchTo().parentFrame();
      const frame = fc.pop();
      await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
      if (fc.size() === 0) {
        this._positionMemento = await this._positionProviderHandler.get().getState();
      }
      await this._positionProviderHandler.get().setPosition(frame.getLocation());

      const reg = new Region(Location.ZERO, frame.getInnerSize());
      this._effectiveViewport.intersect(reg);
    }
    await this._driver.switchTo().frames(originalFC);
    return originalFC;
  }

  /**
   * @private
   * @param {WebElement} element
   * @return {Promise<void>}
   */
  async _ensureElementVisible(element) {
    if (this._targetElement == null || !this.getScrollToRegion()) {
      // No element? we must be checking the window.
      return;
    }

    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      this._logger.log("NATIVE context identified, skipping 'ensure element visible'");
      return;
    }

    const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    const eyesWebElement = new EyesWebElement(this._logger, this._driver, element);
    let elementBounds = await eyesWebElement.getBounds();

    const currentFrameOffset = originalFC.getCurrentFrameOffset();
    elementBounds = elementBounds.offset(currentFrameOffset.getX(), currentFrameOffset.getY());

    const viewportBounds = await this._getViewportScrollBounds();

    if (!viewportBounds.contains(elementBounds)) {
      await this._ensureFrameVisible();

      const rect = await eyesWebElement.getRect();
      const elementLocation = new Location(rect);

      // const isEquals = await EyesWebElement.equals(element, originalFC.peek());
      if (originalFC.size() > 0) {
        await switchTo.frames(originalFC);
      }

      await this._positionProviderHandler.get().setPosition(elementLocation);
    }
  }

  /**
   * @private
   * @return {Promise<Region>}
   */
  async _getViewportScrollBounds() {
    if (!this.getScrollToRegion()) {
      return Region.EMPTY;
    }

    const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    await switchTo.defaultContent();
    const spp = new ScrollPositionProvider(this._logger, this._jsExecutor);
    let location = null;
    try {
      location = await spp.getCurrentPosition();
    } catch (err) {
      this._logger.log(`WARNING: ${err}`);
      this._logger.log('Assuming position is 0,0');
      location = new Location(Location.ZERO);
    }

    const size = await this.getViewportSize();
    const viewportBounds = new Region(location, size);
    await switchTo.frames(originalFrameChain);
    return viewportBounds;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkRegionByElement(name, checkSettings) {
    const self = this;

    /**
     * @private
     * @type {RegionProvider}
     */
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /** @inheritDoc */
      async getRegion() {
        const rect = await self._targetElement.getRect();
        // noinspection JSSuspiciousNameCombination
        const region = new Region(Math.ceil(rect.x), Math.ceil(rect.y), rect.width, rect.height, CoordinatesType.CONTEXT_RELATIVE);
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const result = await super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings);
    this._logger.verbose('Done! trying to scroll back to original position..');
    return result;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkElement(eyesElement = this._targetElement, name, checkSettings) {
    this._regionToCheck = null;
    const originalPositionMemento = await this._positionProviderHandler.get().getState();

    await this._ensureElementVisible(this._targetElement);

    const originalPositionProvider = this._positionProviderHandler.get();
    const scrollPositionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor);
    const originalScrollPosition = await scrollPositionProvider.getCurrentPosition();

    let result;
    let originalOverflow;
    const rect = await eyesElement.getRect();

    try {
      this._checkFrameOrElement = true;

      const displayStyle = await eyesElement.getComputedStyle('display');
      if (displayStyle === 'inline') {
        this._elementPositionProvider = null;
      } else {
        this._elementPositionProvider = new ElementPositionProvider(this._logger, this._driver, eyesElement);
      }

      if (this._configuration.getHideScrollbars()) {
        originalOverflow = await eyesElement.getOverflow();
        await eyesElement.setOverflow('hidden');
      }

      const borderOffsetLocation = await eyesElement.getBorderOffsetLocation();
      const elementSize = await eyesElement.getClientSize();

      const elementRegion = new Region(
        rect.x + borderOffsetLocation.getX(),
        rect.y + borderOffsetLocation.getY(),
        elementSize.getWidth(),
        elementSize.getHeight(),
        CoordinatesType.SCREENSHOT_AS_IS
      );

      this._logger.verbose(`Element region: ${elementRegion}`);

      this._logger.verbose('replacing regionToCheck');
      this._regionToCheck = elementRegion;

      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport);
      }

      this._imageLocation = this._regionToCheck.getLocation();
      result = await super.checkWindowBase(new NullRegionProvider(), name, false, checkSettings);
    } finally {
      if (originalOverflow) {
        await eyesElement.setOverflow(originalOverflow);
      }

      this._checkFrameOrElement = false;

      await originalPositionProvider.restoreState(originalPositionMemento);
      await scrollPositionProvider.setPosition(originalScrollPosition);
      this._positionProviderHandler.set(originalPositionProvider);
      this._regionToCheck = null;
      this._imageLocation = null;
      this._elementPositionProvider = null;
    }

    return result;
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
      this._devicePixelRatio === Eyes.UNKNOWN_DEVICE_PIXEL_RATIO &&
      this._scaleProviderHandler.get() instanceof NullScaleProvider
    ) {
      let factory;
      this._logger.verbose('Trying to extract device pixel ratio...');

      try {
        this._devicePixelRatio = await EyesSeleniumUtils.getDevicePixelRatio(this._jsExecutor);
      } catch (err) {
        this._logger.verbose('Failed to extract device pixel ratio! Using default.', err);
        this._devicePixelRatio = Eyes.DEFAULT_DEVICE_PIXEL_RATIO;
      }
      this._logger.verbose(`Device pixel ratio: ${this._devicePixelRatio}`);

      this._logger.verbose('Setting scale provider...');
      try {
        factory = await this._getScaleProviderFactory();
      } catch (err) {
        this._logger.verbose('Failed to set ContextBasedScaleProvider.', err);
        this._logger.verbose('Using FixedScaleProvider instead...');
        factory = new FixedScaleProviderFactory(1 / this._devicePixelRatio, this._scaleProviderHandler);
      }

      this._logger.verbose('Done!');
      return factory;
    }

    // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
    const nullProvider = new SimplePropertyHandler();
    return new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider);
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const entireSize = await this._positionProviderHandler.get().getEntireSize();

    return new ContextBasedScaleProviderFactory(
      this._logger,
      entireSize,
      this._viewportSizeHandler.get(),
      this._devicePixelRatio,
      false,
      this._scaleProviderHandler
    );
  }

  /**
   * @inheritDoc
   */
  async getViewportSize() {
    let viewportSize = this._viewportSizeHandler.get();
    if (!viewportSize) {
      viewportSize = await this._driver.getDefaultContentViewportSize();
    }

    return viewportSize;
  }

  /**
   * @inheritDoc
   */
  async beforeOpen() {
    this._scrollRootElement = null;
    await this._tryHideScrollbars();
  }

  /**
   * @inheritDoc
   */
  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...');
      return await DomCapture.getFullWindowDom(this._logger, this._driver);
    } catch (err) {
      this._logger.log(`Error capturing DOM of the page: ${err}`);
      return '';
    }
  }

  /**
   * @private
   * @return {Promise<FrameChain>}
   */
  async _tryHideScrollbars() {
    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      return new FrameChain(this._logger);
    }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
      const fc = new FrameChain(this._logger, this._driver.getFrameChain());
      while (fc.size() > 0) {
        if (this._stitchContent || fc.size() !== originalFC.size()) {
          await EyesSeleniumUtils.hideScrollbars(this._driver, 200, this._scrollRootElement);
        }
        fc.pop();
        await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
      }

      // this._originalOverflow = await EyesSeleniumUtils.hideScrollbars(this._driver, 200, this._scrollRootElement);
      await this._driver.switchTo().frames(originalFC);
      return originalFC;
    }

    return new FrameChain(this._logger);
  }

  /**
   * @inheritDoc
   */
  async getImageLocation() {
    if (this._imageLocation) {
      return this._imageLocation;
    }

    return Location.ZERO;
  }

  /**
   * @private
   * @param {FrameChain} frameChain
   * @return {Promise<void>}
   */
  async _tryRestoreScrollbars(frameChain) {
    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      return;
    }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      await this._driver.switchTo().frames(frameChain);
      const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
      const fc = new FrameChain(this._logger, this._driver.getFrameChain());
      await this._tryRestoreScrollbarsLoop(fc);
      await this._driver.switchTo().frames(originalFC);
    }
    this._driver.getFrameChain().clear();
  }

  /**
   * @private
   * @param {FrameChain} fc
   * @return {Promise<void>}
   */
  async _tryRestoreScrollbarsLoop(fc) {
    if (fc.size() > 0) {
      await this._driver.switchTo().parentFrame();

      const frame = fc.pop();
      let frameReference = frame.getReference();
      frameReference = frameReference instanceof EyesWebElement ? frameReference : new EyesWebElement(this._logger, this._driver, frameReference);
      await frameReference.setOverflow(frame.getOriginalOverflow());

      await this._tryRestoreScrollbarsLoop(fc);
    }
  }

  /*
  /**
   * @protected
   * @return {Promise<void>}
   * /
  _afterMatchWindow() {
    if (this.hideScrollbars) {
      try {
        EyesSeleniumUtils.setOverflow(this.driver, this.originalOverflow);
      } catch (EyesDriverOperationException e) {
        // Bummer, but we'll continue with the screenshot anyway :)
        logger.log("WARNING: Failed to revert overflow! Error: " + e.getMessage());
      }
    }
  }
  */

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @inheritDoc
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()');

    const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    const scaleProviderFactory = await this._updateScalingParams();
    const fullPageCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      new ScrollPositionProvider(this._logger, this._jsExecutor),
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider
    );

    let activeElement = null;
    if (this._configuration.getHideCaret()) {
      try {
        activeElement = await this._driver.executeScript('var activeElement = document.activeElement; activeElement && activeElement.blur(); return activeElement;');
      } catch (err) {
        this._logger.verbose(`WARNING: Cannot hide caret! ${err}`);
      }
    }

    let result;
    if (this._checkFrameOrElement) {
      this._logger.verbose('Check frame/element requested');

      await switchTo.frames(originalFrameChain);

      const entireFrameOrElement = await fullPageCapture.getStitchedRegion(this._regionToCheck, null, this.getElementPositionProvider());

      this._logger.verbose('Building screenshot object...');
      const size = new RectangleSize(entireFrameOrElement.getWidth(), entireFrameOrElement.getHeight());
      result = await EyesWebDriverScreenshot.fromFrameSize(this._logger, this._driver, entireFrameOrElement, size);
    } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
      this._logger.verbose('Full page screenshot requested.');

      // Save the current frame path.
      const originalFramePosition = originalFrameChain.size() > 0 ?
        originalFrameChain.getDefaultContentScrollPosition() : new Location(Location.ZERO);

      await switchTo.defaultContent();

      const fullPageImage = await fullPageCapture.getStitchedRegion(Region.EMPTY, null, this._positionProviderHandler.get());

      await switchTo.frames(originalFrameChain);
      result = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, fullPageImage, null, originalFramePosition);
    } else {
      await this._ensureElementVisible(this._targetElement);

      this._logger.verbose('Screenshot requested...');
      let screenshotImage = await this._imageProvider.getImage();
      await this._debugScreenshotsProvider.save(screenshotImage, 'original');

      const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
      if (scaleProvider.getScaleRatio() !== 1) {
        this._logger.verbose('scaling...');
        screenshotImage = await screenshotImage.scale(scaleProvider.getScaleRatio());
        await this._debugScreenshotsProvider.save(screenshotImage, 'scaled');
      }

      const cutProvider = this._cutProviderHandler.get();
      if (!(cutProvider instanceof NullCutProvider)) {
        this._logger.verbose('cutting...');
        screenshotImage = await cutProvider.cut(screenshotImage);
        await this._debugScreenshotsProvider.save(screenshotImage, 'cut');
      }

      this._logger.verbose('Creating screenshot object...');
      result = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, screenshotImage);
    }

    if (this._configuration.getHideCaret() && activeElement != null) {
      try {
        await this._driver.executeScript('arguments[0].focus();', activeElement);
      } catch (err) {
        this._logger.verbose(`WARNING: Could not return focus to active element! ${err}`);
      }
    }

    this._logger.verbose('Done!');
    return result;
  }
}

exports.EyesSelenium = EyesSelenium;
