// re: https://trello.com/c/HnnKL5VU
const cwd = process.cwd()
const path = require('path')
const {Eyes} = require('../../index')
const {testServer} = require('@applitools/sdk-shared')
let eyes, server

fixture`proxying of resources`
  .before(async () => {
    const staticPath = path.join(cwd, 'test', 'custom', 'fixtures')
    server = await testServer({port: 7777, staticPath})
    eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  })
  .after(async () => {
    await server.close()
  })
test('works with images', async t => {
  await t.navigateTo('http://localhost:7777/images.html')
  await eyes.open(t, 'eyes-testcafe proxying of resources', 'works with images', {
    width: 1024,
    height: 768,
  })
  await eyes.checkWindow({
    target: 'window',
    fully: true,
  })
  await eyes.close(true)
})
