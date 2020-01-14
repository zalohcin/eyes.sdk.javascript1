'use strict'
const Rectangle = require('./Rectangle')
class AccessibilityRectangle extends Rectangle {
  constructor(left, top, width, height, isDisabled, type) {
    super(left, top, width, height)
    this.isDisabled = isDisabled
    this.type = type
  }
}

module.exports = AccessibilityRectangle
