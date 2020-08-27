'use strict'
const CoordinatesTypes = require('../geometry/CoordinatesType')

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
    if (this._region) return [{...this._region.toJSON(), ...this._options}]

    const elements = await this.resolveElements(context)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const location = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesTypes.CONTEXT_RELATIVE,
        CoordinatesTypes.SCREENSHOT_AS_IS,
      )
      regions.push({
        left: location.getX(),
        top: location.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        ...this._options,
      })
    }
    return regions
  }

  async resolveElements(context) {
    let elements = []
    if (this._selector) {
      elements = await context.elements(this._selector)
    } else if (this._element) {
      elements = [await context.element(this._element)]
    }

    this._resolvedElements = elements
    return elements
  }

  toPersistedRegions(elementIdsMap) {
    if (this._region) {
      return [{...this._region.toJSON(), ...this._options}]
    } else {
      return this._resolvedElements.map(el => ({
        ...this._options,
        type: 'css',
        selector: `[data-eyes-selector="${elementIdsMap.get(el)}"]`,
      }))
    }
  }
}

module.exports = FluentRegion
