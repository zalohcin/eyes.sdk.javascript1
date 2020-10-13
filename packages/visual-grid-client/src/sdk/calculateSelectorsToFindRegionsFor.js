'use strict'

function selectorObject({selector, type}) {
  return type === 'xpath' || type === 'css' ? {type, selector} : selector
}

function calculateSelectorsToFindRegionsFor({sizeMode, selector, userRegions = []}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined
  if (userRegions.every(s => !s)) {
    return selectorsToFindRegionsFor
  }

  const selectors = userRegions.reduce((prev, regions) => {
    if (Array.isArray(regions)) {
      prev.push(...regions.filter(region => selectorObject(region)))
    } else if (regions && regions.selector) {
      prev.push(selectorObject(regions))
    }

    return prev
  }, [])

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return (selectorsToFindRegionsFor || []).concat(selectors)
}

module.exports = calculateSelectorsToFindRegionsFor
