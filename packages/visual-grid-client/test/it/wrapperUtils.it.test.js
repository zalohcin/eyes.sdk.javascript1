'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const {BatchInfo} = require('@applitools/eyes-common')
const EyesWrapper = require('../../src/sdk/EyesWrapper')
const {configureWrappers} = require('../../src/sdk/wrapperUtils')

describe('wrapperUtils', () => {
  describe('configureWrappers', () => {
    it('sets useDom & enablePatterns', () => {
      let wrapper = new EyesWrapper()
      configureWrappers({
        wrappers: [wrapper],
        browsers: [{}],
        useDom: true,
        enablePatterns: true,
      })
      expect(wrapper.getUseDom()).to.be.true
      expect(wrapper.getEnablePatterns()).to.be.true

      wrapper = new EyesWrapper()
      configureWrappers({
        wrappers: [wrapper],
        browsers: [{}],
        useDom: false,
        enablePatterns: false,
      })
      expect(wrapper.getUseDom()).to.be.false
      expect(wrapper.getEnablePatterns()).to.be.false

      wrapper = new EyesWrapper()
      configureWrappers({wrappers: [wrapper], browsers: [{}]})
      expect(wrapper.getUseDom()).to.be.false
      expect(wrapper.getEnablePatterns()).to.be.false
    })
  })

  it('sets notifyOnCompletion', () => {
    let wrapper = new EyesWrapper()
    configureWrappers({
      wrappers: [wrapper],
      browsers: [{}],
      batchNotify: true,
    })
    expect(wrapper._configuration.getBatch().getNotifyOnCompletion()).to.be.true
  })

  it('overrides batch data with batch', () => {
    let wrapper = new EyesWrapper()
    const id = 'myId'
    const name = 'myName'
    const notifyOnCompletion = true
    const batch = new BatchInfo({id, name, notifyOnCompletion})
    configureWrappers({
      wrappers: [wrapper],
      browsers: [{}],
      batch,
      batchId: 'override this id',
      batchName: 'override this name',
      notifyOnCompletion: false,
    })
    expect(wrapper._configuration.getBatch().getNotifyOnCompletion()).to.be.true
    expect(wrapper._configuration.getBatch().getName()).to.equal('myName')
    expect(wrapper._configuration.getBatch().getId()).to.equal('myId')
  })
})
