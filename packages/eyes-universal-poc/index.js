const WebSocket = require('ws')
const makeSDK = require('./src/sdk')

const client = new WebSocket('ws://localhost:8080')

module.exports = makeSDK(client)
