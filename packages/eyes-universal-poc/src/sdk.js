const makeServer = require('@applitools/eyes-universal')
const makeAPI = require('./api')
const makeRefer = require('./refer')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')

function makeSDK() {
  makeServer(({port}) => ws.open(`ws://localhost:${port}`))
  const ws = makeSocket()
  const refer = makeRefer()
  const spec = makeSpec(refer)

  ws.emit('Session.init', {commands: Object.keys(spec)})

  ws.command('Driver.isEqualElements', ({context, element1, element2}) => {
    return spec.isEqualElements(context, element1, element2)
  })
  ws.command('Driver.executeScript', ({context, script, args}) => {
    return spec.executeScript(context, script, ...args)
  })
  ws.command('Driver.mainContext', ({context}) => {
    return spec.mainContext(context)
  })
  ws.command('Driver.parentContext', ({context}) => {
    return spec.parentContext(context)
  })
  ws.command('Driver.childContext', ({context, element}) => {
    return spec.mainContext(context, element)
  })
  ws.command('Driver.findElement', ({context, selector}) => {
    return spec.findElement(context, selector)
  })
  ws.command('Driver.findElements', ({context, selector}) => {
    return spec.findElements(context, selector)
  })
  ws.command('Driver.getViewportSize', ({driver}) => {
    return spec.getViewportSize(driver)
  })
  ws.command('Driver.setViewportSize', ({driver, size}) => {
    return spec.setViewportSize(driver, size)
  })
  ws.command('Driver.getTitle', ({driver}) => {
    return spec.getTitle(driver)
  })
  ws.command('Driver.getUrl', ({driver}) => {
    return spec.getUrl(driver)
  })
  ws.command('Driver.getDriverInfo', ({driver}) => {
    return spec.getDriverInfo(driver)
  })
  ws.command('Driver.takeScreenshot', async ({driver}) => {
    const img = await spec.takeScreenshot(driver)
    return img
  })

  async function openEyes(driver, config) {
    const eyes = await ws.request('Eyes.open', {driver: refer.ref(driver), config})

    return {check, close, abort}

    function check(checkSettings) {
      return ws.request('Eyes.check', {eyes, checkSettings})
    }
    function close() {
      return ws.request('Eyes.close', {eyes})
    }
    function abort() {
      return ws.request('Eyes.abort', {eyes})
    }
  }

  return makeAPI({...spec, openEyes})
}

module.exports = makeSDK
