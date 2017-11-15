'use strict';

const axios = require('axios');

const ProxySettings = require('./ProxySettings');
const RunningSession = require('./RunningSession');
const TestResults = require('./TestResults');
const MatchResult = require('./MatchResult');
const GeneralUtils = require('../GeneralUtils');
const ArgumentGuard = require('../ArgumentGuard');

// Constants
const DEFAULT_TIMEOUT_MS = 300000; // 5 min
const API_PATH = '/api/sessions/running';
const LONG_REQUEST_DELAY_MS = 2000; // ms
const MAX_LONG_REQUEST_DELAY_MS = 10000; // ms
const LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR = 1.5;
const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const HTTP_STATUS_CODES = {
    CREATED: 201,
    ACCEPTED: 202,
    OK: 200,
    GONE: 410
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
        this._timeout = DEFAULT_TIMEOUT_MS;

        this._httpOptions = {
            proxy: null,
            headers: DEFAULT_HEADERS,
            timeout: DEFAULT_TIMEOUT_MS,
            responseType: 'json',
            params: {}
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

        this._httpOptions.params.apiKey = apiKey;
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

        this._httpOptions.proxy = this._proxySettings.toProxyObject();
    }

    /**
     * @return {ProxySettings} The current proxy settings, or {@code null} if no proxy is set.
     */
    getProxy() {
        return this._proxySettings;
    }

    /**
     * Whether sessions are removed immediately after they are finished.
     *
     * @param shouldRemove {Boolean}
     */
    setRemoveSession(shouldRemove) {
        this._httpOptions.params.removeSession = shouldRemove;
    }

    /**
     * @return {Boolean} Whether sessions are removed immediately after they are finished.
     */
    getRemoveSession() {
        return !!this._httpOptions.params.removeSession;
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
     * @return {Promise.<RunningSession>} RunningSession object which represents the current running session
     */
    startSession(sessionStartInfo) {
        ArgumentGuard.notNull(sessionStartInfo, "sessionStartInfo");
        this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`);

        const that = this;
        const uri = this._endPoint;
        const options = {data: {startInfo: sessionStartInfo}};

        return sendRequest(that, 'startSession', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.startSession - post succeeded');

                const runningSession = new RunningSession();
                Object.assign(runningSession, response.data);
                runningSession.setNewSession(response.status === HTTP_STATUS_CODES.CREATED);
                return runningSession;
            }

            throw new Error(`ServerConnector.startSession - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Stops the running session.
     *
     * @param {RunningSession} runningSession The running session to be stopped.
     * @param {Boolean} isAborted
     * @param {Boolean} save
     * @return {Promise.<TestResults>} TestResults object for the stopped running session
     */
    stopSession(runningSession, isAborted, save) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        this._logger.verbose(`ServerConnector.stopSession called with isAborted: ${isAborted}, save: ${save} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId());
        const options = {
            params: {
                aborted: isAborted,
                updateBaseline: save
            }
        };

        return sendLongRequest(that, 'stopSession', uri, 'delete', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.stopSession - post succeeded');

                const testResults = new TestResults();
                Object.assign(testResults, response.data);
                return testResults;
            }

            throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Matches the current window (held by the WebDriver) to the expected window.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise.<MatchResult>} The results of the window matching.
     */
    matchWindow(runningSession, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");
        this._logger.verbose(`ServerConnector.matchWindow called with ${matchWindowData} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId());
        const options = {
            contentType: 'application/octet-stream',
            data: Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()])
        };

        return sendLongRequest(that, 'matchWindow', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.matchWindow - post succeeded');

                const matchResult = new MatchResult();
                Object.assign(matchResult, response.data);
                return matchResult;
            }

            throw new Error(`ServerConnector.matchWindow - unexpected status (${response.statusText})`);
        });
    }

    //noinspection JSValidateJSDoc
    /**
     * Replaces an actual image in the current running session.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {Number} stepIndex The zero based index of the step in which to replace the actual image.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise.<MatchResult>} The results of the window matching.
     */
    replaceWindow(runningSession, stepIndex, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");
        this._logger.verbose(`ServerConnector.replaceWindow called with ${matchWindowData} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._endPoint, runningSession.getId() + '/' + stepIndex);
        const options = {
            contentType: 'application/octet-stream',
            body: Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()])
        };

        return sendLongRequest(that, 'replaceWindow', uri, 'put', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.replaceWindow - post succeeded');

                const matchResult = new MatchResult();
                Object.assign(matchResult, response.data);
                return matchResult;
            }

            throw new Error(`ServerConnector.replaceWindow - unexpected status (${response.statusText})`);
        });
    }
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {String} method
 * @param {Object} options
 * @return {Promise.<AxiosResponse>}
 */
function sendLongRequest(that, name, uri, method, options = {}) {
    const headers = {
        'Eyes-Expect': '202+location',
        'Eyes-Date': GeneralUtils.getRfc1123Date()
    };

    options.headers = options.headers ? Object.assign(options.headers, headers) : headers;
    return sendRequest(that, name, uri, method, options).then(response => {
        return longRequestCheckStatus(that, name, response);
    });
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {AxiosResponse} response
 * @return {Promise.<AxiosResponse>}
 */
function longRequestCheckStatus(that, name, response) {
    switch (response.status) {
        case HTTP_STATUS_CODES.OK:
            return that._promiseFactory.resolve(response);
        case HTTP_STATUS_CODES.ACCEPTED:
            const uri = response.headers['location'];
            return longRequestLoop(that, name, uri, LONG_REQUEST_DELAY_MS).then(response => {
                return longRequestCheckStatus(that, name, response);
            });
        case HTTP_STATUS_CODES.CREATED:
            const deleteUri = response.headers['location'];
            const options = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}};
            return sendRequest(that, name, deleteUri, 'delete', options);
        case HTTP_STATUS_CODES.GONE:
            return that._promiseFactory.reject(new Error('The server task has gone.'));
        default:
            return that._promiseFactory.reject(new Error(`Unknown error processing long request: ${JSON.stringify(response)}`));
    }
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {int} delay
 * @return {Promise.<AxiosResponse>}
 */
function longRequestLoop(that, name, uri, delay) {
    delay = Math.min(MAX_LONG_REQUEST_DELAY_MS, Math.floor(delay * LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR));
    that._logger.verbose(`${name}: Still running... Retrying in ${delay} ms`);

    return GeneralUtils.sleep(delay, that._promiseFactory).then(() => {
        const options = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}};
        return sendRequest(that, name, uri, 'get', options);
    }).then(response => {
        if (response.status !== HTTP_STATUS_CODES.OK) {
            return response;
        }

        return longRequestLoop(that, name, uri, delay);
    });
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} url
 * @param {String} method
 * @param {Object} options
 * @return {Promise.<AxiosResponse>}
 */
function sendRequest(that, name, url, method, options = {}) {
    const request = GeneralUtils.clone(that._httpOptions);
    request.url = url;
    request.method = method;
    if (options.params) { request.params = Object.assign(request.params, options.params); }
    if (options.headers) { request.headers = Object.assign(request.headers, options.headers); }
    if (options.data) { request.data = options.data; }
    if (options.contentType) { request.headers['Content-Type'] = options.contentType; }

    that._logger.verbose(`ServerConnector.${name} will now post call to: ${request.url}`);
    // noinspection JSUnresolvedFunction
    return axios(request).then(function(response) {
        that._logger.verbose(`ServerConnector.${name} - result ${response.statusText}, status code ${response.status}`);
        return response;
    }).catch(error => {
        that._logger.log(`ServerConnector.${name} - post failed: ${error.response.statusText}`);
        throw error;
    });
}

/**
 * Creates a bytes representation of the given JSON.
 *
 * @private
 * @param {Object} jsonData The data from for which to create the bytes representation.
 * @return {Buffer} a buffer of bytes which represents the stringified JSON, prefixed with size.
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
