'use strict';

function calculateSelectorsToFindRegionsFor({sizeMode, selector, ignore, floating}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined;
  if (!ignore && !floating) return selectorsToFindRegionsFor;

  const ignoreArr = ignore ? [].concat(ignore) : [];
  const floatingArr = floating ? [].concat(floating) : [];
  const ignoreAndFloating = ignoreArr.concat(floatingArr);
  const selectors = ignoreAndFloating
    .filter(region => region.selector)
    .map(({selector}) => selector);

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return (selectorsToFindRegionsFor || []).concat(selectors);
}

module.exports = calculateSelectorsToFindRegionsFor;
