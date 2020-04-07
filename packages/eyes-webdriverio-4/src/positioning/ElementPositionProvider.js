'use strict'

const {
  ArgumentGuard,
  PositionProvider,
  RectangleSize,
  Location,
} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('../wrappers/WDIOElement')
const ElementPositionMemento = require('./ElementPositionMemento')

class ElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {WDIODriver} driver
   * @param {WDIOElement|Object} element
   */
  constructor(logger, driver, element) {
    super()
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(element, 'element')

    this._logger = logger
    this._element = new WDIOElement(this._logger, driver, element)

    this._logger.verbose('creating ElementPositionProvider')
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose('getCurrentScrollPosition()')
    const [scrollLeft, scrollTop] = await this._element.getProperty('scrollLeft', 'scrollTop')
    const location = new Location(scrollLeft, scrollTop)
    this._logger.verbose(`Current position: ${location}`)
    return location
  }

  /**
   * @override
   * @inheritDoc
   */
  setPosition(location) {
    this._logger.verbose(`Scrolling element to: ${location}`)
    return this._element.scrollTo(location).then(() => {
      this._logger.verbose('Done scrolling element!')
    })
  }

  /**
   * @override
   * @inheritDoc
   */
  getEntireSize() {
    this._logger.verbose('ElementPositionProvider - getEntireSize()')

    const that = this
    let scrollWidth
    return that._element
      .getScrollWidth()
      .then(_scrollWidth => {
        scrollWidth = _scrollWidth
        return that._element.getScrollHeight()
      })
      .then(_scrollHeight => {
        const size = new RectangleSize(scrollWidth, _scrollHeight)
        that._logger.verbose(`ElementPositionProvider - Entire size: ${size}`)
        return size
      })
  }

  /**
   * @override
   * @return {Promise.<ElementPositionMemento>}
   */
  getState() {
    return this.getCurrentPosition().then(position => new ElementPositionMemento(position))
  }

  /**
   * @override
   * @param {ElementPositionMemento} state The initial state of position
   * @return {Promise}
   */
  restoreState(state) {
    const that = this
    return this.setPosition(new Location(state.getX(), state.getY())).then(() => {
      that._logger.verbose('Position restored.')
    })
  }

  /**
   *
   * @returns {WDIOElement}
   */
  get element() {
    return this._element
  }
}

module.exports = ElementPositionProvider
