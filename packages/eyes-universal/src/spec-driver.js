const {TypeUtils} = require('@applitools/eyes-sdk-core')

// #region HELPERS

const DRIVER_ID = 'applitools-driver'
const ELEMENT_ID = 'applitools-element'

// #endregion

// #region UTILITY

const utility = {
  isDriver(driver) {
    return Boolean(driver) && Boolean(driver[DRIVER_ID])
  },
  isElement(element) {
    return Boolean(element) && Boolean(element[ELEMENT_ID])
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['type', 'selector'])
  },
  extractSelector(element) {
    return element.selector
  },
  isStaleElementError(error) {
    // error
  },
}

// #endregion

// #region COMMANDS

const commands = {
  isEqualElements: ws => (context, element1, element2) => {
    return ws.request('Driver.isEqualElements', {context, element1, element2})
  },
  executeScript: ws => (context, script, ...args) => {
    return ws.request('Driver.executeScript', {context, script, args})
  },
  mainContext: ws => context => {
    return ws.request('Driver.mainContext', {context})
  },
  parentContext: async ws => context => {
    return ws.request('Driver.parentContext', {context})
  },
  childContext: ws => (context, element) => {
    return ws.request('Driver.childContext', {context, element})
  },
  findElement: ws => (context, selector) => {
    return ws.request('Driver.findElement', {context, selector})
  },
  findElements: ws => (context, selector) => {
    return ws.request('Driver.findElements', {context, selector})
  },
  getWindowRect: ws => driver => {
    return ws.request('Driver.getWindowRect', {driver})
  },
  setWindowRect: ws => (driver, rect) => {
    return ws.request('Driver.setWindowRect', {driver, rect})
  },
  getViewportSize: ws => driver => {
    return ws.request('Driver.getViewportSize', {driver})
  },
  setViewportSize: ws => (driver, size) => {
    return ws.request('Driver.setViewportSize', {driver, size})
  },
  getOrientation: ws => driver => {
    return ws.request('Driver.getOrientation', {driver})
  },
  getTitle: ws => driver => {
    return ws.request('Driver.getTitle', {driver})
  },
  getUrl: ws => driver => {
    return ws.request('Driver.getUrl', {driver})
  },
  getDriverInfo: ws => driver => {
    return ws.request('Driver.getDriverInfo', {driver})
  },
  takeScreenshot: ws => driver => {
    return ws.request('Driver.takeScreenshot', {driver})
  },
}

// #endregion

function makeSpecDriver(ws, {supportedCommands}) {
  return {
    ...utility,
    ...supportedCommands.reduce((supported, name) => {
      return Object.assign(supported, {[name]: commands[name](ws)})
    }, {}),
  }
}

module.exports = makeSpecDriver
