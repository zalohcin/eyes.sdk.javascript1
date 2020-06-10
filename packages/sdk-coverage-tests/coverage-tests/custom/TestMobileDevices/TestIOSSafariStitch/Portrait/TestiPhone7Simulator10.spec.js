'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPhoneAgent,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 375, 559, 2),
  name: 'iPhone 7 Simulator 10.3',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
