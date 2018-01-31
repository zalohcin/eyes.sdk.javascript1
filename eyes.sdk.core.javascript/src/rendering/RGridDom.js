const crypto = require('crypto');

const ArgumentGuard = require('../ArgumentGuard');
const RGridResource = require('./RGridResource');

class RGridDom {

    constructor() {
        this._url = null;
        this._domNodes = null;
        this._resources = null;

        this._sha256hash = null;
        this._asString = null;
    }

    /**
     * @return {String} The url of the current page
     */
    getUrl() {
        return this._url;
    }

    /**
     * @param {String} value The page's url
     */
    setUrl(value) {
        ArgumentGuard.notNull(value, "url");
        this._url = value;
    }

    /**
     * @return {Object} The domNodes of the current page.
     */
    getDomNodes() {
        return this._domNodes;
    }

    /**
     * @param {Object} value The page's domNodes
     */
    setDomNodes(value) {
        ArgumentGuard.notNull(value, "domNodes");
        this._domNodes = value;
    }

    /**
     * @return {RGridResource[]} The resourceType of the current page
     */
    getResources() {
        return this._resources;
    }

    /**
     * @param {RGridResource[]} value The page's resourceType
     */
    setResources(value) {
        ArgumentGuard.notNull(value, "resources");
        this._resources = value;
    }

    asResource() {
        const res = new RGridResource();
        res.setUrl(this.getUrl());
        res.setContent(this.asString());
        res.setContentType('x-applitools-html/cdt');
        return res;
    }

    asString() {
        if (!this._asString) {
            const resources = {};
            for (const resource of this._resources) {
                resources[resource.getUrl()] = resource.getHashAsObject()
            }

            this._asString = JSON.stringify({
                url: this._url,
                resources: resources,
                domNodes: this._domNodes,
            });
        }

        return this._asString;
    }

    getSha256Hash() {
        if (!this._sha256hash) {
            this._sha256hash = this._computeHash();
        }

        return this._sha256hash;
    }

    _computeHash() {
        return crypto.createHash('sha256')
            .update(this.asString())
            .digest('hex');
    }

    getHashAsObject() {
        return {
            hashFormat: "sha256",
            hash: this.getSha256Hash()
        };
    }
}

module.exports = RGridDom;
