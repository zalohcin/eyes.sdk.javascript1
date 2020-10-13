'use strict'
function calculateMatchRegions({codedRegions = [], selectorRegions = [], imageLocationRegion}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0

  return codedRegions.map(selectors => {
    if (selectors && selectors.length > 0) {
      return selectors.reduce((regions, userRegion) => {
        const userRegions = userRegion.selector
          ? selectorRegions[selectorRegionIndex++]
          : [userRegion]

        if (userRegions && userRegions.length > 0) {
          userRegions.forEach(region => {
            if (imageLocationRegion) {
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
