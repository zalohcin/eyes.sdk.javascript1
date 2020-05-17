'use strict'
const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')

describe('refreshFrames()', function() {
  let mock, driver

  before(async () => {
    mock = new MockDriver()
    mock.mockElements([
      {selector: 'frame0', frame: true},
      {
        selector: 'frame1',
        frame: true,
        isCORS: true,
        children: [
          {selector: 'frame1-0', frame: true, isCORS: true},
          {selector: 'frame1-1', frame: true},
          {selector: 'frame1-2', frame: true, isCORS: true},
        ],
      },
      {
        selector: 'frame2',
        frame: true,
        isCORS: true,
        children: [
          {selector: 'frame2-0', frame: true, isCORS: true},
          {
            selector: 'frame2-1',
            frame: true,
            isCORS: true,
            children: [
              {selector: 'frame2-1-0', frame: true, isCORS: true},
              {selector: 'frame2-1-1', frame: true},
              {selector: 'frame2-1-2', frame: true, isCORS: true},
            ],
          },
          {selector: 'frame2-2', frame: true},
        ],
      },
    ])
    driver = new FakeWrappedDriver(new Logger(false), mock)
  })

  beforeEach(async () => {
    await driver.context.frameDefault()
  })

  it('untracked same origin frame chain [(0-0)?]', async () => {
    const frameElements = []
    const frameElement = await mock.findElement('frame0')
    frameElements.push(frameElement)
    await mock.switchToFrame(frameElement)
    assert.strictEqual(driver.context.frameChain.size, 0)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked cors frame chain [(0-1-2)?]', async () => {
    const frameElements = []
    const frameElement1 = await mock.findElement('frame1')
    frameElements.push(frameElement1)
    await mock.switchToFrame(frameElement1)
    const frameElement2 = await mock.findElement('frame1-2')
    frameElements.push(frameElement2)
    await mock.switchToFrame(frameElement2)
    assert.strictEqual(driver.context.frameChain.size, 0)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked mixed frame chain [(0-1-0)?]', async () => {
    const frameElements = []
    const frameElement1 = await mock.findElement('frame1')
    frameElements.push(frameElement1)
    await mock.switchToFrame(frameElement1)
    const frameElement0 = await mock.findElement('frame1-0')
    frameElements.push(frameElement0)
    await mock.switchToFrame(frameElement0)
    assert.strictEqual(driver.context.frameChain.size, 0)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked mixed frame chain [(0-1-1)?]', async () => {
    const frameElements = []
    const frameElement1 = await mock.findElement('frame1')
    frameElements.push(frameElement1)
    await mock.switchToFrame(frameElement1)
    const frameElement11 = await mock.findElement('frame1-1')
    frameElements.push(frameElement11)
    await mock.switchToFrame(frameElement11)
    assert.strictEqual(driver.context.frameChain.size, 0)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('partially tracked frame chain [0-2-1-(2)?]', async () => {
    const frameElements = []
    const frameElement2 = await mock.findElement('frame2')
    frameElements.push(frameElement2)
    await driver.context.frame(frameElement2)
    const frameElement1 = await mock.findElement('frame2-1')
    frameElements.push(frameElement1)
    await driver.context.frame(frameElement1)
    const frameElement22 = await mock.findElement('frame2-1-2')
    frameElements.push(frameElement22)
    await mock.switchToFrame(frameElement22)
    // console.log(frameElement2, frameElement1)
    assert.strictEqual(driver.context.frameChain.size, 2)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('partially tracked frame chain [(0-2)?-1-2]', async () => {
    const frameElements = []
    const frameElement2 = await mock.findElement('frame2')
    frameElements.push(frameElement2)
    await mock.switchToFrame(frameElement2)
    const frameElement1 = await mock.findElement('frame2-1')
    frameElements.push(frameElement1)
    await driver.context.frame(frameElement1)
    const frameElement22 = await mock.findElement('frame2-1-2')
    frameElements.push(frameElement22)
    await driver.context.frame(frameElement22)
    assert.strictEqual(driver.context.frameChain.size, 2)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('tracked frame chain [0-2-1-2]', async () => {
    const frameElements = []
    const frameElement2 = await mock.findElement('frame2')
    frameElements.push(frameElement2)
    await driver.context.frame(frameElement2)
    const frameElement1 = await mock.findElement('frame2-1')
    frameElements.push(frameElement1)
    await driver.context.frame(frameElement1)
    const frameElement22 = await mock.findElement('frame2-1-2')
    frameElements.push(frameElement22)
    await driver.context.frame(frameElement22)
    assert.strictEqual(driver.context.frameChain.size, frameElements.length)
    await driver.context.framesRefresh()
    const frameChain = driver.context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        frameElements[frameIndex].id,
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })
})
