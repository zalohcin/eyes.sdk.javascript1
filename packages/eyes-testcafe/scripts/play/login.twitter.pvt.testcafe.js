/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({viewportSize: {width: 1024, height: 768}})
eyes.setStitchMode(StitchMode.SCROLL)
eyes.setConfiguration(configuration)
if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Login`.page`https://mobile.twitter.com`.after(async () => await eyes.close())

test('Login', async t => {
  await eyes.open(t, 'Twitter App', 'Twitter Login')

  await new Promise(r => setTimeout(r, 2000))
  await eyes.check('Login', Target.window().fully())

  await t
    .typeText(
      '#react-root > div > div > div > main > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div:nth-child(6) > div > label > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1udh08x > div > input',
      'daniels69458066',
    )
    .typeText(
      '#react-root > div > div > div > main > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div:nth-child(7) > div > label > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1udh08x > div > input',
      'ukw6gSnZNMWgrhS',
    )
    .click(
      '#react-root > div > div > div > main > div > div > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div.css-1dbjc4n.r-eqz5dr.r-1777fci > div',
    )

  await new Promise(r => setTimeout(r, 4000))
  await eyes.check('Feed', Target.window().fully())

  // await t.click(
  //   '#react-root > div > div > div > header > div > div > div > div > div.css-1dbjc4n.r-d0pm55.r-1bymd8e.r-13qz1uu > nav > a:nth-child(3) > div > div.css-901oao.css-bfa6kz.r-13gxpu9.r-1qd0xha.r-1b6yd1w.r-vw2c0b.r-ad9z0x.r-1joea0r.r-y3t9qe.r-bcqeeo.r-qvutc0 > span',
  // )
  // await new Promise(r => setTimeout(r, 2000))
  // await eyes.check('Notifications', Target.window().fully())

  // await t.click(
  //   '#react-root > div > div > div > header > div > div > div > div > div.css-1dbjc4n.r-d0pm55.r-1bymd8e.r-13qz1uu > nav > a:nth-child(4) > div > div.css-901oao.css-bfa6kz.r-13gxpu9.r-1qd0xha.r-1b6yd1w.r-vw2c0b.r-ad9z0x.r-1joea0r.r-y3t9qe.r-bcqeeo.r-qvutc0 > span',
  // )
  // await new Promise(r => setTimeout(r, 2000))
  // await eyes.check('Messages', Target.window().fully())
})
