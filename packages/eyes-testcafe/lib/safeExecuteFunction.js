'use strict'

const {makeClientFunctionWrapper} = require('./makeClientFunctionWrapper')
const hash = require('./hash')

// TODO
// This should be used for running functions with saving their compiled Testcafe data
// Alos this handles the Testcafe return value size limitation
// Use this function for Dom Capture (or remove it..)

function makeSafeExecuteFunction(driver) {
  const functionsCache = {}
  const clientFunctionWrapper = makeClientFunctionWrapper({})

  return async func => {
    const funcId = hash(func.toString())
    let wrappedFunc
    if (!functionsCache[funcId]) {
      functionsCache[funcId] = await clientFunctionWrapper(func)
      wrappedFunc = functionsCache[funcId]
    } else {
      wrappedFunc = functionsCache[funcId]
    }
    return wrappedFunc(driver)
  }
}

module.exports = makeSafeExecuteFunction
