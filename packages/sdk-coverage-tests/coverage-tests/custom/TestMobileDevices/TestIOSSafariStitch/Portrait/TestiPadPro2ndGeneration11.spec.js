'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent10,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 1024, 1296, 2),
  name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
