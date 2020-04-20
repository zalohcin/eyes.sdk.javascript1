/* global browser */
'use strict'

describe('vg', () => {
  it('full page', () => {
    browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
    browser.eyesCheck('full page')
  })
})
