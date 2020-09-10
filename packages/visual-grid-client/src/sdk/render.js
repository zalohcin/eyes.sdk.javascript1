'use strict'

const {RenderStatus} = require('@applitools/eyes-sdk-core')

function makeRender({logger, doRenderBatch, timeout = 300}) {
  let pendingRequests = new Map()

  let debounceTimer
  return function(renderRequest) {
    return new Promise(async (resolve, reject) => {
      clearTimeout(debounceTimer)
      pendingRequests.set(renderRequest, {resolve, reject})
      debounceTimer = setTimeout(() => {
        renderBatchJob(pendingRequests)
        pendingRequests = new Map()
      }, timeout)
    })
  }

  async function renderBatchJob(pendingRequests) {
    try {
      const renderRequests = Array.from(pendingRequests.keys())
      const runningRenders = await doRenderBatch(renderRequests)

      runningRenders.forEach((runningRender, index) => {
        const {resolve, reject} = pendingRequests.get(renderRequests[index])
        if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
          logger.log('unexpectedly got "need more resources" on second render request')
          reject(new Error('Unexpected error while taking screenshot'))
        } else {
          resolve(runningRender.getRenderId())
        }
      })
    } catch (err) {
      pendingRequests.forEach(({reject}) => reject(err))
    }
  }
}

module.exports = makeRender
