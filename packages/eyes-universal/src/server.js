const WebSocket = require('ws')
const uuid = require('uuid')
const {ClassicRunner, VisualGridRunner} = require('@applitools/eyes-sdk-core')
const makeSdk = require('./sdk')
const socket = require('./ws/socket')

const EYES_ID = 'applitools-eyes'

const server = new WebSocket.Server({
  port: 8080,
})

server.on('connection', client => {
  console.log('CONNECTED')
  const ws = socket(client)
  ws.runners = new Map()
  ws.instances = new Map()

  ws.once('Session.init', config => {
    ws.sdk = makeSdk(config)
  })

  ws.command('Util.setViewportSize', async ({driverId, viewportSize}) => {
    return ws.sdk.Eyes.setViewportSize(driverId, viewportSize)
  })

  ws.command('Batch.close', () => {
    // TODO
  })

  ws.command('Eyes.open', async ({driverId, config}) => {
    const eyesId = `${EYES_ID}/${uuid.v4()}`
    const eyes = new ws.sdk.Eyes(config.vg ? new VisualGridRunner() : new ClassicRunner())
    ws.eyes.set(eyesId)
    await eyes.open(driverId, config)
    return eyesId
  })

  ws.command('Eyes.check', async ({eyesId, checkSettings}) => {
    const eyes = ws.eyes.get(eyesId)
    return eyes.check(checkSettings)
  })

  ws.command('Eyes.locate', async ({eyesId}) => {
    // TODO
  })

  ws.command('Eyes.close', ({eyesId}) => {
    const eyes = ws.eyes.get(eyesId)
    return eyes.check(false)
  })

  ws.command('Eyes.abort', ({eyesId}) => {
    const eyes = ws.eyes.get(eyesId)
    return eyes.check(false)
  })
})
