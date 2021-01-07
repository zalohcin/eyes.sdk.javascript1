const cwd = process.cwd()
const path = require('path')
const {Eyes} = require('../..')
let _eyes
const pages = [
  {name: 'mopub', path: 'https://www.mopub.com/content/mopub-aem-twitter/en'},
  {name: 'careers', path: 'https://careers.twitter.com/content/careers-twitter/en.html'},
  {name: 'business', path: 'https://business.twitter.com/content/business-twitter/en.html'},
]
fixture`benchmark tc`
//test.skip('page 1', async t => {
//  await t.navigateTo(pages[0].path)
//  await eyes.open({t, appName: 'eyes-testcafe benchmark', testName: 'page 1'})
//  await eyes.checkWindow('page 1')
//  await eyes.close(false)
//})
test.skip('page 2', async t => {
  const eyes = new Eyes({configPath: path.join(cwd, 'test', 'custom', 'applitools.config.js')})
  await t.navigateTo(pages[1].path)
  await eyes.open({t, appName: 'eyes-testcafe benchmark', testName: 'page 2', showLogs: true})
  await eyes.checkWindow('page 2')
  await eyes.close(false)
})
//test.skip('page 3', async t => {
//  await t.navigateTo(pages[2].path)
//  await eyes.open({t, appName: 'eyes-testcafe benchmark', testName: 'page 3'})
//  await eyes.checkWindow('page 3')
//  await eyes.close(false)
//})
