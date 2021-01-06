// re: https://trello.com/c/HnnKL5VU/677-image-is-shown-as-blank-and-the-buttons-images-are-shown-as-squares-testcafe-hackathon-nov-2020
const cwd = process.cwd()
const path = require('path')
const {Eyes} = require('../..')
const {testServer} = require('@applitools/sdk-shared')
let eyes, server

fixture`internal proxying of resources`
  .before(async () => {
    const staticPath = path.join(cwd, 'test', 'custom', 'fixtures')
    server = await testServer({port: 7777, staticPath})
    eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  })
  .after(async () => {
    await server.close()
  })
test('works', async t => {
  await t.navigateTo('http://localhost:7777/images.html')
  await eyes.open(t, 'internal proxying of resources', 'works', {
    width: 1024,
    height: 768,
  })
  await eyes.checkWindow({
    target: 'window',
    fully: true,
  })
  await eyes.close(true)
})
