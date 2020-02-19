'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {EyesRunner} = require('./EyesRunner')

class ClassicRunner extends EyesRunner {
  constructor() {
    super()
    this._getRenderingInfo = undefined
  }

  makeGetRenderingInfo(getRenderingInfo) {
    if (!this._getRenderingInfo) {
      this._getRenderingInfo = GeneralUtils.cachify(getRenderingInfo)
    }
  }

  async getRenderingInfoWithCache() {
    if (this._getRenderingInfo) {
      return this._getRenderingInfo()
    } else {
      throw new Error(
        'Eyes runner could not get rendering info since makeGetRenderingInfo was not called before',
      )
    }
  }
}

exports.ClassicRunner = ClassicRunner
