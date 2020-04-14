'use strict'

const {PositionProvider, ArgumentGuard, EyesUtils} = require('@applitools/eyes-sdk-core')

const CssTranslatePositionMemento = require('./CssTranslatePositionMemento')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    super()

    this._logger = logger
    this._executor = executor
    this._lastSetPosition = undefined

    this._logger.verbose('creating CssTranslatePositionProvider')
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose('position to return: ', this._lastSetPosition)
    return this._lastSetPosition
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location) {
    ArgumentGuard.notNull(location, 'location')

    this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`)

    await EyesUtils.translateTo(this._logger, this._executor, location)
    this._logger.verbose('Done!')
    this._lastSetPosition = location
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = await EyesUtils.getCurrentFrameContentEntireSize(this._logger, this._executor)
    this._logger.verbose(`CssTranslatePositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * @override
   * @return {Promise.<CssTranslatePositionMemento>}
   */
  async getState() {
    const transforms = await EyesUtils.getTransforms(this._logger, this._executor)
    this._logger.verbose('Current transform', transforms)
    return new CssTranslatePositionMemento(transforms, this._lastSetPosition)
  }

  /**
   * @override
   * @param {CssTranslatePositionMemento} state The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    await EyesUtils.setTransforms(this._logger, this._executor, state.transform)
    this._logger.verbose('Transform (position) restored.')
    this._lastSetPosition = state.position
  }
}

module.exports = CssTranslatePositionProvider
