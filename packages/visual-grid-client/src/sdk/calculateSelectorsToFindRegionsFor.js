'use strict'

function selectorObject({selector, type}) {
  return type === 'xpath' || type === 'css' ? {type, selector} : selector
}

function calculateSelectorsToFindRegionsFor({
  sizeMode,
  selector,
  ignore,
  layout,
  strict,
  content,
  accessibility,
  floating,
}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined
  const userRegions = [ignore, layout, strict, content, accessibility, floating]

  if (userRegions.every(s => !s)) {
    return {selectorsToFindRegionsFor}
  }

  const selectors = userRegions.reduce((prev, regions) => {
    if (Array.isArray(regions)) {
      prev.push(...regions.filter(region => region.selector).map(selectorObject))
    } else if (regions && regions.selector) {
      prev.push(selectorObject(regions))
    }

    return prev
  }, [])

  function getMatchRegions({selectorRegions, imageLocationRegion}) {
    let selectorRegionIndex = imageLocationRegion ? 1 : 0
    return userRegions.map((userRegion, userRegionIndex) => {
      if (userRegion) {
        const userSelectors = Array.isArray(userRegion) ? userRegion : [userRegion]
        return userSelectors.reduce((regions, userSelector) => {
          const codedRegions = userSelector.selector
            ? selectorRegions[selectorRegionIndex++]
            : [userSelector]

          if (codedRegions && codedRegions.length > 0) {
            codedRegions.forEach(region => {
              const regionObject = regionify({region, imageLocationRegion})
              regions.push(regionWithUserInput({regionObject, userSelector, userRegionIndex}))
            })
          }

          return regions
        }, [])
      }
    })
  }

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return {
    selectorsToFindRegionsFor: (selectorsToFindRegionsFor || []).concat(selectors),
    getMatchRegions,
  }
}

function regionify({region, imageLocationRegion}) {
  if (imageLocationRegion && region['getWidth']) {
    return {
      width: region.getWidth(),
      height: region.getHeight(),
      left: Math.max(0, region.getLeft() - imageLocationRegion.getLeft()),
      top: Math.max(0, region.getTop() - imageLocationRegion.getTop()),
    }
  } else {
    return region['toJSON'] ? region.toJSON() : region
  }
}

function regionWithUserInput({regionObject, userSelector, userRegionIndex}) {
  const accesibilityRegionIndex = 4
  const floatingRegionIndex = 5
  // accesibility regions
  if (userRegionIndex === accesibilityRegionIndex) {
    Object.assign(regionObject, {
      accessibilityType: userSelector.accessibilityType,
    })
  }
  // floating region
  if (userRegionIndex === floatingRegionIndex) {
    Object.assign(regionObject, {
      maxUpOffset: userSelector.maxUpOffset,
      maxDownOffset: userSelector.maxDownOffset,
      maxLeftOffset: userSelector.maxLeftOffset,
      maxRightOffset: userSelector.maxRightOffset,
    })
  }
}

module.exports = calculateSelectorsToFindRegionsFor
