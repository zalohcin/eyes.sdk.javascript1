'use strict'

function isCheckViewport(checkSettings) {
  return (
    !checkSettings.getTargetElement() &&
    !checkSettings.getTargetSelector() &&
    !checkSettings.getTargetRegion() &&
    !checkSettings.getStitchContent()
  )
}

module.exports = isCheckViewport
