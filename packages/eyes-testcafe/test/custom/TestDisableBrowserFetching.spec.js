'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/sdk-shared')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Eyes} = require('../..')
const adjustUrlToDocker = url => url
let server, eyes

fixture`TestDisableBrowserFetching`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    server = await testServer({
      port: 5557,
      staticPath,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/ua-middleware.js',
      ),
    })
    eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  })
  .after(async () => {
    await server.close()
  })
test('sends dontFetchResources to dom snapshot', async driver => {
  const url = adjustUrlToDocker('http://localhost:5557/ua.html')
  await spec.visit(driver, url)
  await eyes.open({
    t: driver,
    appName: 'VgFetch',
    testName: 'TestDisableBrowserFetching',
    browser: [{width: 800, height: 600, name: 'chrome'}],
    disableBrowserFetching: true,
  })
  await eyes.check(Target.window())
  await eyes.close()
})
