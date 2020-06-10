'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent11,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 512, 333, 4),
  name: 'iPad Air 2 Simulator 11.3',
  orientation: 'Landscape',
}
describe(`${device.name} Landscape`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
