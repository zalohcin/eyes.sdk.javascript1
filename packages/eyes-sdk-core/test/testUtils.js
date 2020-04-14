'use strict'

/* eslint-disable no-bitwise */
const fs = require('fs')
const path = require('path')
const {EyesBase} = require('../index')

const getResourcePath = fileName => path.resolve(__dirname, 'fixtures', fileName)

const getResource = fileName => fs.readFileSync(getResourcePath(fileName))

const getResourceAsText = fileName => fs.readFileSync(getResourcePath(fileName), 'utf8').trim()

function FakeEyes(...args) {
  EyesBase.prototype.getBaseAgentId = () => 'fakeAgentId'
  const eyes = new EyesBase(...args)
  eyes.getAndSetBatchInfo = eyes.getAndSaveRenderingInfo = eyes.getInferredEnvironment = () => {}
  return eyes
}

exports.getResourcePath = getResourcePath
exports.getResource = getResource
exports.getResourceAsText = getResourceAsText
exports.FakeEyes = FakeEyes
