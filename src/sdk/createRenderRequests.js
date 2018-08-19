'use strict';

const {RenderRequest, RenderInfo} = require('@applitools/eyes.sdk.core');
const createRGridDom = require('./createRGridDom');

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
    ({width, height, name}) =>
      new RenderRequest(
        renderInfo.getResultsUrl(),
        url,
        rGridDom,
        RenderInfo.fromObject({width, height, sizeMode, selector, region}),
        'Linux',
        name,
        scriptHooks,
      ),
  );
}

module.exports = createRenderRequests;
