'use strict'

const {
  getProcessPageAndSerializePoll,
  getPoll,
  getProcessPageAndSerializePollForIE,
  getPollForIE,
} = require('@applitools/dom-snapshot')
const ArgumentGuard = require('./ArgumentGuard')
const EyesUtils = require('../sdk/EyesUtils')
const deserializeDomSnapshotResult = require('./deserializeDomSnapshotResult')
const createFramesPaths = require('./createFramesPaths')

const EXECUTION_TIMEOUT = 5 * 60 * 1000
const POLL_TIMEOUT = 200

async function takeDomSnapshot(logger, driver, options = {}) {
  ArgumentGuard.notNull(logger, 'logger')
  ArgumentGuard.notNull(driver, 'driver')
  const {
    disableBrowserFetching,
    pollTimeout = POLL_TIMEOUT,
    executionTimeout = EXECUTION_TIMEOUT,
  } = options
  const scripts = {
    main: {args: [{disableBrowserFetching}]},
    poll: {args: [{disableBrowserFetching}]},
  }
  if (driver.isIE || driver.isEdgeLegacy) {
    scripts.main.script = `${await getProcessPageAndSerializePollForIE()} return __processPageAndSerializePollForIE(document, arguments[0]);`
    scripts.poll.script = `${await getPollForIE()} return __pollForIE(null, arguments);`
  } else {
    scripts.main.script = `${await getProcessPageAndSerializePoll()} return __processPageAndSerializePoll(document, arguments[0]);`
    scripts.poll.script = `${await getPoll()} return __poll.apply(null, arguments);`
  }

  const snapshot = await takeContextDomSnapshot(driver.currentContext)
  return deserializeDomSnapshotResult(snapshot)

  async function takeContextDomSnapshot(context) {
    const snapshot = await EyesUtils.executePollScript(logger, context, scripts, {
      executionTimeout,
      pollTimeout,
    })

    const selectorMap = createFramesPaths(snapshot)

    for (const {path, parentSnapshot} of selectorMap) {
      const references = path.reduce((parent, selector) => {
        return {reference: {type: 'xpath', selector}, parent}
      }, null)

      const frameContext = await context.context(references)
      const contextSnapshot = await takeContextDomSnapshot(frameContext)
      parentSnapshot.frames.push(contextSnapshot)
    }

    return snapshot
  }
}

module.exports = takeDomSnapshot
