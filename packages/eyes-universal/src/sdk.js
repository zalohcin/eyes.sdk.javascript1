const core = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const makeServer = require('./server')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')
const makeRefer = require('./refer')
const {version} = require('../package.json')

const IDLE_TIMEOUT = 900000 // 15min

async function makeSDK({idleTimeout = IDLE_TIMEOUT, ...serverConfig} = {}) {
  const {server, port} = await makeServer(serverConfig)
  console.log(port) // NOTE: this is a part of the protocol
  if (!server) {
    console.log(
      `You trying to spawn a duplicated server, please use server on port ${port} instead`,
    )
    return null
  }
  server.idle = setTimeout(() => server.close(), idleTimeout)

  server.on('connection', client => {
    clearTimeout(server.idle)
    const socket = makeSocket(client)
    const refer = makeRefer()

    socket.on('close', () => {
      if (server.clients.size === 0) {
        server.idle = setTimeout(() => server.close(), idleTimeout)
      }
    })

    socket.once('Session.init', config => {
      const spec = makeSpec(socket)
      const commands = [
        'isDriver',
        'isElement',
        'isSelector',
        'extractSelector',
        'isStaleElementError',
        ...config.commands,
      ]

      socket.sdk = core.makeSDK({
        name: `eyes-universal/${config.name}`,
        version: `${version}/${config.name}`,
        spec: commands.reduce((commands, name) => {
          return Object.assign(commands, {[name]: spec[name]})
        }, {}),
        VisualGridClient,
      })
    })

    socket.command('Util.setViewportSize', async ({driver, viewportSize}) => {
      return socket.sdk.setViewportSize(driver, viewportSize)
    })
    socket.command('Util.closeBatch', () => {
      // TODO
    })
    socket.command('Eyes.locate', async ({eyes}) => {
      // TODO
    })
    socket.command('Eyes.open', async ({driver, config}) => {
      const commands = socket.sdk.openEyes(driver, config)
      return refer.ref(commands)
    })
    socket.command('Eyes.check', async ({eyes, checkSettings}) => {
      return refer.deref(eyes).check(checkSettings)
    })
    socket.command('Eyes.close', ({eyes}) => {
      return refer.deref(eyes).close()
    })
    socket.command('Eyes.abort', ({eyes}) => {
      return refer.deref(eyes).abort()
    })
  })

  return {port, close: () => server.close()}
}

module.exports = makeSDK
