'use strict'

function calculateMatchRegions({selectors, selectorRegions, imageLocationRegion}) {
  const offsetSelectors = selectors.floating || []
  const noOffsetSelectors = selectors.all || []

  let selectorRegionIndex = imageLocationRegion ? 1 : 0
  const noOffsetRegions = noOffsetSelectors.map(selector => mapSelectionToRegions(selector))

  const offsetRegions = offsetSelectors.map(selector => {
    const offsetRegion = mapSelectionToRegions(selector)
    return Object.assign(offsetRegion, {
      maxUpOffset: offsetRegion.maxUpOffset,
      maxDownOffset: offsetRegion.maxDownOffset,
      maxLeftOffset: offsetRegion.maxLeftOffset,
      maxRightOffset: offsetRegion.maxRightOffset,
    })
  })

  return {
    noOffsetRegions,
    offsetRegions,
  }

  function mapSelectionToRegions(selector) {
    if (selector && selector.length > 0) {
      const regions = []
      for (const [index, selectorObj] of selector.entries()) {
        const region = selectorToRegion(selectorObj, index)
        if (region) {
          regions.push(region)
        }
      }
      selectorRegionIndex++
      return regions.length === 0 ? undefined : regions
    }

    return selector
  }

  function selectorToRegion(selectorObj, index = 0) {
    if (selectorObj.selector) {
      const selectorRegion = selectorRegions[selectorRegionIndex][index] || []
      if (!selectorRegion || selectorRegion.length === 0) {
        return null
      }

      let ret = imageLocationRegion
        ? {
            width: selectorRegion.getWidth(),
            height: selectorRegion.getHeight(),
            left: Math.max(0, selectorRegion.getLeft() - imageLocationRegion.getLeft()),
            top: Math.max(0, selectorRegion.getTop() - imageLocationRegion.getTop()),
          }
        : selectorRegion.toJSON()

      if (selectorObj.accessibilityType) {
        ret.accessibilityType = selectorObj.accessibilityType
      }

      return ret
    } else {
      return selectorObj
    }
  }
}

module.exports = calculateMatchRegions
