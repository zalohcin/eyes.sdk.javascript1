const WebSocket = require('ws')
const uuid = require('uuid')
const {ClassicRunner, VisualGridRunner} = require('@applitools/eyes-sdk-core')
const makeSdk = require('./sdk')
const socket = require('./ws/socket')

const EYES_ID = 'applitools-eyes'
const RUNNER_ID = 'applitools-runner'

const server = new WebSocket.Server({
  port: 8080,
})

server.on('connection', client => {
  const ws = socket(client)
  ws.runners = new Map()
  ws.instances = new Map()

  ws.once('Session.init', config => {
    ws.sdk = makeSdk(config)
  })

  ws.command('Runner.new', ({vg}) => {
    const runnerId = `${RUNNER_ID}/${uuid.v4()}`
    ws.runners.set(runnerId, vg ? new VisualGridRunner() : new ClassicRunner())
    return runnerId
  })

  ws.command('Eyes.new', ({runnerId, config}) => {
    const runner = ws.runners.get(runnerId)
    const eyesId = `${EYES_ID}/${uuid.v4()}`
    const eyes = new ws.sdk.Eyes(runner)
    ws.eyes.set(eyesId, eyes)
    return eyesId
  })

  ws.command('Eyes.open', async ({eyesId, driver, config}) => {
    const eyes = ws.eyes.get(eyesId)
    await eyes.open(driver /* config */)
  })

  ws.command('Eyes.check', async ({eyesId, checkSettings}) => {
    const eyes = ws.eyes.get(eyesId)
    return eyes.check(checkSettings)
  })

  ws.command('Eyes.close', ({eyesId}) => {
    const eyes = ws.eyes.get(eyesId)
    return eyes.check(false)
  })
})
