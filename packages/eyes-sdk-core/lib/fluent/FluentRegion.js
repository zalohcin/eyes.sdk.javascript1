'use strict'
const CoordinatesTypes = require('../geometry/CoordinatesType')
const EyesUtils = require('../sdk/EyesUtils')

/**
 * @internal
 * @template TSelector
 */
class FluentRegion {
  /**
   * @param {TSelector} selector
   */
  constructor({region, element, selector, options}) {
    this._region = region
    this._element = element
    this._selector = selector

    this._options = options
  }

  async getRegion(context, screenshot) {
    if (this._region) {
      return [
        {
          left: Math.round(this._region.getLeft()),
          top: Math.round(this._region.getTop()),
          width: Math.round(this._region.getWidth()),
          height: Math.round(this._region.getHeight()),
          ...this._options,
        },
      ]
    }

    let elements = []
    if (this._selector) {
      elements = await context.elements(this._selector)
    } else if (this._element) {
      elements = [await context.element(this._element)]
    }

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const location = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesTypes.CONTEXT_RELATIVE,
        CoordinatesTypes.SCREENSHOT_AS_IS,
      )
      regions.push({
        left: Math.round(location.getX()),
        top: Math.round(location.getY()),
        width: Math.round(rect.getWidth()),
        height: Math.round(rect.getHeight()),
        ...this._options,
      })
    }
    return regions
  }
  /**
   * @template TDriver, TElement
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<PersistedRegions[]>}
   */
  async toPersistedRegions(context) {
    if (this._region) {
      return [
        {
          left: Math.round(this._region.getLeft()),
          top: Math.round(this._region.getTop()),
          width: Math.round(this._region.getWidth()),
          height: Math.round(this._region.getHeight()),
          ...this._options,
        },
      ]
    } else if (this._element) {
      const xpath = await EyesUtils.getElementXpath(context._logger, context, this._element)
      return [{...this._options, type: 'xpath', selector: xpath}]
    } else if (this._selector) {
      const regions = await EyesUtils.toPersistedRegions(context._logger, context, this._selector)
      return regions.map(region => ({...this._options, ...region}))
    }
  }
}

module.exports = FluentRegion
