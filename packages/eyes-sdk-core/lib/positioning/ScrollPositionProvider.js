'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const ScrollPositionMemento = require('./ScrollPositionMemento')
const EyesUtils = require('../EyesUtils')

class ScrollPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor, scrollRootElement) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    super()

    this._logger = logger
    this._executor = executor
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition(customScrollRootElement) {
    try {
      this._logger.verbose('ScrollPositionProvider - getCurrentPosition()')
      const location = await EyesUtils.getScrollLocation(
        this._logger,
        this._executor,
        customScrollRootElement || this._scrollRootElement,
      )
      this._logger.verbose(`Current position: ${location}`)
      return location
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to extract current scroll position!`)
      return Location.ZERO
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location, customScrollRootElement) {
    try {
      this._logger.verbose(`ScrollPositionProvider - Scrolling to ${location}`)
      const actualLocation = await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        location,
        customScrollRootElement || this._scrollRootElement,
      )
      return actualLocation
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`)
      return Location.ZERO
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = this._scrollRootElement
      ? await EyesUtils.getElementEntireSize(this._logger, this._executor, this._scrollRootElement)
      : await EyesUtils.getCurrentFrameContentEntireSize(this._logger, this._executor)
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${size}`)
    return size
  }

  async markScrollRootElement() {
    try {
      await EyesUtils.markScrollRootElement(this._logger, this._executor, this._scrollRootElement)
    } catch (err) {
      this._logger.verbose("Can't set data attribute for element", err)
    }
  }

  /**
   * @override
   * @return {Promise.<ScrollPositionMemento>}
   */
  async getState() {
    const location = await this.getCurrentPosition()
    return new ScrollPositionMemento(location)
  }

  /**
   * @override
   * @param {ScrollPositionMemento} state The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    await this.setPosition(new Location(state.getX(), state.getY()))
    this._logger.verbose('Position restored.')
  }
}

module.exports = ScrollPositionProvider
