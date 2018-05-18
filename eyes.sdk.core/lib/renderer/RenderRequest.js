'use strict';

const { ArgumentGuard } = require('../ArgumentGuard');

/**
 * Encapsulates data required to start render using the RenderingGrid API.
 */
class RenderRequest {
  /**
   * @param {string} webhook
   * @param {string} url
   * @param {RGridDom} dom
   * @param {RenderInfo} [renderInfo]
   * @param {string} [platform]
   * @param {string} [browserName]
   */
  constructor(webhook, url, dom, renderInfo, platform, browserName) {
    ArgumentGuard.notNullOrEmpty(webhook, 'webhook');
    ArgumentGuard.notNull(url, 'url');
    ArgumentGuard.notNull(dom, 'dom');

    this._webhook = webhook;
    this._url = url;
    this._dom = dom;
    this._renderInfo = renderInfo;
    this._platform = platform;
    this._browserName = browserName;
    this._renderId = undefined;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {string} */
  getWebhook() {
    return this._webhook;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {string} */
  getUrl() {
    return this._url;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {RGridDom} */
  getDom() {
    return this._dom;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {RGridResource[]} */
  getResources() {
    return this._dom.getResources();
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {RenderInfo} */
  getRenderInfo() {
    return this._renderInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {string} */
  getBrowserName() {
    return this._browserName;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {string} */
  getRenderId() {
    return this._renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {string} value */
  setRenderId(value) {
    this._renderId = value;
  }

  /** @override */
  toJSON() {
    const resources = {};
    this._dom.getResources().forEach(resource => {
      resources[resource.getUrl()] = resource.getHashAsObject();
    });

    const object = {
      webhook: this._webhook,
      url: this._url,
      dom: this._dom.getHashAsObject(),
      resources,
    };

    if (this._renderId) {
      object.renderId = this._renderId;
    }

    if (this._browserName) {
      object.browser = {
        name: this._browserName,
      };

      if (this._platform) {
        object.browser.platform = this._platform;
      }
    }

    if (this._renderInfo) {
      object.renderInfo = this._renderInfo.toJSON();
    }

    return object;
  }

  /** @override */
  toString() {
    return `RenderRequest { ${JSON.stringify(this)} }`;
  }
}

exports.RenderRequest = RenderRequest;
