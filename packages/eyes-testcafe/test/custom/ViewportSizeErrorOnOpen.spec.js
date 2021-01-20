// re: https://trello.com/c/xNCZNfPi
const path = require('path')
const {testSetup, testServer} = require('@applitools/sdk-shared')
const eyes = testSetup.getEyes({vg: true})
let server
fixture`viewport size error on open for certain pages`
  .before(async () => {
    const staticPath = path.join(__dirname, 'fixtures')
    server = await testServer({port: 7999, staticPath})
  })
  .after(async () => {
    await server.close()
    eyes.abortIfNotClosed()
  })
test.skip('repro', async t => {
  //await t.navigateTo('https://demo.applitools.com/') // works
  await t.navigateTo('https://www.walmart.com.mx/tu-cuenta/iniciar-sesion') // NOTE: errors with this
  //await t.navigateTo('http://localhost:7999/js-error.html') // errors, but not in the right way...?
  await eyes.open({
    t,
    appName: 'eyes-testcafe custom',
    testName: 'viewport size error on open for certain pages',
    browser: [{width: 800, height: 600, name: 'chrome'}], // NOTE: and with this (take this away and it doesn't)
  })
  await eyes.checkWindow({
    target: 'window',
    fully: true,
  })
  await eyes.close(false)
})
