'use strict'

const GET_APP_DATA_SCRIPT =
  'return {url: window.location.href, userAgent: navigator.userAgent, title: document.title}'

function getAppData(driver) {
  return driver.executeScript(GET_APP_DATA_SCRIPT)
}

module.exports = getAppData
