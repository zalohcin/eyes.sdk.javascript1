'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent10,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 768, 954, 2),
  name: 'iPad Air 2 Simulator 11.3',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
