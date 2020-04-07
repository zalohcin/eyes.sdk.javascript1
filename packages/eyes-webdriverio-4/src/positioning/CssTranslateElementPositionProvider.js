'use strict'

const {Location} = require('@applitools/eyes-sdk-core')

const ElementPositionProvider = require('./ElementPositionProvider')
const EyesWDIOUtils = require('./../EyesWDIOUtils')

class CssTranslateElementPositionProvider extends ElementPositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {WDIODriver} driver
   * @param {WDIOElement} element
   */
  constructor(logger, driver, element) {
    super(logger, driver, element)

    this._driver = driver
    this._logger.verbose('creating CssTranslateElementPositionProvider')
  }

  /**
   * @override
   * @inheritDoc
   * @return {Promise.<Location>}
   */
  getCurrentPosition() {
    const that = this
    let position
    return super
      .getCurrentPosition()
      .then(
        /**@type {Location}*/ _position => {
          position = _position
          return that._transformsOffset()
        },
      )
      .then(
        /**@type {Location}*/ transformsOffset => {
          return position.offsetNegative(transformsOffset)
        },
      )
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location) {
    const loc = new Location(location)
    await super.setPosition(location)
    const currentPosition = await this.getCurrentPosition()
    const outOfEyes = loc.offsetNegative(currentPosition)
    const transformsOffset = await this._transformsOffset()
    const webElementPromise = this._driver.finder.findElement(this._element.selector)
    const position = transformsOffset.offsetNegative(outOfEyes)
    return EyesWDIOUtils.elementTranslateTo(this._driver.executor, webElementPromise, position)
  }

  /**
   * @return {Promise.<Location>}
   */
  async _transformsOffset() {
    this._logger.verbose('Getting element transforms...')
    const element = await this._driver.finder.findElement(this._element.selector)
    const transforms = await EyesWDIOUtils.getCurrentElementTransforms(this._driver, element)
    this._logger.verbose(`Current transforms: ${JSON.stringify(transforms)}`)
    const transformPositions = Object.keys(transforms)
      .filter(key => transforms[key] !== null && transforms[key] !== '')
      .map(key => CssTranslateElementPositionProvider._getPositionFromTransforms(transforms[key]))

    for (let tpIndex in transformPositions) {
      if (!transformPositions[0].equals(transformPositions[tpIndex])) {
        throw new Error('Got different css positions!')
      }
    }

    return transformPositions[0] || Location.ZERO
  }

  static _getPositionFromTransforms(transform) {
    const regexp = new RegExp(/^translate\(\s*(\-?)([\d, \.]+)px,\s*(\-?)([\d, \.]+)px\s*\)/)

    const data = transform.match(regexp)

    if (!data) {
      throw new Error(`Can't parse CSS transition: ${transform}!`)
    }

    let x = Math.round(parseFloat(data[2]))
    let y = Math.round(parseFloat(data[4]))

    if (!data[1]) {
      x *= -1
    }

    if (!data[3]) {
      y *= -1
    }

    return new Location(x, y)
  }
}

module.exports = CssTranslateElementPositionProvider
