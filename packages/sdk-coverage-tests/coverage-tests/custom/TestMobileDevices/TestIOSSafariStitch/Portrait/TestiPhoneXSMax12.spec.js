'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPhoneAgent,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 414, 719, 3),
  name: 'iPhone XS Max Simulator 12.2',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
