'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPhoneAgent,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 568, 232, 2),
  name: 'iPhone 5s Simulator 10.3',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
