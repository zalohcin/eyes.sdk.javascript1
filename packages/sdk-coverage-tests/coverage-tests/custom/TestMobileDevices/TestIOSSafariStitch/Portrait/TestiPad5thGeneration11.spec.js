'use strict'
const {
  getMobileEmulation,
  testMobileDevices,
  pages,
  iPadAgent10,
} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 768, 922, 2),
  name: 'iPad (5th generation) Simulator 11.0',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  pages.forEach(page => {
    describe(`${page}`, () => {
      it('TestIOSSafariStitch', testMobileDevices(device, page))
    })
  })
})
