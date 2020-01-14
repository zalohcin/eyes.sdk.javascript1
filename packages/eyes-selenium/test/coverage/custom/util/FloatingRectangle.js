'use strict'
const Rectangle = require('./Rectangle')

class FloatingRectangle extends Rectangle {
  constructor(left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super(left, top, width, height)
    this.maxUpOffset = maxUpOffset
    this.maxDownOffset = maxDownOffset
    this.maxLeftOffset = maxLeftOffset
    this.maxRightOffset = maxRightOffset
  }
}

module.exports = FloatingRectangle
