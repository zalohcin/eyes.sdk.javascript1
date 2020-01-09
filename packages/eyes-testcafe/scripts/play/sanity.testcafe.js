/* global fixture, test */
const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

const urls = [
  // 'https://facebook.com',
  // 'https://twitter.com',
  // 'https://wikipedia.org',
  // 'https://docs.microsoft.com/en-us/',
  // 'https://applitools.com/features/frontend-development',
  // 'https://applitools.com/docs/topics/overview.html',
  // 'https://applitools.com/helloworld',
  // 'https://docs.cypress.io/api/api/table-of-contents.html',
  // 'https://docs.approvesimple.com/docs',
  // 'https://theintercept.com/privacy-policy/',
  // 'https://www.lidl.com/products?category=OCI1000039&sort=productAtoZ',
  // 'http://example.com',
  // 'https://www.autogravity.com/inventory?page=0&query=%7B%22bodyStyles%22%3A%5B%7B%22label%22%3A%22SUV%22%2C%22queryValue%22%3A%22SUV%22%7D%5D%2C%22conditions%22%3A%5B%7B%22label%22%3A%22New%22%2C%22queryValue%22%3A%22NEW%22%7D%5D%2C%22regions%22%3A%5B%7B%22queryValue%22%3A%7B%22lat%22%3A40.755322%2C%22lon%22%3A-73.9932872%2C%22rad%22%3A30%7D%7D%5D%2C%22vehicles%22%3A%5B%7B%22label%22%3A%22Kia+Sorento%22%2C%22queryValue%22%3A%7B%22make%22%3A%7B%22id%22%3A19%7D%2C%22model%22%3A%7B%22id%22%3A646%7D%7D%7D%5D%7D&size=50&sort=dealerRank%2Cdesc',
  // 'https://www.aetna.com/employers-organizations.html',
  // 'https://www.getbridge.com/solutions/human-resources',
  // 'https://www.applitools.com/users/login',
  // 'https://southwest.com',
  // 'https://www.usaa.com/inet/wc/auto-insurance?wa_ref=pub_global_products_ins_auto',
  // 'http://angiejones.tech/',
  // 'https://applitools-sample-web-app-testkit.surge.sh/page-with-resource.html',
  // 'https://ous.test.clper.me/app/login',
]

urls.forEach((url, i) => {
  fixture('Sanity!').page(url)

  test(`Sanity! - ${url}`, async t => {
    await eyes.open(t, 'SanityWeb!', `Sanity! - ${url}`)
    await new Promise(r => setTimeout(r, 1000))
    await eyes.check('Sanity! Load', Target.window().fully())
    await eyes.close()

    if (i === urls.length - 1) {
      await eyes.close()
    }
  })
})
