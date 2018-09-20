'use strict';

const {RenderRequest, RenderInfo} = require('@applitools/eyes.sdk.core');
const createRGridDom = require('./createRGridDom');
const createEmulationInfo = require('./createEmulationInfo');

function createRenderRequests({
  url,
  resources,
  cdt,
  browsers,
  renderInfo,
  sizeMode,
  selector,
  region,
  scriptHooks,
  ignore,
}) {
  const rGridDom = createRGridDom({resources, cdt});

  return browsers.map(
    ({width, height, name, deviceName, screenOrientation, deviceScaleFactor, mobile}) => {
      const emulationInfo = createEmulationInfo({
        deviceName,
        screenOrientation,
        deviceScaleFactor,
        mobile,
        width,
        height,
      });

      let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined;
      const ignoreBySelector = ignore
        ? [].concat(ignore).filter(ignoreRegion => ignoreRegion.selector)
        : undefined;

      if (ignoreBySelector && ignoreBySelector.length) {
        selectorsToFindRegionsFor = (selectorsToFindRegionsFor || []).concat(
          ignoreBySelector.map(({selector}) => selector),
        );
      }

      return new RenderRequest(
        renderInfo.getResultsUrl(),
        url,
        rGridDom,
        RenderInfo.fromObject({width, height, sizeMode, selector, region, emulationInfo}),
        'Linux',
        name,
        scriptHooks,
        selectorsToFindRegionsFor,
      );
    },
  );
}

module.exports = createRenderRequests;
