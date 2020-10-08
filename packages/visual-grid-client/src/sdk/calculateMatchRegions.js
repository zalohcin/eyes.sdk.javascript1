'use strict'

function calculateMatchRegions({
  noOffsetSelectors,
  offsetSelectors,
  selectorRegions,
  imageLocationRegion,
}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0
  const noOffsetRegions = noOffsetSelectors.map(selector => mapSelectionToRegions(selector, false))
  const offsetRegions = offsetSelectors.map(selector => mapSelectionToRegions(selector, true))

  return {
    noOffsetRegions,
    offsetRegions,
  }

  function mapSelectionToRegions(selector, addOffset) {
    if (selector && selector.length > 0) {
      let region
      const regions = []
      for (const selectorObj of selector) {
        region = selectorToRegion(selectorObj, addOffset)
        if (region.length > 0) {
          regions.push(...region)
        }
      }
      return regions.length === 0 ? undefined : regions
    }

    return selector
  }

  function selectorToRegion(selectorObj, addOffset) {
    if (selectorObj.selector) {
      return selectorRegions[selectorRegionIndex++].map(selectorRegion => {
        if (!selectorRegion || selectorRegion.getError()) {
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

        if (addOffset) {
          ret = Object.assign(ret, {
            maxUpOffset: selectorObj.maxUpOffset,
            maxDownOffset: selectorObj.maxDownOffset,
            maxLeftOffset: selectorObj.maxLeftOffset,
            maxRightOffset: selectorObj.maxRightOffset,
          })
        }
        if (selectorObj.accessibilityType) {
          ret.accessibilityType = selectorObj.accessibilityType
        }

        return ret
      })
    } else {
      return selectorObj
    }
  }
}

module.exports = calculateMatchRegions
