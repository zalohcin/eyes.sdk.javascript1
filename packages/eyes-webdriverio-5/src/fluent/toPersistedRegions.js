const {EyesJsBrowserUtils} = require('@applitools/eyes-sdk-core')

function makeToPersistedRegions({driver}) {
  return async function toPersistedRegions(region) {
    if (region.constructor.name === 'IgnoreRegionBySelector') {
      const locator = region._selector
      if (locator.using === 'xpath') {
        return [{type: 'xpath', selector: locator.value}]
      } else if (locator.using === 'css selector') {
        return [{type: 'css', selector: locator.value}]
      } else {
        const webElements = await driver.findElements(locator)
        const findXpaths = webElements.map(element =>
          EyesJsBrowserUtils.getElementXpath(driver, element),
        )
        const xpaths = await Promise.all(findXpaths)
        return xpaths.map(xpath => ({type: 'xpath', selector: xpath}))
      }
    } else if (region.constructor.name === 'IgnoreRegionByRectangle') {
      return [region._region]
    } else if (region.constructor.name === 'IgnoreRegionByElement') {
      const xpath = await EyesJsBrowserUtils.getElementXpath(driver, region._element)
      return [{type: 'xpath', selector: xpath}]
    }
  }
}

module.exports = makeToPersistedRegions
