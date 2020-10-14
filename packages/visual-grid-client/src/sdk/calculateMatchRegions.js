'use strict'
function calculateMatchRegions({userRegions = [], selectorRegions = [], imageLocationRegion}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0

  return userRegions.map(selector => {
    if (selector) {
      const selectors = Array.isArray(selector) ? selector : [selector]
      return selectors.reduce((regions, userRegion) => {
        const codedRegions = userRegion.selector
          ? selectorRegions[selectorRegionIndex++]
          : [userRegion]

        if (codedRegions && codedRegions.length > 0) {
          codedRegions.forEach(region => {
            if (imageLocationRegion && region['getWidth']) {
              regions.push({
                width: region.getWidth(),
                height: region.getHeight(),
                left: Math.max(0, region.getLeft() - imageLocationRegion.getLeft()),
                top: Math.max(0, region.getTop() - imageLocationRegion.getTop()),
              })
            } else {
              const regionObject = region['toJSON'] ? region.toJSON() : region
              regions.push(regionObject)
            }
          })
        }

        return regions
      }, [])
    }
  })
}
module.exports = calculateMatchRegions
