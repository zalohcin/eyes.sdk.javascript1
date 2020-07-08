'use strict'
const {getMobileEmulation, testMobileDevices, pages} = require('./TestMobileDevices')
let androidAgent =
  'Mozilla/5.0 (Linux; Android 8.0.0; Android SDK built for x86_64 Build/OSR1.180418.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36'
let android = {
  mobileEmulation: getMobileEmulation(androidAgent, 384, 512, 2),
  name: 'Android Emulator 8.0',
  orientation: 'Portrait',
}
describe(android.name, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestAndroidStitch', testMobileDevices(android, page))
    })
  })
})
