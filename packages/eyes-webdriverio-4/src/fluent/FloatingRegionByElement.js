'use strict'

const {
  GetFloatingRegion,
  FloatingMatchSettings,
  Location,
  CoordinatesType,
  EyesJsBrowserUtils,
} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('../wrappers/WDIOElement')

class FloatingRegionByElement extends GetFloatingRegion {
  /**
   * @param {WDIOElement|object} element
   * @param {int} maxUpOffset
   * @param {int} maxDownOffset
   * @param {int} maxLeftOffset
   * @param {int} maxRightOffset
   */
  constructor(element, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._element = element
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }

  /**
   * @override
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   */
  // eslint-disable-next-line
  async getRegion(eyes, screenshot) {
    this._element = new WDIOElement(eyes._logger, eyes.getDriver(), this._element)

    const point = await this._element.getLocation()
    const size = await this._element.getSize()
    const lTag = screenshot.convertLocation(
      new Location(point),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    const floatingRegion = new FloatingMatchSettings({
      left: lTag.getX(),
      top: lTag.getY(),
      width: size.getWidth(),
      height: size.getHeight(),
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    })
    return [floatingRegion]
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver, this._element.element.value)
    return [
      {
        type: 'xpath',
        selector: xpath,
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

module.exports = FloatingRegionByElement
