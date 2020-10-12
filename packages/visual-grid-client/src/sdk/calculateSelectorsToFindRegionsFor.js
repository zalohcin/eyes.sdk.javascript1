'use strict'

function calculateSelectorsToFindRegionsFor({sizeMode, selector, userRegions}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined
  if (userRegions.every(s => !s)) {
    return selectorsToFindRegionsFor
  }

  const selectors = userRegions
    .filter(region => region && region.selector)
    .map(({type, selector}) => (type === 'xpath' || type === 'css' ? {type, selector} : selector))

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return (selectorsToFindRegionsFor || []).concat(selectors)
}

module.exports = calculateSelectorsToFindRegionsFor
