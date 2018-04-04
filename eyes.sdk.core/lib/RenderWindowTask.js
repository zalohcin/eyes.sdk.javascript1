'use strict';

const { ArgumentGuard } = require('./ArgumentGuard');
const { GeneralUtils } = require('./utils/GeneralUtils');
const { RenderStatus } = require('./renderer/RenderStatus');

const RETRY_REQUEST_INTERVAL = 500; // Milliseconds

class RenderWindowTask {
  /**
   * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
   * @param {Logger} logger A logger instance.
   * @param {ServerConnector} serverConnector Our gateway to the agent
   */
  constructor(promiseFactory, logger, serverConnector) {
    ArgumentGuard.notNull(promiseFactory, 'promiseFactory');
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(serverConnector, 'serverConnector');

    this._promiseFactory = promiseFactory;
    this._logger = logger;
    this._serverConnector = serverConnector;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {RenderRequest} renderRequest
   * @return {Promise.<String>} Rendered image URL
   */
  renderWindow(renderRequest) {
    const that = this;
    return that.postRender(renderRequest)
      .then(runningRender => that.getRenderStatus(runningRender))
      .then(renderStatus => renderStatus.getImageLocation());
  }

  /**
   * @param {RenderRequest} renderRequest
   * @param {RunningRender} [runningRender]
   * @return {Promise.<RunningRender>}
   */
  postRender(renderRequest, runningRender) {
    const that = this;
    return that._serverConnector.render(renderRequest, runningRender)
      .then(newRender => {
        if (newRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
          return that.putResources(renderRequest.getDom(), newRender)
            .then(() => that.postRender(renderRequest, newRender));
        }

        return newRender;
      });
  }

  /**
   * @param {RunningRender} runningRender
   * @return {Promise.<RenderStatusResults>}
   */
  getRenderStatus(runningRender) {
    const that = this;
    return that._serverConnector.renderStatus(runningRender)
      .catch(() => GeneralUtils.sleep(RETRY_REQUEST_INTERVAL, that._promiseFactory)
        .then(() => that.getRenderStatus(runningRender)))
      .then(renderStatusResults => {
        if (renderStatusResults.getStatus() === RenderStatus.RENDERING) {
          return GeneralUtils.sleep(RETRY_REQUEST_INTERVAL, that._promiseFactory)
            .then(() => that.getRenderStatus(runningRender));
        } else if (renderStatusResults.getStatus() === RenderStatus.ERROR) {
          return that._promiseFactory.reject(renderStatusResults.getError());
        }

        return renderStatusResults;
      });
  }

  /**
   * @param {RGridDom} rGridDom
   * @param {RunningRender} runningRender
   * @return {Promise.<RunningRender>}
   */
  putResources(rGridDom, runningRender) {
    const that = this;
    const promises = [];

    if (runningRender.getNeedMoreDom()) {
      promises.push(that._serverConnector.renderPutResource(runningRender, rGridDom.asResource()));
    }

    if (runningRender.getNeedMoreResources()) {
      rGridDom.getResources().forEach(resource => {
        if (runningRender.getNeedMoreResources().includes(resource.getUrl())) {
          promises.push(that._serverConnector.renderPutResource(runningRender, resource));
        }
      });
    }

    return that._promiseFactory.all(promises);
  }
}

exports.RenderWindowTask = RenderWindowTask;
