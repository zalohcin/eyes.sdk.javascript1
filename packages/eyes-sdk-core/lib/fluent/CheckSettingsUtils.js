'use strict'
const TypeUtils = require('../utils/TypeUtils')

async function getAllRegionElements({checkSettings, context}) {
  const targetArr = checkSettings.getTargetProvider() ? [checkSettings.getTargetProvider()] : []
  return [
    ...(await resolveElements(checkSettings.getIgnoreRegions())),
    ...(await resolveElements(checkSettings.getFloatingRegions())),
    ...(await resolveElements(checkSettings.getStrictRegions())),
    ...(await resolveElements(checkSettings.getLayoutRegions())),
    ...(await resolveElements(checkSettings.getContentRegions())),
    ...(await resolveElements(checkSettings.getAccessibilityRegions())),
    ...(await resolveElements(targetArr)),
  ]

  async function resolveElements(regions) {
    const elements = []
    for (const region of regions) {
      const regionElements = await region.resolveElements(context)
      elements.push(...regionElements)
    }
    return elements
  }
}

function toCheckWindowConfiguration({checkSettings, configuration, elementIdsMap}) {
  const config = {
    ignore: persistRegions(checkSettings.getIgnoreRegions()),
    floating: persistRegions(checkSettings.getFloatingRegions()),
    strict: persistRegions(checkSettings.getStrictRegions()),
    layout: persistRegions(checkSettings.getLayoutRegions()),
    content: persistRegions(checkSettings.getContentRegions()),
    accessibility: persistRegions(checkSettings.getAccessibilityRegions()),
    target: !checkSettings._targetRegion && !checkSettings._targetElement ? 'window' : 'region',
    fully: TypeUtils.getOrDefault(
      checkSettings.getStitchContent(),
      configuration.getForceFullPageScreenshot(),
    ),
    tag: checkSettings.getName(),
    scriptHooks: checkSettings.getScriptHooks(),
    sendDom: TypeUtils.getOrDefault(checkSettings.getSendDom(), configuration.getSendDom()),
    matchLevel: TypeUtils.getOrDefault(
      checkSettings.getMatchLevel(),
      configuration.getMatchLevel(),
    ),
    visualGridOptions: checkSettings._visualGridOptions,
  }

  if (config.target === 'region') {
    const type = checkSettings._targetRegion ? 'region' : 'selector'
    config[type] = checkSettings.getTargetProvider().toPersistedRegions(elementIdsMap)[0]
  }

  return config

  function persistRegions(regions = []) {
    return regions.reduce(
      (persisted, region) => persisted.concat(region.toPersistedRegions(elementIdsMap)),
      [],
    )
  }
}

module.exports = {
  getAllRegionElements,
  toCheckWindowConfiguration,
}
