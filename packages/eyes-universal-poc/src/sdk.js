const {spawn} = require('child_process')
const makeAPI = require('./api')
const makeRefer = require('./refer')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')

function makeSDK() {
  let port
  const server = spawn('./node_modules/.bin/eyes-universal-macos', {
    detached: true,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  server.unref()
  server.stdout.once('data', data => {
    ;[port] = String(data).split('\n', 1)
    server.stdout.destroy()
  })
  const ws = makeSocket()
  const refer = makeRefer()
  const spec = makeSpec(refer)

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
    console.log(port)
    ws.open(`http://localhost:${port}/eyes`)
    ws.emit('Session.init', {commands: Object.keys(spec)})
    const driverRef = refer.ref(driver)
    const eyes = await ws.request('Eyes.open', {driver: driverRef, config})

    return {check, close, abort}

    async function check(checkSettings) {
      return ws.request('Eyes.check', {eyes, checkSettings})
    }
    async function close() {
      const result = await ws.request('Eyes.close', {eyes})
      ws.close()
      refer.destroy(driverRef)
      return result
    }
    async function abort() {
      const result = await ws.request('Eyes.abort', {eyes})
      ws.close()
      refer.destroy(driverRef)
      return result
    }
  }

  return makeAPI({...spec, openEyes})
}

module.exports = makeSDK
