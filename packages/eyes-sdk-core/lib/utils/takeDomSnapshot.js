'use strict'

const {
  getProcessPageAndSerializePoll,
  getProcessPageAndSerializePollForIE,
} = require('@applitools/dom-snapshot')
const GeneralUtils = require('./GeneralUtils')
const deserializeDomSnapshotResult = require('./deserializeDomSnapshotResult')
const createFramesPaths = require('./createFramesPaths')

const PULL_TIMEOUT = 200 // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000 // 5 min

let scriptBody

async function getScript() {
  if (!scriptBody) {
    scriptBody = await getProcessPageAndSerializePoll()
  }
  return `${scriptBody} return __processPageAndSerializePoll(document, arguments[0]);`
}

async function getScriptForIE() {
  if (!scriptBody) {
    scriptBody = await getProcessPageAndSerializePollForIE()
  }
  return `${scriptBody} return __processPageAndSerializePollForIE(document, arguments[0]);`
}

async function takeDomSnapshot({logger, driver, startTime = Date.now(), disableBrowserFetching}) {
  const {browserName, browserVersion} = driver
  const isIE = browserName === 'internet explorer'
  const isEdgeLegacy = browserName.toLowerCase().includes('edge') && browserVersion <= 44
  const processPageAndPollScript = isIE || isEdgeLegacy ? await getScriptForIE() : await getScript()

  async function getCrossOriginFrames(context, selectorMap) {
    for (const {path, parentSnapshot} of selectorMap) {
      const references = path.reduce((parent, selector) => {
        return {reference: {type: 'css', selector}, parent}
      }, null)
      try {
        const frameContext = await context.context(references)
        const contextSnapshot = await _takeDomSnapshot(frameContext)
        parentSnapshot.frames.push(contextSnapshot)
      } catch (error) {
        const pathMap = selectorMap.map(({path}) => path.join('->')).join(' | ')
        logger.verbose(
          `could not switch to frame during takeDomSnapshot. Path to frame: ${pathMap}`,
        )
      }
    }
  }

  async function _takeDomSnapshot(context) {
    logger.verbose(
      `taking dom snapshot. ${
        context._reference ? `context referece: ${JSON.stringify(context._reference)}` : ''
      }`,
    )
    const resultAsString = await context.execute(processPageAndPollScript, {
      dontFetchResources: disableBrowserFetching,
    })
    let scriptResponse
    try {
      scriptResponse = JSON.parse(resultAsString)
    } catch (ex) {
      const firstChars = resultAsString.substr(0, 100)
      const lastChars = resultAsString.substr(-100)
      throw new Error(
        `dom snapshot is not a valid JSON string. response length: ${resultAsString.length}, first 100 chars: "${firstChars}", last 100 chars: "${lastChars}". error: ${ex}`,
      )
    }

    if (scriptResponse.status === 'SUCCESS') {
      const selectorMap = createFramesPaths({snapshot: scriptResponse.value, logger})
      await getCrossOriginFrames(context, selectorMap)
      return scriptResponse.value
    } else if (scriptResponse.status === 'ERROR') {
      throw new Error(`Unable to process dom snapshot: ${scriptResponse.error}`)
    } else if (Date.now() - startTime >= CAPTURE_DOM_TIMEOUT_MS) {
      throw new Error('Timeout is reached.')
    }

    await GeneralUtils.sleep(PULL_TIMEOUT)
    return _takeDomSnapshot(context)
  }

  const snapshot = await _takeDomSnapshot(driver.currentContext)
  return deserializeDomSnapshotResult(snapshot)
}

module.exports = takeDomSnapshot
