'use strict'

const {ArgumentGuard, TypeUtils, EyesJsBrowserUtils} = require('@applitools/eyes-sdk-core')

const Frame = require('../frames/Frame')
const FrameChain = require('../frames/FrameChain')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const WDIOJSExecutor = require('../WDIOJSExecutor')
const EyesWebElement = require('./EyesWebElement')
const TargetLocator = require('../TargetLocator')
const WebElement = require('./WebElement')

/**
 * Wraps a target locator so we can keep track of which frames have been switched to.
 */
class EyesTargetLocator extends TargetLocator {
  /**
   * Initialized a new EyesTargetLocator object.
   *
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver The WebDriver from which the targetLocator was received.
   * @param {TargetLocator} targetLocator The actual TargetLocator object.
   */
  constructor(logger, driver, targetLocator = null) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')
    ArgumentGuard.notNull(targetLocator, 'targetLocator')

    super(driver.webDriver)

    this._logger = logger
    this._driver = driver
    this._targetLocator = targetLocator
    this._jsExecutor = new WDIOJSExecutor(driver)
    this._scrollPosition = new ScrollPositionProvider(this._logger, this._jsExecutor)
  }

  async refresh() {
    const currentFrame = this._driver.getFrameChain().peek()
    const frames = []
    let targetFrame
    while ((targetFrame = await this._driver.getTargetFrame())) {
      if (currentFrame && currentFrame.getReference().elementId === targetFrame.ELEMENT) break
      await this._driver.remoteWebDriver.frameParent()
      const xpath = await EyesJsBrowserUtils.getElementXpath(this._driver, targetFrame)
      frames.unshift(
        new EyesWebElement(
          this._logger,
          this._driver,
          new WebElement(this._driver, targetFrame, {using: 'xpath', value: `/${xpath}`}),
        ),
      )
    }

    await this.frames(frames)
  }

  /**
   * Schedules a command to switch the focus of all future commands to another
   * frame on the page. The target frame may be specified as one of the following:
   *
   * - A number that specifies a (zero-based) index into [window.frames](
   *   https://developer.mozilla.org/en-US/docs/Web/API/Window.frames).
   * - A string, which correspond to a `id` or `name` of element.
   * - A {@link WebElement} reference, which correspond to a `frame` or `iframe` DOM element.
   * - The `null` value, to select the topmost frame on the page. Passing `null`
   *   is the same as calling {@link #defaultContent defaultContent()}.
   *
   * @override
   * @param {number|string|WebElement|EyesWebElement|null} [arg1] The frame locator.
   * @return {Promise.<void>}
   */
  async frame(arg1) {
    if (!arg1) {
      this._logger.verbose('EyesTargetLocator.frame(null)')
      await this.defaultContent()
      return
    }

    let frame
    if (TypeUtils.isInteger(arg1)) {
      const frameIndex = arg1
      this._logger.verbose(`EyesTargetLocator.frame(${frameIndex})`)
      // Finding the target element so and reporting it using onWillSwitch.
      this._logger.verbose('Getting frames list...')
      const frames = await this._driver.findElementsByCssSelector('frame, iframe')
      if (frameIndex > frames.length) {
        throw new TypeError(`Frame index [${frameIndex}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      frame = await Frame.from(frames[frameIndex])
    } else if (TypeUtils.isString(arg1)) {
      const frameNameOrId = arg1
      this._logger.verbose(`EyesTargetLocator.frame(${frameNameOrId})`)
      // Finding the target element so we can report it.
      // We use find elements(plural) to avoid exception when the element is not found.
      this._logger.verbose('Getting frames by name...')
      let frames = await this._driver.findElementsByName(frameNameOrId)
      if (frames.length === 0) {
        this._logger.verbose('No frames Found! Trying by id...')
        // If there are no frames by that name, we'll try the id
        frames = await this._driver.findElementsById(frameNameOrId)
        if (frames.length === 0) {
          // No such frame, bummer
          throw new TypeError(`No frame with name or id '${frameNameOrId}' exists!`)
        }
      }
      frame = await Frame.from(frames[0])
    } else {
      this._logger.verbose('EyesTargetLocator.frame(frameOrElement)')
      frame = await Frame.from(arg1)
    }
    this._logger.verbose('Done! Switching to frame...')
    await this._targetLocator.frame(frame.getReference().element)
    await this._driver.getFrameChain().push(frame)
    this._logger.verbose('Done!')
  }

  /**
   * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
   *
   * @return {Promise.<EyesWebDriver>}
   */
  async parentFrame() {
    this._logger.verbose('EyesTargetLocator.parentFrame()')
    if (this._driver.getFrameChain().size() !== 0) {
      this._logger.verbose('Making preparations...')
      this._driver.getFrameChain().pop()
      this._logger.verbose('Done! Switching to parent frame..')
      await this._driver.remoteWebDriver.frameParent()
    }
    return this._driver
  }

  /**
   * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
   *
   * @param {FrameChain} frameChain The path to the frame to switch to.
   * @return {Promise.<void>} The WebDriver with the switched context.
   */
  async framesDoScroll(frameChain) {
    this._logger.verbose('EyesTargetLocator.framesDoScroll(frameChain)')
    await this.defaultContent()
    this._defaultContentPositionMemento = await this._scrollPosition.getState()

    for (const frame of frameChain.getFrames()) {
      this._logger.verbose('Scrolling by parent scroll position...')
      const frameLocation = frame.getLocation()
      await this._scrollPosition.setPosition(frameLocation)
      this._logger.verbose('Done! Switching to frame...')
      await this.frame(frame)
      this._logger.verbose('Done!')
    }

    this._logger.verbose('Done switching into nested frames!')
  }

  /**
   * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
   *
   * @param {FrameChain|string[]} varArg The path to the frame to switch to. Or the path to the frame to check. This is a list of frame names/IDs (where each frame is nested in the previous frame).
   * @return {Promise.<void>} The WebDriver with the switched context.
   */
  async frames(varArg) {
    if (varArg instanceof FrameChain) {
      this._logger.verbose('EyesTargetLocator.frames(frameChain)')
      await this.defaultContent()

      for (const frame of varArg.getFrames()) {
        this._logger.verbose('Switching to frame...')
        await this.frame(frame)
        this._logger.verbose('Done!')
      }

      this._logger.verbose('Done switching into nested frames!')
      return
    }

    if (Array.isArray(varArg)) {
      this._logger.verbose('EyesTargetLocator.frames(framesPath)')

      for (const frameNameOrId of varArg) {
        this._logger.verbose('Switching to frame...')
        await this.frame(frameNameOrId)
        this._logger.verbose('Done!')
      }

      this._logger.verbose('Done switching into nested frames!')
    }
  }

  /**
   * Schedules a command to switch the focus of all future commands to another window.
   * Windows may be specified by their {@code window.name} attribute or by its handle.
   *
   * @override
   * @param {string} nameOrHandle The name or window handle of the window to switch focus to.
   * @return {Promise.<EyesWebDriver>}
   */
  async window(nameOrHandle) {
    this._logger.verbose('EyesTargetLocator.window()')
    if (this._driver.getFrameChain().size() > 0) {
      this._logger.verbose('Making preparations...')
      this._driver.getFrameChain().clear()
    }
    this._logger.verbose('Done! Switching to window...')
    await this._targetLocator.window(nameOrHandle)
    this._logger.verbose('Done!')
    return this._driver
  }

  /**
   * Schedules a command to switch focus of all future commands to the topmost frame on the page.
   *
   * @override
   */
  async defaultContent() {
    this._logger.verbose('EyesTargetLocator.defaultContent()')
    if (this._driver.getFrameChain().size() > 0) {
      this._logger.verbose('Making preparations...')
      this._driver.getFrameChain().clear()
    }
    this._logger.verbose('Done! Switching to default content...')
    await this._targetLocator.defaultContent()
    this._logger.verbose('Done!')
  }

  /**
   * Schedules a command retrieve the {@code document.activeElement} element on the current document,
   * or {@code document.body} if activeElement is not available.
   *
   * @override
   * @return {!EyesWebElement}
   */
  activeElement() {
    this._logger.verbose('EyesTargetLocator.activeElement()')
    this._logger.verbose('Switching to element...')

    const element = this._driver.remoteWebDriver.elementActive()
    // const element = this._driver.schedule(new command.Command(command.Name.GET_ACTIVE_ELEMENT), 'WebDriver.switchTo().activeElement()');
    this._logger.verbose('Done!')
    return new EyesWebElement(
      this._logger,
      this._driver,
      new WebElement(this._driver.remoteWebDriver, element),
    )
  }

  /**
   * Schedules a command to change focus to the active modal dialog, such as those opened by `window.alert()`, `window.confirm()`, and `window.prompt()`.
   * The returned promise will be rejected with a {@linkplain error.NoSuchAlertError} if there are no open alerts.
   *
   * @return {!AlertPromise} The open alert.
   */
  alert() {
    this._logger.verbose('EyesTargetLocator.alert()')
    this._logger.verbose('Switching to alert...')
    const result = this._targetLocator.alert()
    this._logger.verbose('Done!')
    return result
  }
}

module.exports = EyesTargetLocator
