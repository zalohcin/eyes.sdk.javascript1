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
   * @param {string} [browserName]
   */
  constructor(webhook, url, dom, renderInfo, browserName) {
    ArgumentGuard.notNullOrEmpty(webhook, 'webhook');
    ArgumentGuard.notNull(url, 'url');
    ArgumentGuard.notNull(dom, 'dom');

    this._webhook = webhook;
    this._url = url;
    this._dom = dom;
    this._renderInfo = renderInfo;
    this._browserName = browserName;
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

  /** @override */
  toJSON() {
    const resources = {};
    this._dom.getResources().forEach(resource => {
      resources[resource.getUrl()] = resource.getHashAsObject();
    });

    return {
      webhook: this._webhook,
      url: this._url,

      renderInfo: this._renderInfo.toJSON(),
      browser: {
        name: this._browserName,
      },

      dom: this._dom.getHashAsObject(),
      resources,
    };
  }

  /** @override */
  toString() {
    return `RenderRequest { ${JSON.stringify(this)} }`;
  }
}

exports.RenderRequest = RenderRequest;
