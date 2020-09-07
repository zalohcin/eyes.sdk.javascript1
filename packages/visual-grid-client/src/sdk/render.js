'use strict'

const {RenderStatus} = require('@applitools/eyes-sdk-core')
const toCacheEntry = require('./toCacheEntry')
const resourceType = require('./resourceType')

function makeRenderBatch({
  putResources,
  resourceCache,
  fetchCache,
  logger,
  doRenderBatch,
  renderTimeout = 300,
}) {
  let pendingRequests = new Map()

  let timeout
  return function(renderRequest) {
    return new Promise(async (resolve, reject) => {
      clearTimeout(timeout)
      pendingRequests.set(renderRequest, {resolve, reject})
      timeout = setTimeout(() => {
        renderBatchJob(pendingRequests)
        pendingRequests = new Map()
      }, renderTimeout)
    })
  }

  async function renderBatchJob(pendingRequests) {
    try {
      const renderRequests = Array.from(pendingRequests.keys())
      const runningRenders = await doRenderBatch(renderRequests)

      await Promise.all(
        runningRenders.map(async (runningRender, index) => {
          const renderRequest = renderRequests[index]
          if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
            renderRequest.setRenderId(runningRender.getRenderId())
            await putResources(renderRequest.getDom(), runningRender, renderRequest.getResources())
          }
          for (const resource of renderRequest.getResources()) {
            logger.verbose('setting resource to cache: ', resource.getUrl())
            const url = resource.getUrl()
            fetchCache.remove(url)
            const doesRequireProcessing = Boolean(resourceType(resource.getContentType()))
            resourceCache.setValue(url, toCacheEntry(resource, doesRequireProcessing))
          }
        }),
      )

      const renderRequests2 = runningRenders.reduce((acc, runningRender, index) => {
        const {resolve} = pendingRequests.get(renderRequests[index])
        if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
          acc.push(renderRequests[index])
        } else {
          resolve(runningRender.getRenderId())
        }
        return acc
      }, [])

      if (renderRequests2.length > 0) {
        const runningRenders2 = await doRenderBatch(renderRequests2)
        runningRenders2.forEach((runningRender, index) => {
          const {resolve, reject} = pendingRequests.get(renderRequests2[index])
          if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
            logger.log('unexpectedly got "need more resources" on second render request')
            reject(new Error('Unexpected error while taking screenshot'))
          } else {
            resolve(runningRender.getRenderId())
          }
        })
      }
    } catch (err) {
      pendingRequests.forEach(({reject}) => reject(err))
    }
  }
}

module.exports = makeRenderBatch
