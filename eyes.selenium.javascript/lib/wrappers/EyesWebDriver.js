'use strict';

const by = require('selenium-webdriver/lib/by');
const { IWebDriver } = require('selenium-webdriver/lib/webdriver');
const { ArgumentGuard, MutableImage } = require('@applitools/eyes.sdk.core');

const FrameChain = require('../frames/FrameChain');
const EyesSeleniumUtils = require('../EyesSeleniumUtils');
const EyesWebElement = require('./EyesWebElement');
const EyesWebElementPromise = require('./EyesWebElementPromise');
const EyesTargetLocator = require('./EyesTargetLocator');

/**
 * An Eyes implementation of the interfaces implemented by {@link IWebDriver}.
 * Used so we'll be able to return the users an object with the same functionality as {@link WebDriver}.
 */
class EyesWebDriver extends IWebDriver {
  /**
   * @param {Logger} logger
   * @param {Eyes} eyes
   * @param {WebDriver} driver
   */
  constructor(logger, eyes, driver) {
    super();
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(eyes, 'eyes');
    ArgumentGuard.notNull(driver, 'driver');

    this._logger = logger;
    this._eyes = eyes;
    this._driver = driver;

    this._elementsIds = new Map();
    this._frameChain = new FrameChain(logger);

    /** @type {ImageRotation} */
    this._rotation = null;
    /** @type {RectangleSize} */
    this._defaultContentViewportSize = null;

    // this._logger.verbose("Driver session is " + this.getSessionId());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Eyes}
   */
  getEyes() {
    return this._eyes;
  }

  /**
   * @return {PromiseFactory}
   */
  getPromiseFactory() {
    return this._eyes.getPromiseFactory();
  }

  /**
   * @return {WebDriver}
   */
  getRemoteWebDriver() {
    // noinspection JSUnresolvedVariable
    return this._driver.driver || this._driver;
  }

  /** @override */
  controlFlow() {
    return this._driver.controlFlow();
  }

  /** @override */
  schedule(command, description) {
    return this._driver.schedule(command, description);
  }

  /** @override */
  setFileDetector(detector) {
    return this._driver.setFileDetector(detector);
  }

  /** @override */
  getExecutor() {
    return this._driver.getExecutor();
  }

  /** @override */
  getSession() {
    return this._driver.getSession();
  }

  /** @override */
  getCapabilities() {
    return this._driver.getCapabilities();
  }

  /** @override */
  quit() {
    return this._driver.quit();
  }

  /** @override */
  actions() {
    return this._driver.actions();
  }

  /** @override */
  touchActions() {
    return this._driver.touchActions();
  }

  /** @override */
  executeScript(script, ...varArgs) {
    const logger = this._logger;
    this._logger.verbose('Execute script...');
    EyesSeleniumUtils.handleSpecialCommands(script, ...varArgs);
    // noinspection JSValidateTypes
    return this._driver.executeScript(script, ...varArgs).then(result => {
      logger.verbose('Done!');
      return result;
    });
  }

  /** @override */
  executeAsyncScript(script, ...varArgs) {
    EyesSeleniumUtils.handleSpecialCommands(script, ...varArgs);
    return this._driver.executeAsyncScript(script, ...varArgs);
  }

  /** @override */
  call(fn, optScope, ...varArgs) {
    return this._driver.call(fn, optScope, ...varArgs);
  }

  /** @override */
  wait(condition, optTimeout, optMessage) {
    return this._driver.wait(condition, optTimeout, optMessage);
  }

  /** @override */
  sleep(ms) {
    return this._driver.sleep(ms);
  }

  /** @override */
  getWindowHandle() {
    return this._driver.getWindowHandle();
  }

  /** @override */
  getAllWindowHandles() {
    return this._driver.getAllWindowHandles();
  }

  /** @override */
  getPageSource() {
    return this._driver.getPageSource();
  }

  /** @override */
  close() {
    return this._driver.close();
  }

  /** @override */
  get(url) {
    this._frameChain.clear();
    return this._driver.get(url);
  }

  /** @override */
  getCurrentUrl() {
    return this._driver.getCurrentUrl();
  }

  /** @override */
  getTitle() {
    return this._driver.getTitle();
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {!(by.By|By|Function)} locator The locator strategy to use when searching for the element.
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElement(locator) {
    return new EyesWebElementPromise(this._logger, this, this._driver.findElement(locator));
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {!(by.By|By|Function)} locator The locator strategy to use when searching for the element.
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will be resolved to an array of the located
   *   {@link EyesWebElement}s.
   */
  findElements(locator) {
    const that = this;
    return this._driver.findElements(locator)
      .then(elements => elements.map(element => {
        element = new EyesWebElement(that._logger, that, element);
        // For Remote web elements, we can keep the IDs
        that._elementsIds.set(element.getId(), element);
        return element;
      }));
  }

  /** @override */
  takeScreenshot() {
    const that = this;
    // Get the image as base64.
    // noinspection JSValidateTypes
    return this._driver.takeScreenshot()
      .then(screenshot64 => {
        const screenshot = new MutableImage(screenshot64, that.getPromiseFactory());
        return EyesWebDriver.normalizeRotation(
          that._logger,
          that._driver,
          screenshot,
          that._rotation,
          that.getPromiseFactory()
        );
      })
      .then(screenshot => screenshot.getImageBase64());
  }

  /** @override */
  manage() {
    return this._driver.manage();
  }

  /** @override */
  navigate() {
    return this._driver.navigate();
  }

  /**
   * @override
   * @return {EyesTargetLocator} The target locator interface for this instance.
   */
  switchTo() {
    this._logger.verbose('switchTo()');
    return new EyesTargetLocator(this._logger, this, this._driver.switchTo());
  }

  /**
   * Found elements are sometimes accessed by their IDs (e.g. tapping an element in Appium).
   *
   * @return {Map<String, WebElement>} Maps of IDs for found elements.
   */
  getElementIds() {
    return this._elementsIds;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageRotation} The image rotation data.
   */
  getRotation() {
    return this._rotation;
  }

  /**
   * @param {ImageRotation} rotation The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} className
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByClassName(className) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.className(className));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} className
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByClassName(className) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.className(className));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} cssSelector
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByCssSelector(cssSelector) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.css(cssSelector));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} cssSelector
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByCssSelector(cssSelector) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.css(cssSelector));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} id
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementById(id) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.id(id));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} id
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsById(id) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.id(id));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} linkText
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByLinkText(linkText) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.linkText(linkText));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} linkText
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByLinkText(linkText) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.linkText(linkText));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} partialLinkText
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByPartialLinkText(partialLinkText) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.partialLinkText(partialLinkText));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} partialLinkText
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByPartialLinkText(partialLinkText) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.partialLinkText(partialLinkText));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} name
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByName(name) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.name(name));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} name
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByName(name) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.name(name));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} tagName
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByTagName(tagName) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.css(tagName));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} tagName
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByTagName(tagName) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.css(tagName));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} xpath
   * @return {EyesWebElementPromise} A promise that will resolve to a EyesWebElement.
   */
  findElementByXPath(xpath) {
    // noinspection JSCheckFunctionSignatures
    return this.findElement(by.By.xpath(xpath));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {String} xpath
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByXPath(xpath) {
    // noinspection JSCheckFunctionSignatures
    return this.findElements(by.By.xpath(xpath));
  }

  /**
   * @param {boolean} [forceQuery=false] If true, we will perform the query even if we have a cached viewport size.
   * @return {Promise.<RectangleSize>} The viewport size of the default content (outer most frame).
   */
  getDefaultContentViewportSize(forceQuery = false) {
    const that = this;
    that._logger.verbose('getDefaultContentViewportSize()');
    if (that._defaultContentViewportSize && !forceQuery) {
      that._logger.verbose('Using cached viewport size: ', that._defaultContentViewportSize);
      return that.getPromiseFactory().resolve(that._defaultContentViewportSize);
    }

    const switchTo = that.switchTo();
    const currentFrames = new FrameChain(that._logger, that.getFrameChain());

    let promise = that.getPromiseFactory().resolve();

    // Optimization
    if (currentFrames.size() > 0) {
      promise = promise.then(() => switchTo.defaultContent());
    }

    promise = promise.then(() => {
      that._logger.verbose('Extracting viewport size...');
      return EyesSeleniumUtils.getViewportSizeOrDisplaySize(that._logger, that._driver);
    })
      .then(defaultContentViewportSize => {
        that._defaultContentViewportSize = defaultContentViewportSize;
        that._logger.verbose('Done! Viewport size: ', that._defaultContentViewportSize);
      });

    if (currentFrames.size() > 0) {
      promise = promise.then(() => switchTo.frames(currentFrames));
    }

    return promise.then(() => that._defaultContentViewportSize);
  }

  /**
   * @return {FrameChain} The current frame chain.
   */
  getFrameChain() {
    return this._frameChain;
  }

  /**
   * @return {Promise.<String>}
   */
  getUserAgent() {
    const logger = this._logger;
    return this._driver.executeScript('return navigator.userAgent;')
      .then(userAgent => {
        logger.verbose(`user agent: ${userAgent}`);
        return userAgent;
      })
      .catch(() => {
        logger.verbose('Failed to obtain user-agent string');
        return null;
      });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise.<String>} A copy of the current frame chain.
   */
  getSessionId() {
    return this._driver.getSession().getId();
  }

  /**
   * Rotates the image as necessary. The rotation is either manually forced by passing a non-null ImageRotation, or
   * automatically inferred.
   *
   * @param {Logger} logger The underlying driver which produced the screenshot.
   * @param {IWebDriver} driver The underlying driver which produced the screenshot.
   * @param {MutableImage} image The image to normalize.
   * @param {ImageRotation} rotation The degrees by which to rotate the image: positive values = clockwise rotation,
   *   negative values = counter-clockwise, 0 = force no rotation, null = rotate automatically as needed.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise.<MutableImage>} A normalized image.
   */
  static normalizeRotation(logger, driver, image, rotation, promiseFactory) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(driver, 'driver');
    ArgumentGuard.notNull(image, 'image');

    return promiseFactory.resolve()
      .then(() => {
        if (rotation) {
          return rotation.getRotation();
        }
        return EyesSeleniumUtils.tryAutomaticRotation(logger, driver, image);
      })
      .then(degrees => image.rotate(degrees));
  }
}

module.exports = EyesWebDriver;
