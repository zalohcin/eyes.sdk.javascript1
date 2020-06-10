'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPhoneAgent,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 724, 271, 3),
  name: 'iPhone 11 Pro Simulator 13.0',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
