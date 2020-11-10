const makeAPI = require('@applitools/eyes-api')
const socket = require('./ws/socket')
const spec = require('./spec-driver')
const Storage = require('./storage')

function makeSDK(client) {
  const ws = socket(client)
  const refs = new Storage()

  ws.emit('Session.init', {commands: Object.keys(spec)})

  ws.command('Driver.isEqualElements', async ({context, element1, element2}) => {
    return spec.isEqualElements(refs.deref(context), refs.deref(element1), refs.deref(element2))
  })

  ws.command('Driver.executeScript', async ({context, script, args}) => {
    const result = await spec.executeScript(refs.deref(context), script, ...args)

    return serialize(result)

    function serialize(value) {
      if (value.constructor.name === 'ElementHandle') {
        return refs.ref(value, context)
      } else if (Array.isArray(value)) {
        return value.map(serialize)
      } else if (typeof value === 'object' && value !== null) {
        return Object.entries(value).reduce(
          (json, [key, value]) => Object.assign(json, {[key]: serialize(value)}),
          {},
        )
      } else {
        return value
      }
    }
  })

  ws.command('Driver.mainContext', async ({context}) => {
    const mainContext = await spec.mainContext(refs.deref(context))
    return refs.ref(mainContext, context)
  })

  ws.command('Driver.parentContext', async ({context}) => {
    const parentContext = await spec.parentContext(refs.deref(context))
    return refs.ref(parentContext, context)
  })

  ws.command('Driver.childContext', async ({context, element}) => {
    const childContext = await spec.mainContext(refs.deref(context), refs.deref(element))
    return refs.ref(childContext, context)
  })

  ws.command('Driver.findElement', async ({context, selector}) => {
    const element = await spec.findElement(refs.deref(context), selector)
    return element ? refs.ref(element, context) : null
  })

  ws.command('Driver.findElements', async ({context, selector}) => {
    const elements = await spec.findElements(refs.deref(context), selector)
    return elements.map(element => refs.ref(element, context))
  })

  ws.command('Driver.getViewportSize', async ({driver}) => {
    return spec.getViewportSize(refs.deref(driver))
  })

  ws.command('Driver.setViewportSize', async ({driver, size}) => {
    return spec.setViewportSize(refs.deref(driver), size)
  })

  ws.command('Driver.getTitle', async ({driver}) => {
    return spec.getTitle(refs.deref(driver))
  })

  ws.command('Driver.getUrl', async ({driver}) => {
    return spec.getUrl(refs.deref(driver))
  })

  ws.command('Driver.takeScreenshot', async ({driver}) => {
    return spec.takeScreenshot(refs.deref(driver))
  })

  async function openEyes(driver, config) {
    const driverId = refs.ref(driver)
    const eyesId = await ws.request('Eyes.open', {driverId, config})

    return {check, close, abort}

    function check(checkSettings) {
      return ws.request('Eyes.check', {eyesId, checkSettings})
    }

    function close() {
      return ws.request('Eyes.close', {eyesId})
    }

    function abort() {
      return ws.request('Eyes.abort', {eyesId})
    }
  }

  return makeAPI({openEyes})
}

module.exports = makeSDK
