'use strict'

const {
  GetFloatingRegion,
  FloatingMatchSettings,
  Location,
  CoordinatesType,
  EyesJsBrowserUtils,
} = require('@applitools/eyes-sdk-core')

class FloatingRegionByElement extends GetFloatingRegion {
  /**
   * @param {WebElement} webElement
   * @param {int} maxUpOffset
   * @param {int} maxDownOffset
   * @param {int} maxLeftOffset
   * @param {int} maxRightOffset
   */
  constructor(webElement, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._element = webElement
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }

  /**
   * @override
   * @param {Eyes} eyesBase
   * @param {EyesScreenshot} screenshot
   */
  // eslint-disable-next-line
  async getRegion(eyesBase, screenshot) {
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
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver, this._element.element)
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
