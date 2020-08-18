const {capitalize} = require('../common-util')

function parseTest({name, history, page, env = {}, config = {}}) {
  const description = {
    name,
    page,
    steps: [],
    browser: env.browser,
    vg: config.vg,
    stitchMode: config.stitchMode,
    classic: config.check === 'classic',
  }
  let step = {manual: []}

  history.forEach(action => {
    if (action.name === 'driver.switchToFrame') {
      step.manual.push('ManualSwitchToFrame')
    } else if (action.name === 'driver.executeScript') {
      const [script] = action.args
      if (script.search(/\bscroll(To|By)\b/) !== -1) {
        step.manual.push('ManualScroll')
      }
    } else if (action.name === 'eyes.check') {
      const [checkSettings] = action.args
      step.check = checkSettingsToName(checkSettings)
      description.steps.push(step)
      step = {manual: []}
    }
  })

  description.steps.push(step)

  return description
}

function testToNames({name, history, page, env = {}, config = {}}) {
  const testName = []
  if (name) {
    testName.push(name)
  } else {
    history.forEach(action => {
      if (action.name === 'driver.switchToFrame') {
        testName.push('ManualSwitchToFrame')
      } else if (action.name === 'driver.executeScript') {
        const [script] = action.args
        if (script.search(/\bscroll(To|By)\b/) !== -1) {
          testName.push('ManualScroll')
        }
      } else if (action.name === 'eyes.check') {
        const [checkSettings] = action.args
        testName.push(checkSettingsToName(checkSettings))
      }
    }, '')
    if (page) testName.push(`On${page}Page`)
  }
  const baselineName = []
  if (config.baselineName) {
    baselineName.push(config.baselineName)
  } else {
    baselineName.push(...testName)
  }
  const flags = []
  if (config.check === 'classic') flags.push('Classic')
  if (config.vg) flags.push('VG')
  if (config.stitchMode === 'Scroll') flags.push('Scroll')
  baselineName.push(...flags)
  testName.push(...flags)
  if (env.browser) testName.push(`On${capitalize(env.browser)}Browser`)

  return {testName: testName.join('_'), baselineName: baselineName.join('_')}
}

function checkSettingsToName(checkSettings = {}) {
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

  if (checkSettings.isFully) name += 'Fully'
  if (checkSettings.scrollRootElement) name += 'WithCustomScrollRoot'
  if (checkSettings.matchLevel) name += `With${checkSettings.matchLevel}MatchLevel`
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
    const type = region.type()
    return type && type.name
  }
}

exports.testToNames = testToNames
