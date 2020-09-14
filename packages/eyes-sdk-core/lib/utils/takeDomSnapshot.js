'use strict'

const {
  getProcessPageAndSerializePoll,
  getProcessPageAndSerializePollForIE,
} = require('@applitools/dom-snapshot')
const GeneralUtils = require('./GeneralUtils')
const deserializeDomSnapshotResult = require('./deserializeDomSnapshotResult')

const PULL_TIMEOUT = 200 // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000 // 5 min

let scriptBody

async function getScript({disableBrowserFetching}) {
  if (!scriptBody) {
    scriptBody = await getProcessPageAndSerializePoll()
  }
  return `${scriptBody} return __processPageAndSerializePoll(document, {dontFetchResources: ${disableBrowserFetching}});`
}

async function getScriptForIE({disableBrowserFetching}) {
  if (!scriptBody) {
    scriptBody = await getProcessPageAndSerializePollForIE()
  }
  return `${scriptBody} return __processPageAndSerializePollForIE(document, {dontFetchResources: ${disableBrowserFetching}});`
}

async function takeDomSnapshot({driver, startTime = Date.now(), browser, disableBrowserFetching}) {
  async function getCrossOriginFrames(driver, snapshot) {
    const {crossFramesXPaths} = snapshot
    if (crossFramesXPaths.length > 0) {
      for (const xpath of crossFramesXPaths) {
        const crossFrameSnapshot = await takeFrameSnapshot(driver, xpath)
        snapshot.frames.push(crossFrameSnapshot)
      }
    }
    delete snapshot.crossFramesXPaths
  }

  async function takeFrameSnapshot(driver, xpath) {
    const element = await driver.element({type: 'xpath', selector: xpath})
    await driver.switchToChildContext(element)
    const snapshot = await _takeDomSnapshot({driver})
    await driver.switchToParentContext()
    return snapshot
  }

  async function _takeDomSnapshot() {
    const processPageAndPollScript =
      browser === 'IE'
        ? await getScriptForIE({disableBrowserFetching})
        : await getScript({disableBrowserFetching})

    const resultAsString = await driver.execute(processPageAndPollScript)
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
      await getCrossOriginFrames(driver, scriptResponse.value)
      return scriptResponse.value
    } else if (scriptResponse.status === 'ERROR') {
      throw new Error(`Unable to process dom snapshot: ${scriptResponse.error}`)
    } else if (Date.now() - startTime >= CAPTURE_DOM_TIMEOUT_MS) {
      throw new Error('Timeout is reached.')
    }

    await GeneralUtils.sleep(PULL_TIMEOUT)
    return _takeDomSnapshot({driver, startTime})
  }

  const snapshot = await _takeDomSnapshot()
  return deserializeDomSnapshotResult(snapshot)
}

module.exports = takeDomSnapshot
