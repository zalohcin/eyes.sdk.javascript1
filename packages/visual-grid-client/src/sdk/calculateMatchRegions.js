'use strict'

function calculateMatchRegions({userSelectors, selectorRegions, imageLocationRegion}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0
  const regions = []

  selectorRegions = selectorRegions.map(regions => {
    return regions.map(region => {
      return imageLocationRegion
        ? {
            width: region.getWidth(),
            height: region.getHeight(),
            left: Math.max(0, region.getLeft() - imageLocationRegion.getLeft()),
            top: Math.max(0, region.getTop() - imageLocationRegion.getTop()),
          }
        : region.toJSON()
    })
  })

  for (const userSelector of userSelectors) {
    if (userSelector && userSelector.length > 0) {
      const currentLength = userSelector.length
      const innerArrays = selectorRegions.slice(
        selectorRegionIndex,
        selectorRegionIndex + currentLength,
      )
      innerArrays.push(userSelector.filter(selector => !selector.selector))
      selectorRegionIndex += currentLength
      const flattened = innerArrays.reduce((prev, curr) => prev.concat(curr), [])
      if (flattened.length > 0) {
        regions.push(flattened)
      }
    } else {
      regions.push(undefined)
    }
  }

  return regions
}

module.exports = calculateMatchRegions
