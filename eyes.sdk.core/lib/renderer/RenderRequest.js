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
   * @param {number} [renderWidth]
   * @param {string} [browserName]
   */
  constructor(webhook, url, dom, renderWidth, browserName) {
    ArgumentGuard.notNullOrEmpty(webhook, 'webhook');
    ArgumentGuard.notNull(url, 'url');
    ArgumentGuard.notNull(dom, 'dom');

    this._webhook = webhook;
    this._url = url;
    this._dom = dom;
    this._renderWidth = renderWidth;
    this._browserName = browserName;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {String} */
  getWebhook() {
    return this._webhook;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {String} */
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
  /** @return {number} */
  getRenderWidth() {
    return this._renderWidth;
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

      renderWidth: this._renderWidth,
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
