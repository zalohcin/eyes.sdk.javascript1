'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent11,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 556, 382, 4),
  name: 'iPad Pro (10.5 inch) Simulator 11.0',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
