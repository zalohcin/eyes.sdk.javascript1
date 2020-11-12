const spec = require('../src/spec-driver')

const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
const selector = '#overflowing-div'

/* eslint-disable no-undef */
const getFontProperty = async page => {
  const font = await page.evaluate(selector => {
    const el = document.querySelector(selector)
    const compStyle = getComputedStyle(el)
    const fontProp = getComputedStyle(el).font
    const fontSize = compStyle.getPropertyValue('font-size')
    const lineHeight = compStyle.getPropertyValue('line-height')
    return {fontSize, lineHeight, fontProp}
  }, selector)
  return font
}
/* eslint-enable no-undef */

const printFontProperty = async () => {
  const [page, quit] = await spec.build()
  await page.goto(url)
  console.log(await getFontProperty(page))
  await quit()
}

;(async () => {
  await printFontProperty(true)
})()
