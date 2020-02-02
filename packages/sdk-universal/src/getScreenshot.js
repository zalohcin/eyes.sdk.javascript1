'use strict'

function makeGetScreenshot({toggleScrollbars, takeScreenshot, toggleCaret}) {
  return async function getScreenshot() {
    return require('fs').readFileSync(require('path').resolve(__dirname, '_tmp/screenshot.png'))
  }
}

module.exports = makeGetScreenshot
