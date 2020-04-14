'use strict'

const {ArgumentGuard, PositionProvider, Location, EyesUtils} = require('@applitools/eyes-sdk-core')

const ScrollPositionMemento = require('./ScrollPositionMemento')

class ScrollPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor) {
    super()

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')

    this._logger = logger
    this._executor = executor

    this._logger.verbose('creating ScrollPositionProvider')
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    try {
      this._logger.verbose('ScrollPositionProvider - getCurrentPosition()')
      const location = await EyesUtils.getScrollLocation(this._logger, this._executor)
      this._logger.verbose(`Current position: ${location}`)
      return location
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to extract current scroll position!`)
      return new Location(0, 0)
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location) {
    try {
      this._logger.verbose(`ScrollPositionProvider - Scrolling to ${location}`)
      await EyesUtils.scrollTo(this._logger, this._executor, location)
      this._logger.verbose('ScrollPositionProvider - Done scrolling!')
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`)
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = await EyesUtils.getCurrentFrameContentEntireSize(this._logger, this._executor)
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * @override
   * @return {Promise.<ScrollPositionMemento>}
   */
  getState() {
    return this.getCurrentPosition().then(position => new ScrollPositionMemento(position))
  }

  /**
   * @override
   * @param {ScrollPositionMemento} state The initial state of position
   * @return {Promise}
   */
  restoreState(state) {
    const that = this
    return this.setPosition(new Location(state.getX(), state.getY())).then(() => {
      that._logger.verbose('Position restored.')
    })
  }
}

module.exports = ScrollPositionProvider
