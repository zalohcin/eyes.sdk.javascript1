const cwd = process.cwd()
const path = require('path')
const assert = require('assert')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {testServer} = require('../../index')
const {getEyes} = require('../../src/test-setup')
const adjustUrlToDocker = require('../util/adjust-url-to-docker')

describe('Coverage Tests', () => {
  let driver, eyes, serverA, serverB, url

  beforeEach(async () => {
    url = adjustUrlToDocker('http://localhost:7373/handles/cors_frames/cors.hbs')
    const staticPath = path.join(__dirname, '../fixtures')
    serverA = await testServer({
      port: 7373,
      staticPath,
      allowCors: false,
      middlewareFile: path.resolve(__dirname, '../util/cors-snapshot-middleware.js'),
      hbData: {
        title: 'Hello, I have a designer cross origin frame',
        src: adjustUrlToDocker('http://localhost:7374/cors_frames/frame.html'),
      },
    })
    serverB = await testServer({port: 7374, staticPath})

    driver = await spec.build({browser: 'chrome', headless: false})
    eyes = getEyes({
      isVisualGrid: true,
      branchName: 'master',
    })
  })

  afterEach(async () => {
    await spec.cleanup(driver)
    await serverA.close()
    await serverB.close()
  })

  it('TestCheckDomSnapshotCrossOriginFrames_VG', async () => {
    await spec.visit(driver, url)
    await eyes.open(driver, 'CORS iframes', 'TestCheckDomSnapshotCrossOriginFrames_VG', {
      width: 1200,
      height: 800,
    })
    await eyes.check()
    await eyes.close(true)
  })
})
