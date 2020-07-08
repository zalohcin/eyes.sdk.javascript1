'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent10,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 834, 1042, 2),
  name: 'iPad Pro (10.5 inch) Simulator 11.0',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
