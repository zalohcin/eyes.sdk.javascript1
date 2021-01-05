'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/sdk-shared')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Eyes} = require('../..')
const adjustUrlToDocker = url => {
  return url
}
let server, eyes

fixture`DOMSnapshotSkipList`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    server = await testServer({
      port: 5558,
      staticPath,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/ephemeral-middleware.js',
      ),
    })
    eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  })
  .after(async () => {
    await server.close()
  })
test('skip list for DOM snapshot works with dependencies for blobs', async driver => {
  const url = adjustUrlToDocker('http://localhost:5558/skip-list/skip-list.html')
  await spec.visit(driver, url)
  await eyes.open(driver, 'Applitools Eyes SDK', 'DOMSnapshotSkipList', {width: 800, height: 600})
  await eyes.check(Target.window().fully())
  await spec.visit(driver, url)
  await eyes.check(Target.window().fully())
  await eyes.close()
})
