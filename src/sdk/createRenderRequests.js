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

      return new RenderRequest(
        renderInfo.getResultsUrl(),
        url,
        rGridDom,
        RenderInfo.fromObject({width, height, sizeMode, selector, region, emulationInfo}),
        'Linux',
        name,
        scriptHooks,
      );
    },
  );
}

module.exports = createRenderRequests;
