'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent11,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 512, 349, 4),
  name: 'iPad Air 2 Simulator 12.0',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
