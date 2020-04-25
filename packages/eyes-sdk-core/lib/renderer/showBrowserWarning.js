'use strict'
const {BrowserType} = require('@applitools/eyes-common')
const chalk = require('chalk')

function showBrowserWarning(browsersInfo) {
  if (browsersInfo.some(({name}) => name === BrowserType.EDGE)) {
    console.log(
      chalk.yellow(
        `The 'EDGE' option that is being used in your browsers' configuration will soon be deprecated. Please change it to either "EDGE_LEGACY" for the legacy version or to "EDGE_CHROMIUM" for the new Chromium-based version.`,
      ),
    )
  }
}

exports.showBrowserWarning = showBrowserWarning
