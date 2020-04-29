'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const CssTranslatePositionMemento = require('./CssTranslatePositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
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
      this._logger.verbose('CssTranslatePositionProvider - getCurrentPosition()')
      const location = await EyesUtils.getTranslateLocation(
        this._logger,
        this._executor,
        customScrollRootElement || this._scrollRootElement,
      )
      this._logger.verbose(`Current position: ${location}`)
      return location
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to extract current translate position!`)
      return Location.ZERO
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location, customScrollRootElement) {
    try {
      this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`)
      const actualLocation = await EyesUtils.translateTo(
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
    this._logger.verbose(`CssTranslatePositionProvider - Entire size: ${size}`)
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
   * @return {Promise.<CssTranslatePositionMemento>}
   */
  async getState() {
    try {
      const transforms = await EyesUtils.getTransforms(
        this._logger,
        this._executor,
        this._scrollRootElement,
      )
      this._logger.verbose('Current transform', transforms)
      return new CssTranslatePositionMemento(transforms, Location.ZERO)
    } catch (err) {
      this._logger.verbose(`Failed to get current transforms!.`)
      return new CssTranslatePositionMemento({}, Location.ZERO)
    }
  }

  /**
   * @override
   * @param {CssTranslatePositionMemento} state The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    try {
      await EyesUtils.setTransforms(
        this._logger,
        this._executor,
        state.transform,
        this._scrollRootElement,
      )
      this._logger.verbose('Transform (position) restored.')
    } catch (err) {
      this._logger.verbose(`Failed to restore state!.`)
    }
  }
}

module.exports = CssTranslatePositionProvider
