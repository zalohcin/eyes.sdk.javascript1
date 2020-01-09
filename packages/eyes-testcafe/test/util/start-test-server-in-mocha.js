'use strict'

const testServer = require('./test-server')

function startTestServer({before, after, port = 0}) {
  let actualPort, close

  before(async () => {
    const server = await testServer({port})
    actualPort = server.port
    close = server.close
  })

  after(async () => {
    await close()
  })

  return {getPort}

  function getPort() {
    return actualPort
  }
}

module.exports = startTestServer // eslint-disable-line node/exports-style
