'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const CssTranslatePositionMemento = require('./CssTranslatePositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslateElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor, element) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    ArgumentGuard.notNull(element, 'element')
    super()

    this._logger = logger
    this._executor = executor
    this._element = element
  }

  get scrollRootElement() {
    return this._element
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    try {
      const [scrollLocation, translateLocation] = await Promise.all([
        EyesUtils.getScrollLocation(this._logger, this._executor, this._element),
        EyesUtils.getTranslateLocation(this._logger, this._executor, this._element),
      ])
      return scrollLocation.offsetByLocation(translateLocation)
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
  async setPosition(location) {
    try {
      ArgumentGuard.notNull(location, 'location')
      const actualScrollLocation = await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        location,
        this._element,
      )
      const outOfBoundsLocation = location.offsetNegative(actualScrollLocation)
      const actualTranslateLocation = await EyesUtils.translateTo(
        this._logger,
        this._executor,
        outOfBoundsLocation,
        this._element,
      )

      return actualScrollLocation.offsetByLocation(actualTranslateLocation)
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
    const size = await EyesUtils.getElementEntireSize(this._logger, this._executor, this._element)
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${size}`)
    return size
  }

  async markScrollRootElement() {
    try {
      await EyesUtils.markScrollRootElement(this._logger, this._executor, this._element)
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
      const transforms = await EyesUtils.getTransforms(this._logger, this._executor, this._element)
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
      await EyesUtils.setTransforms(this._logger, this._executor, state.transform, this._element)
      this._logger.verbose('Transform (position) restored.')
    } catch (err) {
      this._logger.verbose(`Failed to restore state!.`)
    }
  }
}

module.exports = CssTranslateElementPositionProvider
