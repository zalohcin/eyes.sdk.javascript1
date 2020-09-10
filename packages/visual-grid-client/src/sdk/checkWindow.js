'use strict'

const {Region} = require('@applitools/eyes-sdk-core')
const {presult} = require('@applitools/functional-commons')
const saveData = require('../troubleshoot/saveData')
const createRenderRequest = require('./createRenderRequest')
const createCheckSettings = require('./createCheckSettings')
const calculateMatchRegions = require('./calculateMatchRegions')
const isInvalidAccessibility = require('./isInvalidAccessibility')

function makeCheckWindow({
  globalState,
  testController,
  saveDebugData,
  createRGridDOMAndGetResourceMapping,
  putResources,
  render,
  waitForRenderedStatus,
  renderInfo,
  logger,
  getCheckWindowPromises,
  setCheckWindowPromises,
  browsers,
  wrappers,
  renderThroat,
  stepCounter,
  testName,
  openEyesPromises,
  userAgent,
  matchLevel: _matchLevel,
  getUserAgents,
  visualGridOptions: _visualGridOptions,
}) {
  return function checkWindow({
    snapshot,
    url,
    tag,
    target = 'window',
    fully = true,
    sizeMode = 'full-page',
    selector,
    region,
    scriptHooks,
    ignore,
    floating,
    accessibility,
    sendDom = true,
    matchLevel = _matchLevel,
    layout,
    strict,
    content,
    useDom,
    enablePatterns,
    ignoreDisplacements,
    visualGridOptions = _visualGridOptions,
  }) {
    const snapshots = Array.isArray(snapshot) ? snapshot : Array(browsers.length).fill(snapshot)

    if (target === 'window' && !fully) {
      sizeMode = 'viewport'
    } else if (target === 'region' && selector) {
      sizeMode = 'selector'
    } else if (target === 'region' && region) {
      sizeMode = 'region'
    }

    const accErr = isInvalidAccessibility(accessibility)
    if (accErr) {
      testController.setFatalError(`Invalid accessibility:\n${accErr}`)
      return
    }

    const currStepCount = ++stepCounter
    logger.log(`running checkWindow for test ${testName} step #${currStepCount}`)
    if (testController.shouldStopAllTests()) {
      logger.log('aborting checkWindow synchronously')
      return
    }

    if (typeof window === 'undefined') {
      const handleBrowserDebugData = require('../troubleshoot/handleBrowserDebugData')
      snapshots.forEach(snapshot => {
        handleBrowserDebugData({
          frame: snapshot,
          metaData: {agentId: wrappers[0].getBaseAgentId()},
          logger,
        })
      })
    }

    const renderRequestPromises = snapshots.map(async (snapshot, index) => {
      const {allResources, rGridDom} = await createRGridDOMAndGetResourceMapping({
        resourceUrls: snapshot.resourceUrls,
        resourceContents: snapshot.resourceContents,
        cdt: snapshot.cdt,
        frames: snapshot.frames,
        userAgent,
        referer: url,
        proxySettings: wrappers[0].getProxy(),
      })
      await putResources([rGridDom, ...Object.values(allResources)])
      return createRenderRequest({
        url,
        dom: rGridDom,
        resources: Object.values(allResources),
        browser: browsers[index],
        renderInfo,
        sizeMode,
        selector,
        region,
        scriptHooks,
        noOffsetSelectors: noOffsetSelectors.all,
        offsetSelectors: offsetSelectors.all,
        sendDom,
        visualGridOptions,
      })
    })

    const noOffsetSelectors = {
      all: [ignore, layout, strict, content, accessibility],
      ignore: 0,
      layout: 1,
      strict: 2,
      content: 3,
      accessibility: 4,
    }
    const offsetSelectors = {
      all: [floating],
      floating: 0,
    }

    setCheckWindowPromises(
      browsers.map((_browser, i) =>
        checkWindowJob(getCheckWindowPromises()[i], i).catch(testController.setError.bind(null, i)),
      ),
    )

    const renderJobs = new WeakMap()

    async function renderJob(renderRequest) {
      if (testController.shouldStopAllTests()) {
        logger.log(`aborting renderJob because there was an error in getAllResources`)
        return
      }

      globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() + 1)
      const renderId = await renderThroat(() => {
        logger.log(`starting to render test ${testName}`)
        return render(renderRequest)
      })
      const holder = new Promise(resolve => renderJobs.set(renderRequest, resolve))
      renderThroat(() => holder)
      globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() - 1)

      if (saveDebugData) {
        await saveData({
          renderId,
          resources: renderRequest.resources,
          url,
          logger,
        })
      }

      return renderId
    }

    async function checkWindowJob(prevJobPromise = presult(Promise.resolve()), index) {
      logger.verbose(
        `starting checkWindowJob. test=${testName} stepCount #${currStepCount} index=${index}`,
      )

      const wrapper = wrappers[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow - not waiting for render to complete (so no renderId yet)`)
        return
      }

      await openEyesPromises[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow after waiting for openEyes promise`)
        return
      }

      await wrapper.ensureRunningSession()

      const renderRequest = await renderRequestPromises[index]

      const [renderErr, renderId] = await presult(renderJob(renderRequest))

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow after render request complete but before waiting for rendered status`,
        )
        const userAgents = await getUserAgents()
        wrapper.setInferredEnvironment(`useragent:${userAgents[browsers[index].name]}`)
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      // render error fails all tests
      if (renderErr) {
        logger.log('got render error aborting tests', renderErr)
        const userAgents = await getUserAgents()
        wrapper.setInferredEnvironment(`useragent:${userAgents[browsers[index].name]}`)
        testController.setFatalError(renderErr)
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      testController.addRenderId(index, renderId)

      logger.verbose(
        `render request complete for ${renderId}. test=${testName} stepCount #${currStepCount} tag=${tag} target=${target} fully=${fully} region=${JSON.stringify(
          region,
        )} selector=${JSON.stringify(selector)} browser: ${JSON.stringify(browsers[index])}`,
      )

      const [renderStatusErr, renderStatusResult] = await presult(
        waitForRenderedStatus(renderId, testController.shouldStopTest.bind(null, index)),
      )

      if (testController.shouldStopTest(index)) {
        logger.log('aborting checkWindow after render status finished')
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      if (renderStatusErr) {
        logger.log('got render status error aborting tests')
        const userAgents = await getUserAgents()
        wrapper.setInferredEnvironment(`useragent:${userAgents[browsers[index].name]}`)
        testController.setFatalError(renderStatusErr)
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      const {
        imageLocation: screenshotUrl,
        domLocation,
        userAgent,
        deviceSize,
        selectorRegions,
      } = renderStatusResult

      if (screenshotUrl) {
        logger.verbose(`screenshot available for ${renderId} at ${screenshotUrl}`)
      } else {
        logger.log(`screenshot NOT available for ${renderId}`)
      }

      renderJobs.get(renderRequest)()

      wrapper.setInferredEnvironment(`useragent:${userAgent}`)
      if (deviceSize) {
        wrapper.setViewportSize(deviceSize)
      }

      logger.verbose(
        `checkWindow waiting for prev job. test=${testName}, stepCount #${currStepCount}`,
      )

      await prevJobPromise

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow for ${renderId} because there was an error in some previous job`,
        )
        return
      }

      const imageLocationRegion = sizeMode === 'selector' ? selectorRegions[0] : undefined

      let imageLocation = undefined
      if (sizeMode === 'selector' && imageLocationRegion) {
        imageLocation = new Region(imageLocationRegion).getLocation()
      } else if (sizeMode === 'region' && region) {
        imageLocation = new Region(region).getLocation()
      }

      const {noOffsetRegions, offsetRegions} = calculateMatchRegions({
        noOffsetSelectors: noOffsetSelectors.all,
        offsetSelectors: offsetSelectors.all,
        selectorRegions,
        imageLocationRegion,
      })

      const checkSettings = createCheckSettings({
        ignore: noOffsetRegions[noOffsetSelectors.ignore],
        floating: offsetRegions[offsetSelectors.floating],
        layout: noOffsetRegions[noOffsetSelectors.layout],
        strict: noOffsetRegions[noOffsetSelectors.strict],
        content: noOffsetRegions[noOffsetSelectors.content],
        accessibility: noOffsetRegions[noOffsetSelectors.accessibility],
        useDom,
        enablePatterns,
        ignoreDisplacements,
        renderId,
        matchLevel,
      })

      logger.verbose(
        `checkWindow waiting for openEyes. test=${testName}, stepCount #${currStepCount}`,
      )

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow after waiting for openEyes promise`)
        return
      }

      logger.verbose(`running wrapper.checkWindow for test ${testName} stepCount #${currStepCount}`)

      const checkArgs = {
        screenshotUrl,
        tag,
        domUrl: domLocation,
        checkSettings,
        imageLocation,
        url,
      }

      return wrapper.checkWindow(checkArgs)
    }
  }
}

module.exports = makeCheckWindow
