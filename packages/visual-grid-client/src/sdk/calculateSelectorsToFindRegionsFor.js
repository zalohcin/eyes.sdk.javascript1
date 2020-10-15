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
    return {selectorsToFindRegionsFor, getMatchRegions}
  }

  const selectors = userRegions.reduce((prev, regions) => {
    if (Array.isArray(regions)) {
      prev.push(...regions.filter(region => region.selector).map(selectorObject))
    } else if (regions && regions.selector) {
      prev.push(selectorObject(regions))
    }

    return prev
  }, [])

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return {
    selectorsToFindRegionsFor: (selectorsToFindRegionsFor || []).concat(selectors),
    getMatchRegions,
  }

  function getMatchRegions({selectorRegions, imageLocationRegion}) {
    let selectorRegionIndex = imageLocationRegion ? 1 : 0
    return userRegions.map((userInput, userRegionIndex) => {
      if (userInput) {
        const userRegions = Array.isArray(userInput) ? userInput : [userInput]
        return userRegions.reduce((regions, userRegion) => {
          const codedRegions = userRegion.selector
            ? selectorRegions[selectorRegionIndex++]
            : [userRegion]

          if (codedRegions && codedRegions.length > 0) {
            codedRegions.forEach(region => {
              const regionObject = regionify({region, imageLocationRegion})
              regions.push(regionWithUserInput({regionObject, userRegion, userRegionIndex}))
            })
          }

          return regions
        }, [])
      }
    })
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

  return regionObject
}

module.exports = calculateSelectorsToFindRegionsFor
