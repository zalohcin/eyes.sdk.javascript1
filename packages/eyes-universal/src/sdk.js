const WebSocket = require('ws')
const {ClassicRunner, VisualGridRunner} = require('@applitools/eyes-sdk-core')
const {EyesSDK} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const makeServer = require('./server')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')
const makeRefer = require('./refer')
const {version} = require('../package.json')

async function makeSDK(config) {
  const {server, port} = await makeServer(config)
  console.log(port) // NOTE: this is a part of the protocol
  if (!server) {
    console.log(
      `You trying to spawn a duplicated server, please use server on port ${port} instead`,
    )
    return null
  }

  const wss = new WebSocket.Server({server, path: '/eyes'})
  wss.on('connection', client => {
    const ws = makeSocket(client)
    const refer = makeRefer()

    ws.once('Session.init', config => {
      const spec = makeSpec(ws)
      const commands = [
        'isDriver',
        'isElement',
        'isSelector',
        'extractSelector',
        'isStaleElementError',
        ...config.commands,
      ]

      ws.sdk = EyesSDK({
        name: `eyes-universal/${config.name}`,
        version: `${version}/${config.name}`,
        spec: commands.reduce(
          (commands, name) => Object.assign(commands, {[name]: spec[name]}),
          {},
        ),
        VisualGridClient,
      })
    })

    ws.command('Util.setViewportSize', async ({driver, viewportSize}) => {
      return ws.sdk.Eyes.setViewportSize(driver, viewportSize)
    })
    ws.command('Batch.close', () => {
      // TODO
    })
    ws.command('Eyes.open', async ({driver, config}) => {
      const eyes = new ws.sdk.EyesFactory(config.vg ? new VisualGridRunner() : new ClassicRunner())
      eyes.setConfiguration(config)
      await eyes.open(
        driver,
        config.appName,
        config.testName,
        config.viewportSize,
        config.sessionType,
      )
      return refer.ref(eyes)
    })
    ws.command('Eyes.check', async ({eyes, checkSettings}) => {
      return refer.deref(eyes).check(checkSettings)
    })
    ws.command('Eyes.locate', async ({eyes}) => {
      // TODO
    })
    ws.command('Eyes.close', ({eyes}) => {
      refer.destroy(driver)
      return refer.deref(eyes).close(false)
    })
    ws.command('Eyes.abort', ({eyes}) => {
      return refer.deref(eyes).abort(false)
    })
  })

  return {port, close: () => server.close()}
}

module.exports = makeSDK
