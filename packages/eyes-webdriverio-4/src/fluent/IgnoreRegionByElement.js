'use strict'

const {GetRegion, Region, Location, CoordinatesType} = require('@applitools/eyes-sdk-core')

const {SelectorByElement} = require('./SelectorByElement')

class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {EyesWebElement} webElement
   */
  constructor(webElement) {
    super()
    this._element = webElement
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

    return [new Region(lTag.getX(), lTag.getY(), size.getWidth(), size.getHeight())]
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) {
    return new SelectorByElement(this._element).getSelector(eyes)
  }
}

module.exports = IgnoreRegionByElement
