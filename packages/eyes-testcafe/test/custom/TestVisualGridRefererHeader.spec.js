'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/sdk-shared')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Eyes} = require('../..')
const adjustUrlToDocker = url => url
let serverA, serverB, eyes

fixture`TestVisualGridRefererHeader`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    serverA = await testServer({port: 5555, staticPath})
    serverB = await testServer({
      staticPath,
      port: 5556,
      allowCors: false,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/cors-middleware.js',
      ),
    })
    eyes = new Eyes()
  })

  .after(async () => {
    // await new Promise(r => setTimeout(r, 30000))
    await Promise.all([serverA.close(), serverB.close()])
  })

test('send referer header', async driver => {
  const url = adjustUrlToDocker('http://localhost:5555/cors.html')
  await spec.visit(driver, url)
  await eyes.open(driver, 'VgFetch', ' VgFetch referer', {width: 800, height: 600})
  await eyes.check('referer', Target.window())
  await eyes.close()
})
