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
const TIMEOUT = 5 * 60 * 1000; // ms
const API_PATH = '/api/sessions/running';
const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const LONG_REQUEST_DELAY = 2000; // ms
const MAX_LONG_REQUEST_DELAY = 10000; // ms
const LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR = 1.5;

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
     * @return {Promise.<RunningSession>} RunningSession object which represents the current running session
     */
    startSession(sessionStartInfo) {
        ArgumentGuard.notNull(sessionStartInfo, "sessionStartInfo");
        this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`);

        const that = this;
        const uri = this._endPoint;
        const options = {
            body: JSON.stringify({startInfo: sessionStartInfo})
        };

        return sendRequest(that, 'startSession', uri, 'post', options).then(results => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
            if (validStatusCodes.includes(results.status)) {
                that._logger.verbose('ServerConnector.startSession - post succeeded');

                const runningSession = new RunningSession();
                Object.assign(runningSession, results.body);
                runningSession.setNewSession(results.status === HTTP_STATUS_CODES.CREATED);
                return runningSession;
            }

            throw new Error(`ServerConnector.startSession - unexpected status (${results.response})`);
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
            query: {
                aborted: isAborted,
                updateBaseline: save
            }
        };

        return sendLongRequest(that, 'stopSession', uri, 'delete', options).then(results => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(results.status)) {
                that._logger.verbose('ServerConnector.stopSession - post succeeded');

                const testResults = new TestResults();
                Object.assign(testResults, results.body);
                return testResults;
            }

            throw new Error(`ServerConnector.stopSession - unexpected status (${results.response})`);
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
            body: Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()])
        };

        return sendLongRequest(that, 'matchWindow', uri, 'post', options).then(results => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(results.status)) {
                that._logger.verbose('ServerConnector.matchWindow - post succeeded');

                const matchResult = new MatchResult();
                Object.assign(matchResult, results.body);
                return matchResult;
            }

            throw new Error(`ServerConnector.matchWindow - unexpected status (${results.response})`);
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

        return sendLongRequest(that, 'replaceWindow', uri, 'put', options).then(results => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(results.status)) {
                that._logger.verbose('ServerConnector.replaceWindow - post succeeded');

                const matchResult = new MatchResult();
                Object.assign(matchResult, results.body);
                return matchResult;
            }

            throw new Error(`ServerConnector.replaceWindow - unexpected status (${results.response})`);
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
 * @return {Promise.<{status: int, body: Object, response: {statusCode: int, statusMessage: String, headers: Object}}>}
 */
function sendLongRequest(that, name, uri, method, options = {}) {
    const headers = {
        'Eyes-Expect': '202+location',
        'Eyes-Date': GeneralUtils.getRfc1123Date()
    };

    options.headers = options.headers ? Object.assign(options.headers, headers) : headers;
    return sendRequest(that, name, uri, method, options).then(results => {
        return longRequestCheckStatus(that, name, results);
    });
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {{status: int, body: Object, response: {statusCode: int, statusMessage: String, headers: Object}}} results
 * @return {Promise.<{status: int, body: Object, response: {statusCode: int, statusMessage: String, headers: Object}}>}
 */
function longRequestCheckStatus(that, name, results) {
    switch (results.status) {
        case HTTP_STATUS_CODES.OK:
            return that._promiseFactory.resolve(results);
        case HTTP_STATUS_CODES.ACCEPTED:
            const uri = results.response.headers['location'];
            return longRequestLoop(that, name, uri, LONG_REQUEST_DELAY).then(results => {
                return longRequestCheckStatus(that, name, results);
            });
        case HTTP_STATUS_CODES.CREATED:
            const deleteUri = results.response.headers['location'];
            const options = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}};
            return sendRequest(that, name, deleteUri, 'delete', options);
        case HTTP_STATUS_CODES.GONE:
            return that._promiseFactory.reject(new Error('The server task has gone.'));
        default:
            return that._promiseFactory.reject(new Error('Unknown error processing long request'));
    }
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {int} delay
 * @return {Promise.<{status: int, body: Object, response: {statusCode: int, statusMessage: String, headers: Object}}>}
 */
function longRequestLoop(that, name, uri, delay) {
    delay = Math.min(MAX_LONG_REQUEST_DELAY, Math.floor(delay * LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR));
    that._logger.verbose(`${name}: Still running... Retrying in ${delay} ms`);

    return GeneralUtils.sleep(delay, that._promiseFactory).then(() => {
        const options = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}};
        return sendRequest(that, name, uri, 'get', options);
    }).then(result => {
        if (result.status !== HTTP_STATUS_CODES.OK) return result;
        return longRequestLoop(that, name, uri, delay);
    });
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {String} method
 * @param {Object} options
 * @return {Promise.<{status: int, body: Object, response: {statusCode: int, statusMessage: String, headers: Object}}>}
 */
function sendRequest(that, name, uri, method, options = {}) {
    const req = GeneralUtils.clone(that._httpOptions);
    req.uri = uri;
    req.method = method;
    if (options.query) req.qs = Object.assign(req.qs, options.query);
    if (options.headers) req.headers = Object.assign(req.headers, options.headers);
    if (options.body) req.body = options.body;
    if (options.contentType) req.headers['Content-Type'] = options.contentType;

    return that._promiseFactory.makePromise((resolve, reject) => {
        that._logger.verbose(`ServerConnector.${name} will now post call to: ${req.uri}`);
        request(req, (err, response, body) => {
            if (err) {
                that._logger.log(`ServerConnector.${name} - post failed`);
                return reject(new Error(err));
            }

            that._logger.verbose(`ServerConnector.${name} - result ${body}, status code ${response.statusCode}`);
            return resolve({
                status: response.statusCode,
                body: body ? JSON.parse(body) : null,
                response: {
                    statusCode: response.statusCode,
                    statusMessage: response.statusMessage,
                    headers: response.headers
                }
            });
        });
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
