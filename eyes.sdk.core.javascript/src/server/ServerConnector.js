'use strict';

const request = require('request');

const ProxySettings = require('./ProxySettings');
const RunningSession = require('./RunningSession');
const TestResults = require('./TestResults');
const MatchResult = require('./MatchResult');
const GeneralUtils = require('../GeneralUtils');
const ArgumentGuard = require('../ArgumentGuard');

// Constants
// noinspection MagicNumberJS
const TIMEOUT = 5 * 60 * 1000;
const API_PATH = '/api/sessions/running';
const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

/**
 * Provides an API for communication with the Applitools server.
 */
class ServerConnector {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger
     * @param {String} serverUrl
     **/
    constructor(promiseFactory, logger, serverUrl) {
        this._promiseFactory = promiseFactory;
        this._logger = logger;
        this.setServerUrl(serverUrl);

        this._apiKey = null;
        this._proxySettings = null;
        this._timeout = TIMEOUT;

        this._httpOptions = {
            proxy: null,
            strictSSL: false,
            headers: DEFAULT_HEADERS,
            timeout: TIMEOUT,
            qs: {}
        };
    }

    /**
     * Sets the current server URL used by the rest client.
     *
     * @param serverUrl {String} The URI of the rest server.
     */
    setServerUrl(serverUrl) {
        this._serverUrl = serverUrl;
        this._endPoint = GeneralUtils.urlConcat(serverUrl, API_PATH);
    }

    /**
     * @return {String} The URI of the eyes server.
     */
    getServerUrl() {
        return this._serverUrl;
    }

    /**
     * Sets the API key of your applitools Eyes account.
     *
     * @param {String} apiKey The api key to set.
     */
    setApiKey(apiKey) {
        ArgumentGuard.notNull(apiKey, "apiKey");
        this._apiKey = apiKey;

        this._httpOptions.qs.apiKey = apiKey;
    }

    /**
     *
     * @return {String} The currently set API key or {@code null} if no key is set.
     */
    getApiKey() {
        return this._apiKey;
    }

    /**
     * Sets the proxy settings to be used by the rest client.
     *
     * @param {ProxySettings|String} arg1 The proxy setting or url to be used. If {@code null} then no proxy is set.
     * @param {String} [username]
     * @param {String} [password]
     */
    setProxy(arg1, username, password) {
        if (arg1 instanceof ProxySettings) {
            this._proxySettings = arg1;
        } else {
            this._proxySettings = new ProxySettings(arg1, username, password);
        }

        this._httpOptions.proxy = this._proxySettings.toProxyString();
    }

    /**
     * @return {ProxySettings} The current proxy settings used by the request component, or {@code null} if no proxy is set.
     */
    getProxy() {
        return this._proxySettings;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Activate/Deactivate HTTP client debugging.
     *
     * @param {Boolean} isDebug Whether or not to activate debugging.
     */
    setDebugMode(isDebug) {
        request.debug = isDebug;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @return {Boolean} Whether or not debug mode is active.
     */
    getIsDebugMode() {
        return request.debug;
    }

    /**
     * Whether sessions are removed immediately after they are finished.
     *
     * @param shouldRemove {Boolean}
     */
    setRemoveSession(shouldRemove) {
        this._httpOptions.qs.removeSession = shouldRemove;
    }

    /**
     * @return {Boolean} Whether sessions are removed immediately after they are finished.
     */
    getRemoveSession() {
        return !!this._httpOptions.qs.removeSession;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets the connect and read timeouts for web requests.
     *
     * @param {int} timeout Connect/Read timeout in milliseconds. 0 equals infinity.
     */
    setTimeout(timeout) {
        ArgumentGuard.greaterThanOrEqualToZero(timeout, "timeout");
        this._timeout = timeout;

        this._httpOptions.timeout = this._timeout;
    }

    /**
     *
     * @return {int} The timeout for web requests (in seconds).
     */
    getTimeout() {
        return this._timeout;
    }

    /**
     * Starts a new running session in the agent. Based on the given parameters,
     * this running session will either be linked to an existing session, or to
     * a completely new session.
     *
     * @param {SessionStartInfo} sessionStartInfo The start parameters for the session.
     * @return {Promise<RunningSession>} RunningSession object which represents the current running session
     */
    startSession(sessionStartInfo) {
        ArgumentGuard.notNull(sessionStartInfo, "sessionStartInfo");

        this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`);

        const options = GeneralUtils.clone(this._httpOptions);
        options.uri = this._endPoint;
        options.body = {startInfo: sessionStartInfo};
        options.json = true;
        options.method = "post";

        this._logger.verbose('ServerConnector.startSession will now post call');

        const that = this;
        return this._promiseFactory.makePromise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    that._logger.log('ServerConnector.startSession - post failed');
                    return reject(new Error(err));
                }

                that._logger.verbose('ServerConnector.startSession - result', body, 'status code ', response.statusCode);

                // noinspection MagicNumberJS
                const validStatusCodes = [200, 201];
                if (validStatusCodes.includes(response.statusCode)) {
                    that._logger.verbose('ServerConnector.startSession - post succeeded');

                    const runningSession = new RunningSession();
                    Object.assign(runningSession, body);
                    // noinspection MagicNumberJS
                    runningSession.setNewSession(response.statusCode === 201);
                    return resolve(runningSession);
                }

                return reject(new Error(`ServerConnector.startSession - unexpected status (${responseToString(response)})`));
            });
        });
    }

    /**
     * Stops the running session.
     *
     * @param {RunningSession} runningSession The running session to be stopped.
     * @param {Boolean} isAborted
     * @param {Boolean} save
     * @return {Promise<TestResults>} TestResults object for the stopped running session
     */
    stopSession(runningSession, isAborted, save) {
        ArgumentGuard.notNull(runningSession, "runningSession");

        this._logger.verbose(`ServerConnector.stopSession called with isAborted: ${isAborted}, save: ${save} for session: ${runningSession}`);

        const options = GeneralUtils.clone(this._httpOptions);
        options.uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId());
        options.qs.aborted = isAborted;
        options.qs.updateBaseline = save;
        options.headers["Eyes-Expect"] = "202-accepted";
        options.headers["Eyes-Date"] = GeneralUtils.getRfc1123Date(new Date());
        options.json = true;
        options.method = 'delete';

        this._logger.verbose(`ServerConnector.stopSession will now post call to: ${options.uri}`);

        const that = this;
        // noinspection MagicNumberJS
        return sendLongRequest(this._promiseFactory, this._logger, options, 2000, "stopSession").then(result => {
            // noinspection MagicNumberJS
            const validStatusCodes = [200];
            if (validStatusCodes.includes(result.response.statusCode)) {
                that._logger.verbose('ServerConnector.stopSession - post succeeded');

                const testResults = new TestResults();
                Object.assign(testResults, result.body);
                return testResults;
            }

            throw new Error(`ServerConnector.stopSession - unexpected status (${responseToString(result.response)})`);
        });
    }

    /**
     * Matches the current window (held by the WebDriver) to the expected window.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise<MatchResult>} The results of the window matching.
     */
    matchWindow(runningSession, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");

        this._logger.verbose(`ServerConnector.matchWindow called with ${matchWindowData} for session: ${runningSession}`);

        const options = GeneralUtils.clone(this._httpOptions);
        options.headers['Content-Type'] = 'application/octet-stream';
        options.uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId());
        options.body = Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()]);
        options.method = "post";

        this._logger.verbose(`ServerConnector.matchWindow will now post call to: ${options.uri}`);

        const that = this;
        return this._promiseFactory.makePromise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    that._logger.log('ServerConnector.matchWindow - post failed');
                    return reject(new Error(err));
                }

                that._logger.verbose('ServerConnector.matchWindow - result', body, 'status code ', response.statusCode);

                // noinspection MagicNumberJS
                const validStatusCodes = [200];
                if (validStatusCodes.includes(response.statusCode)) {
                    body = JSON.parse(body); // we need to do it manually, because our content-type is not json
                    that._logger.verbose('ServerConnector.matchWindow - post succeeded');

                    const matchResult = new MatchResult();
                    Object.assign(matchResult, body);
                    return resolve(matchResult);
                }

                return reject(new Error(`ServerConnector.matchWindow - unexpected status (${responseToString(response)})`));
            });
        });
    }

    //noinspection JSValidateJSDoc
    /**
     * Replaces an actual image in the current running session.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {Number} stepIndex The zero based index of the step in which to replace the actual image.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise<MatchResult>} The results of the window matching.
     */
    replaceWindow(runningSession, stepIndex, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");

        this._logger.verbose(`ServerConnector.replaceWindow called with ${matchWindowData} for session: ${runningSession}`);

        const options = GeneralUtils.clone(this._httpOptions);
        options.headers['Content-Type'] = 'application/octet-stream';
        options.uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId() + '/' + stepIndex);
        options.body = Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()]);
        options.method = "put";

        this._logger.verbose(`ServerConnector.replaceWindow will now post call to: ${options.uri}`);

        const that = this;
        return this._promiseFactory.makePromise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    that._logger.log('ServerConnector.replaceWindow - post failed');
                    return reject(new Error(err));
                }

                that._logger.verbose('ServerConnector.replaceWindow - result', body, 'status code ', response.statusCode);

                // noinspection MagicNumberJS
                const validStatusCodes = [200];
                if (validStatusCodes.includes(response.statusCode)) {
                    body = JSON.parse(body); // we need to do it manually, because our content-type is not json
                    that._logger.verbose('ServerConnector.replaceWindow - post succeeded');

                    const matchResult = new MatchResult();
                    Object.assign(matchResult, body);
                    return resolve(matchResult);
                }

                return reject(new Error(`ServerConnector.replaceWindow - unexpected status (${responseToString(response)})`));
            });
        });
    }
}

/**
 * @param {PromiseFactory} promiseFactory
 * @param {Logger} logger
 * @param {Object} options
 * @param {int} delay
 * @param {String} name
 * @return {Promise<{response: *, body: *}>}
 */
function sendLongRequest(promiseFactory, logger, options, delay, name) {
    return promiseFactory.makePromise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                logger.log(`ServerConnector.${name} - post failed`);
                return reject(new Error(err));
            }

            logger.verbose(`ServerConnector.${name} - result`, body, 'status code ', response.statusCode);
            // noinspection MagicNumberJS
            if (response.statusCode !== 202) {
                return resolve({response: response, body: body});
            }

            // Waiting a delay
            logger.verbose(`${name}: Still running... Retrying in ${delay} ms`);

            return GeneralUtils.sleep(delay, promiseFactory).then(() => {
                // increasing the delay
                // noinspection MagicNumberJS
                delay = Math.min(10000, Math.floor(delay * 1.5));
                return sendLongRequest(promiseFactory, logger, options, delay, name);
            }).then(body => {
                return resolve(body);
            });
        });
    });
}

/**
 * @private
 * @param response
 * @return {string}
 */
function responseToString(response) {
    return `statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`;
}

/**
 * Creates a bytes representation of the given JSON.
 * @param {Object} jsonData The data from for which to create the bytes representation.
 * @return {Buffer} a buffer of bytes which represents the stringified JSON, prefixed with size.
 * @private
 */
function createDataBytes(jsonData) {
    const dataStr = JSON.stringify(jsonData);
    const dataLen = Buffer.byteLength(dataStr, 'utf8');
    // The result buffer will contain the length of the data + 4 bytes of size
    const result = new Buffer(dataLen + 4);
    result.writeUInt32BE(dataLen, 0);
    result.write(dataStr, 4, dataLen);
    return result;
}

module.exports = ServerConnector;
