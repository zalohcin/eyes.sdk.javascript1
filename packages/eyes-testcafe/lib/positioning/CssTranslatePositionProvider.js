'use strict'

const {MARK_RIGHT_MARGIN} = require('testcafe/lib/screenshots/constants')
const {ArgumentGuard} = require('@applitools/eyes-sdk-core')
const {PositionProvider} = require('@applitools/eyes-sdk-core')

const {EyesTestcafeUtils} = require('../EyesTestcafeUtils')
const transformElement = require('./transformElement')
const {CssTranslatePositionMemento} = require('./CssTranslatePositionMemento')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is useful when we want to stitch a page which
 * contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger
   * @param {TestcafeExecutor} executor
   * @param {WebElement} scrollRootElement
   */
  constructor(logger, executor, scrollRootElement) {
    super()

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    ArgumentGuard.notNull(scrollRootElement, 'scrollRootElement')

    this._logger = logger
    this._executor = executor
    this._scrollRootElement = scrollRootElement

    /** @type {Location} */
    this._lastSetPosition = undefined

    this._logger.verbose('creating CssTranslatePositionProvider')
  }

  /**
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose(`position to return: ${this._lastSetPosition}`)
    return this._lastSetPosition
  }

  /**
   * @inheritDoc
   */
  async setPosition(location) {
    ArgumentGuard.notNull(location, 'location')
    this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`)

    await this._executor.executeClientFunction({
      script: transformElement,
      scriptName: 'transformElement',
      args: {
        element: this._scrollRootElement,
        transformLeft: -location.getX(),
        transformTop: -location.getY(),
        markRightMargin: MARK_RIGHT_MARGIN,
        originalTransform: undefined,
      },
    })

    this._logger.verbose('Done!')
    this._lastSetPosition = location
    return this._lastSetPosition
  }

  /**
   * @inheritDoc
   */
  async getEntireSize() {
    const entireSize = await EyesTestcafeUtils.getEntireElementSize(
      this._executor,
      this._scrollRootElement,
    )
    this._logger.verbose('CssTranslatePositionProvider - Entire size:', entireSize)
    return entireSize
  }

  /**
   * @inheritDoc
   * @return {Promise<CssTranslatePositionMemento>}
   */
  async getState() {
    let transform = await this._executor.executeClientFunction({
      script: () => _element().style.transform,
      scriptName: 'getTransform',
      args: {_element: this._scrollRootElement},
    })

    this._logger.verbose('Current transform', transform)
    return new CssTranslatePositionMemento(transform, this._lastSetPosition)
  }

  /**
   * @inheritDoc
   * @param {CssTranslatePositionMemento} state - The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    let originalTransform = state.getTransform()
    await this._executor.executeClientFunction({
      script: transformElement,
      scriptName: 'transformElement',
      args: {
        element: this._scrollRootElement,
        transformLeft: 0,
        transformTop: 0,
        markRightMargin: MARK_RIGHT_MARGIN,
        originalTransform,
      },
    })

    this._logger.verbose('Transform (position) restored.')
    this._lastSetPosition = state.getPosition()
  }

  /**
   * @return {WebElement}
   */
  getScrolledElement() {
    return this._scrollRootElement
  }
}

exports.CssTranslatePositionProvider = CssTranslatePositionProvider
