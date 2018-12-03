'use strict';

const {createRenderWrapper} = require('./wrapperUtils');

function getRenderMethods({renderWrapper, apiKey, logger, serverUrl, proxy}) {
  renderWrapper =
    renderWrapper ||
    createRenderWrapper({
      apiKey,
      logHandler: logger.getLogHandler(),
      serverUrl,
      proxy,
    });
  const doGetRenderInfo = renderWrapper.getRenderInfo.bind(renderWrapper);
  const doRenderBatch = renderWrapper.renderBatch.bind(renderWrapper);
  const doPutResource = renderWrapper.putResource.bind(renderWrapper);
  const doGetRenderStatus = renderWrapper.getRenderStatus.bind(renderWrapper);
  const setRenderingInfo = renderWrapper.setRenderingInfo.bind(renderWrapper);
  return {doGetRenderInfo, doRenderBatch, doPutResource, doGetRenderStatus, setRenderingInfo};
}

module.exports = getRenderMethods;
