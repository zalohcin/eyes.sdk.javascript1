'use strict'
const fs = require('fs')
const path = require('path')

function fakeDriver({
  sessionId = 'fake session id',
  capabilities = {},
  url = 'fake url',
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
  screenshotFileName = 'software_development.png',
} = {}) {
  return {
    getSession,
    getCapabilities,
    findElement,
    switchTo,
    getCurrentUrl,
    executeScript,
    takeScreenshot,
  }

  async function getSession() {
    return {
      getId() {
        return sessionId
      },
    }
  }

  async function getCapabilities() {
    return {
      get(name) {
        return capabilities[name]
      },
    }
  }

  function findElement(locator) {
    const el = {
      getId() {
        return locator
      },
    }
    const p = Promise.resolve(el)
    Object.assign(p, el)
    return p
  }

  function switchTo() {
    return {
      async defaultContent() {},
    }
  }

  async function getCurrentUrl() {
    return url
  }

  async function executeScript(script, ..._args) {
    // TODO use vm.runInContext with mocked window
    if (script === 'return window.devicePixelRatio') {
      return 1
    } else if (
      script ===
      'var width = Math.max(arguments[0].clientWidth, arguments[0].scrollWidth);' +
        'var height = Math.max(arguments[0].clientHeight, arguments[0].scrollHeight);' +
        'return [width, height];'
    ) {
      // entire size
      return [1200, 800]
    } else if (script.indexOf('__captureDomAndPoll()') > -1) {
      return `{"separator":"-----","cssStartToken":"#####","cssEndToken":"#####","iframeStartToken":"\\\\"@@@@@","iframeEndToken":"@@@@@\\\\""}\n-----\n-----\n{}`
    } else if (script === 'return navigator.userAgent;') {
      return userAgent
    }
    return ''
  }

  async function takeScreenshot() {
    return fs
      .readFileSync(path.resolve(__dirname, '../fixtures', screenshotFileName))
      .toString('base64')
  }
}

module.exports = {fakeDriver}
