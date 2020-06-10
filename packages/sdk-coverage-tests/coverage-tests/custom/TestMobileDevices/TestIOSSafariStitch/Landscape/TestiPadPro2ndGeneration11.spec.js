'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent11,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 683, 477, 4),
  name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
