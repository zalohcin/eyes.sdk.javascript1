'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/sdk-shared')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Eyes, Target} = require('../../index')
let serverA, serverB, eyes

fixture`TestVisualGridRefererHeader`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    serverA = await testServer({port: 5555, staticPath})
    serverB = await testServer({
      staticPath,
      port: 5556,
      allowCors: false,
      showLogs: true,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/cors-middleware.js',
      ),
    })
    eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  })

  .after(async () => {
    // await new Promise(r => setTimeout(r, 30000))
    await Promise.all([serverA.close(), serverB.close()])
  })

// NOTE:
// Disabling this test since TestCafe doesn't send a referer.
// This causes the image to never get loaded.
test.skip('send referer header', async driver => {
  await spec.visit(driver, 'http://localhost:5555/cors.html')
  await eyes.open(driver, 'VgFetch', ' VgFetch referer', {width: 800, height: 600})
  await eyes.check('referer', Target.window())
  await eyes.close()
})
