'use strict'

const crypto = require('crypto')
const ArgumentGuard = require('../utils/ArgumentGuard')
const GeneralUtils = require('../utils/GeneralUtils')
const RGridResource = require('./RGridResource')

class RGridDom {
  /**
   * @param data
   * @param {object} [data.domNodes]
   * @param {RGridResource[]} [data.resources]
   */
  constructor({domNodes, resources} = {}) {
    this._domNodes = domNodes
    this._resources = resources || []

    /** @type {string} */
    this._sha256hash = undefined
    /** @type {string} */
    this._contentAsCdt = undefined
  }

  /**
   * @return {object} - The domNodes of the current page.
   */
  getDomNodes() {
    return this._domNodes
  }

  /**
   * @param {object} value - The page's domNodes
   */
  setDomNodes(value) {
    ArgumentGuard.notNull(value, 'domNodes')
    this._domNodes = value
  }

  /**
   * @return {RGridResource[]} - The resourceType of the current page
   */
  getResources() {
    return this._resources
  }

  /**
   * @param {RGridResource[]} value - The page's resourceType
   */
  setResources(value) {
    ArgumentGuard.notNull(value, 'resources')
    this._resources = value
  }

  asResource() {
    const res = new RGridResource()
    res.setContent(this._getContentAsCdt())
    res.setContentType('x-applitools-html/cdt')
    return res
  }

  getSha256Hash() {
    if (!this._sha256hash) {
      this._sha256hash = crypto
        .createHash('sha256')
        .update(this._getContentAsCdt())
        .digest('hex')
    }

    return this._sha256hash
  }

  getHashAsObject() {
    return {
      hashFormat: 'sha256',
      hash: this.getSha256Hash(),
    }
  }

  _getContentAsCdt() {
    if (!this._contentAsCdt) {
      const resources = {}

      this._resources.forEach(resource => {
        resources[resource.getUrl()] = resource.getHashAsObject()
      })

      this._contentAsCdt = JSON.stringify({
        resources,
        domNodes: this._domNodes,
      })
    }

    return this._contentAsCdt
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_contentAsCdt', '_sha256hash'])
  }

  /**
   * @override
   */
  toString() {
    return `RGridDom { ${JSON.stringify(this)} }`
  }
}

module.exports = RGridDom
