'use strict';

const ArgumentGuard = require('../ArgumentGuard');
const GeneralUtils = require('../GeneralUtils');
const RenderStatus = require('./RenderStatus');
const RenderRequest = require('./RenderRequest');

const GET_STATUS_INTERVAL = 500; // Milliseconds

class RenderWindowTask {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger A logger instance.
     * @param {ServerConnector} serverConnector Our gateway to the agent
     */
    constructor(promiseFactory, logger, serverConnector) {
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(serverConnector, "serverConnector");

        this._promiseFactory = promiseFactory;
        this._logger = logger;
        this._serverConnector = serverConnector;
    }

    /**
     * @param {String} webhook
     * @param {RGridDom} rGridDom
     * @param {number} renderWidth
     * @return {Promise.<String>} Rendered image URL
     */
    renderWindow(webhook, rGridDom, renderWidth) {
        const renderRequest = new RenderRequest(webhook, rGridDom, renderWidth);

        const that = this;
        return that._postRender(rGridDom, renderRequest).then(runningRender => {
            return that._getRenderStatus(runningRender);
        }).then(/** RenderStatusResults */ renderStatus => {
            return renderStatus.getImageLocation();
        });
    }

    /**
     * @private
     * @param {RunningRender} runningRender
     * @return {Promise.<RenderStatusResults>}
     */
    _getRenderStatus(runningRender) {
        const that = this;
        return that._serverConnector.renderStatus(runningRender).then(renderStatusResults => {

            if (renderStatusResults.getStatus() === RenderStatus.RENDERING) {
                return GeneralUtils.sleep(GET_STATUS_INTERVAL, that._promiseFactory).then(() => {
                    return that._getRenderStatus(runningRender);
                });
            } else if (renderStatusResults.getStatus() === RenderStatus.ERROR) {
                return that._promiseFactory.reject(renderStatusResults.getError());
            }

            return renderStatusResults;
        }).catch(err => {
            return GeneralUtils.sleep(GET_STATUS_INTERVAL, that._promiseFactory).then(() => {
                return that._getRenderStatus(runningRender);
            });
        });
    }

    /**
     * @private
     * @param {RGridDom} rGridDom
     * @param {RenderRequest} renderRequest
     * @param {RunningRender} [runningRender]
     * @return {Promise.<RunningRender>}
     */
    _postRender(rGridDom, renderRequest, runningRender) {
        const that = this;
        return that._serverConnector.render(renderRequest, runningRender).then(runningRender => {

            if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
                return that._putResources(rGridDom, renderRequest, runningRender);
            }

            return runningRender;
        });
    }

    /**
     * @private
     * @param {RGridDom} rGridDom
     * @param {RenderRequest} renderRequest
     * @param {RunningRender} [runningRender]
     * @return {Promise.<RunningRender>}
     */
    _putResources(rGridDom, renderRequest, runningRender) {
        const that = this;
        return that._promiseFactory.resolve().then(() => {
            if (runningRender.getNeedMoreDom()) {
                return that._serverConnector.renderPutResource(runningRender, rGridDom.asResource());
            }
        }).then(() => {
            if (runningRender.getNeedMoreResources()) {
                const promises = [];
                for (const resource of rGridDom.getResources()) {
                    if (runningRender.getNeedMoreResources().includes(resource.getUrl())) {
                        promises.push(that._serverConnector.renderPutResource(runningRender, resource));
                    }
                }
                return that._promiseFactory.all(promises);
            }
        }).then(() => {
            return that._postRender(rGridDom, renderRequest, runningRender);
        });
    }
}

module.exports = RenderWindowTask;
