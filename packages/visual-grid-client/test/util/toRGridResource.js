'use strict';
const {RGridResource} = require('@applitools/eyes-sdk-core');

function toRGridResource({url, type, value}) {
  const resource = new RGridResource();
  resource.setUrl(url);
  resource.setContentType(type);
  resource.setContent(value);
  return resource;
}

module.exports = toRGridResource;
