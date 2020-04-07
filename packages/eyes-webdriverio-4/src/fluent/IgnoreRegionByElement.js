'use strict'

const {
  GetRegion,
  Region,
  Location,
  CoordinatesType,
  EyesJsBrowserUtils,
} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('../wrappers/WDIOElement')
const {SelectorByElement} = require('./SelectorByElement')

class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {WDIOElement|object} element
   */
  constructor(element) {
    super()
    this._element = element
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

    return [new Region(lTag.getX(), lTag.getY(), size.getWidth(), size.getHeight())]
  }

  /**
   * @inheritDoc
   * @param {WDIODriver} driver
   * @return {Promise<string>}
   */
  async getSelector(driver) {
    return new SelectorByElement(this._element).getSelector(driver)
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver, this._element.element.value)
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = IgnoreRegionByElement
