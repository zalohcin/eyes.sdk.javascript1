const playwright = require('playwright')
const {Eyes} = require('./index')

async function main() {
  const browser = await playwright.chromium.launch({headless: false})
  try {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://applitools.com/')
    const eyes = new Eyes()
    await eyes.open(page, 'Universal SDK', 'Universal SDK')
    await eyes.check({isFully: true})
    await eyes.close()
  } catch (err) {
    console.log(err)
  } finally {
    await browser.close()
  }
}

main()
