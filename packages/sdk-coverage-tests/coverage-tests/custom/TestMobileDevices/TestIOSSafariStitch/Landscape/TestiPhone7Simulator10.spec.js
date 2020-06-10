'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPhoneAgent,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 667, 331, 2),
  name: 'iPhone 7 Simulator 10.3',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
