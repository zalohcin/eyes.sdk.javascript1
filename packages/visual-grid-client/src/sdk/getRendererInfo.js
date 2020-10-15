'use strict'
function makeGetRendererInfo({doGetRendererInfo, timeout = 100}) {
  let pendingRequests = new Map()

  let throttleTimer = false
  return function(renderRequest) {
    return new Promise((resolve, reject) => {
      pendingRequests.set(renderRequest, {resolve, reject})
      if (throttleTimer) {
        throttleTimer = true
        setTimeout(() => {
          getRendererInfoJob(pendingRequests)
          pendingRequests = new Map()
          throttleTimer = false
        }, timeout)
      }
    })
  }

  async function getRendererInfoJob(pendingRequests) {
    try {
      const renderRequests = Array.from(pendingRequests.keys())
      const rendererInfos = await doGetRendererInfo(renderRequests)
      rendererInfos.forEach((rendererInfo, index) => {
        const {resolve} = pendingRequests.get(renderRequests[index])
        resolve(rendererInfo)
      })
    } catch (err) {
      pendingRequests.forEach(({reject}) => reject(err))
    }
  }
}

module.exports = makeGetRendererInfo
