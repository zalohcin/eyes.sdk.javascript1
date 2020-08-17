function parseTest({history, meta}) {
  const name = []
  console.log(history, meta)
  history.forEach(action => {
    if (action.name === 'driver.switchToFrame') {
      name.push('ManualSwitchToFrame')
    } else if (action.name === 'driver.executeScript') {
      const [script] = action.args
      if (script.search(/\bscroll(To|By)\b/) !== -1) {
        name.push('ManualScroll')
      }
    } else if (action.name === 'eyes.open') {
      // name.push('Open')
    } else if (action.name === 'eyes.check') {
      const [checkSettings = {}] = action.args
      name.push(checkSettingsToName(checkSettings))
    } else if (action.name === 'eyes.close') {
      name.push('Close')
    }
  }, '')
  console.log(name)
}

function checkSettingsToName(checkSettings) {
  let name = 'Check'
  if (checkSettings.region) {
    const regionType = getRegionType(checkSettings.region)
    name += regionType ? `RegionBy${regionType}` : 'Region'
    if (checkSettings.frames) {
      name += Array(checkSettings.frames.length)
        .fill('InFrame')
        .join('')
    }
  } else if (checkSettings.frames) {
    name += 'Frame'
    name += Array(checkSettings.frames.length - 1)
      .fill('InFrame')
      .join('')
  } else {
    name += 'Window'
  }

  if (checkSettings.isFully) {
    name += 'Fully'
  }
  if (checkSettings.scrollRootElement) {
    name += 'WithCustomScrollRoot'
  }
  if (checkSettings.matchLevel) {
    name += `With${checkSettings.matchLevel}MatchLevel`
  }
  if (checkSettings.ignoreRegions && checkSettings.ignoreRegions.length > 0) {
    name += regionsToName('Ignore', checkSettings.ignoreRegions)
  }
  if (checkSettings.floatingRegions && checkSettings.floatingRegions.length > 0) {
    name += regionsToName('Floating', checkSettings.floatingRegions)
  }
  if (checkSettings.accessibilityRegions && checkSettings.accessibilityRegions.length > 0) {
    name += regionsToName('Accessibility', checkSettings.accessibilityRegions)
  }
  if (checkSettings.layoutRegions && checkSettings.layoutRegions.length > 0) {
    name += regionsToName('Layout', checkSettings.layoutRegions)
  }
  if (checkSettings.strictRegions && checkSettings.ignoreRegions.length > 0) {
    name += regionsToName('Strict', checkSettings.ignoreRegions)
  }
  if (checkSettings.contentRegions && checkSettings.contentRegions.length > 0) {
    name += regionsToName('Content', checkSettings.contentRegions)
  }
  return name
}

function regionsToName(prefix, regions) {
  const regionName = `${prefix}Region`
  const regionTypes = regions.map(getRegionType)
  if (regionTypes.every(type => type === regionTypes[0])) {
    return regionTypes[0] ? `With${regionName}sBy${regionTypes[0]}` : `With${regionName}s`
  } else {
    regionTypes.reduce((name, regionType) => {
      return name + regionType ? `With${regionName}By${regionType}` : `With${regionName}`
    }, '')
  }
}

function getRegionType(region) {
  if (
    region.hasOwnProperty('left') &&
    region.hasOwnProperty('top') &&
    region.hasOwnProperty('width') &&
    region.hasOwnProperty('height')
  ) {
    return 'Coordinates'
  } else if (
    typeof region === 'string' ||
    (region.hasOwnProperty('type') && region.hasOwnProperty('selector'))
  ) {
    return 'Selector'
  } else if (region.isRef) {
    return region.type()
  }
}

exports.parseTest = parseTest
