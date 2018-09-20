'use strict';
const {EyesBase, NullRegionProvider} = require('@applitools/eyes.sdk.core');

const VERSION = require('../../package.json').version;

class EyesWrapper extends EyesBase {
  constructor({apiKey, logHandler} = {}) {
    super();
    this.setApiKey(apiKey);
    logHandler && this.setLogHandler(logHandler);
  }

  async open(appName, testName, viewportSize) {
    await super.openBase(appName, testName);

    if (viewportSize) {
      this.setViewportSize(viewportSize);
    }
  }

  /** @override */
  getBaseAgentId() {
    return `eyes.cypress/${VERSION}`; // TODO is this good? this class isn't called EyesCypressImpl anymore
  }

  /**
   * Get the AUT session id.
   *
   * @return {Promise<?String>}
   */
  getAUTSessionId() {
    return this.getPromiseFactory().resolve(undefined); // TODO is this good?
  }

  /**
   * Get a RenderingInfo from eyes server
   *
   * @return {Promise.<RenderingInfo>}
   */
  getRenderInfo() {
    return this._serverConnector.renderInfo();
  }

  setRenderingInfo(renderingInfo) {
    this._serverConnector.setRenderingAuthToken(renderingInfo.getAccessToken());
    this._serverConnector.setRenderingServerUrl(renderingInfo.getServiceUrl());
  }

  /**
   * Create a screenshot of a page on RenderingGrid server
   *
   * @param {RenderRequest[]} renderRequests The requests to be sent to the rendering grid
   * @return {Promise.<String[]>} The results of the render
   */
  renderBatch(renderRequests) {
    return this._serverConnector.render(renderRequests);
  }

  putResource(runningRender, resource) {
    return this._serverConnector.renderPutResource(runningRender, resource);
  }

  getRenderStatus(renderId) {
    return this._serverConnector.renderStatusById(renderId);
  }

  checkWindow({screenshotUrl, tag, domUrl, checkSettings, imageLocation}) {
    const regionProvider = new NullRegionProvider(this.getPromiseFactory()); // TODO receive from outside?
    this.screenshotUrl = screenshotUrl;
    this.domUrl = domUrl;
    this.imageLocation = imageLocation;
    return this.checkWindowBase(regionProvider, tag, false, checkSettings);
  }

  async getScreenshot() {
    return await undefined; // TODO will I ever need this?
  }

  async getScreenshotUrl() {
    return await this.screenshotUrl;
  }

  async getInferredEnvironment() {
    return this.inferredEnvironment;
  }

  setInferredEnvironment(value) {
    this.inferredEnvironment = value;
  }

  async setViewportSize(viewportSize) {
    this._viewportSizeHandler.set(viewportSize);
  }

  async getTitle() {
    return await 'some title'; // TODO what should this be? is it connected with the tag in `checkWindow` somehow?
  }

  async getDomUrl() {
    return await this.domUrl;
  }

  async getImageLocation() {
    return await this.imageLocation;
  }
}

module.exports = EyesWrapper;
