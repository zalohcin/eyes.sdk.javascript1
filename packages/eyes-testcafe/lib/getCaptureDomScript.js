'use strict'

const {BrowserNames, UserAgent} = require('@applitools/eyes-common')
const captureFrameAndPoll = require('../dist/captureFrameAndPoll')
const captureFrameAndPollForIE = require('../dist/captureFrameAndPollForIE')

async function getCaptureDomScript({webDriver, logger}) {
  const userAgent = await webDriver.getUserAgent()
  const isIE = UserAgent.parseUserAgentString(userAgent).getBrowser() === BrowserNames.IE
  logger.log(`using ${isIE ? 'IE' : 'standard'} Dom capture`)
  return !isIE ? captureFrameAndPoll : captureFrameAndPollForIE
}

module.exports = getCaptureDomScript
