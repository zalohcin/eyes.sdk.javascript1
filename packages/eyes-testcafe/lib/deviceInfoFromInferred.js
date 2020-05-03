'use strict'

const REMOTE_SERVICE_PREFIX = ['saucelabs', 'browserstack']

function deviceInfoFromInferred(inferredDeviceInfo) {
  const deviceName =
    inferredDeviceInfo.match(/device=([^:;]+)/) && inferredDeviceInfo.match(/device=([^:;]+)/)[1]
  const isEmulation = /emulation/.test(inferredDeviceInfo)
  const isRemoteService = REMOTE_SERVICE_PREFIX.some(s =>
    inferredDeviceInfo.match(new RegExp(`^${s}:`)),
  )
  if (isEmulation) {
    return (deviceName && `${deviceName} (Chrome emulation)`) || 'Chrome emulation'
  } else if (!isRemoteService) {
    return 'Desktop'
  }
}

module.exports = deviceInfoFromInferred
