'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-sdk-core')
const Frame = require('./Frame')
const NoFramesError = require('./../errors/NoFramesError')

class FrameChain {
  /**
   * Creates a new frame chain.
   * @param {Logger} logger A Logger instance.
   * @param {FrameChain} other A frame chain from which the current frame chain will be created.
   */
  constructor(logger, other) {
    ArgumentGuard.notNull(logger, 'logger')

    this._logger = logger
    this._frames = []

    if (other) {
      this._logger.verbose('Frame chain copy constructor (size ' + other.size + ')')
      for (const otherFrame of other.getFrames()) {
        this._frames.push(new Frame(otherFrame))
      }
      this._logger.verbose('Done!')
    }
  }

  /**
   * Compares two frame chains.
   * @param {FrameChain} c1 Frame chain to be compared against c2.
   * @param {FrameChain} c2 Frame chain to be compared against c1.
   * @return {boolean} True if both frame chains represent the same frame, false otherwise.
   */
  static isSameFrameChain(c1, c2) {
    if (c1.size !== c2.size) {
      return false
    }
    for (let i = 0; i < c1.size; ++i) {
      if (c1.getFrames()[i].reference !== c2.getFrames()[i].getReference()) {
        return false
      }
    }
    return true
  }

  /**
   * @return {Array.<Frame>} frames stored in chain
   */
  getFrames() {
    return this._frames
  }

  /**
   * @param {int} index Index of needed frame
   * @return {Frame} frame by index in array
   */
  getFrame(index) {
    if (this._frames.length > index) {
      return this._frames[index]
    }

    throw new Error('No frames for given index')
  }

  /**
   *
   * @return {int} The number of frames in the chain.
   */
  get size() {
    return this._frames.length
  }

  /**
   * Removes all current frames in the frame chain.
   */
  clear() {
    return (this._frames = [])
  }

  clone() {
    return new FrameChain(this._logger, this)
  }

  /**
   * Removes the last inserted frame element. Practically means we switched
   * back to the parent of the current frame
   */
  pop() {
    return this._frames.pop()
  }

  /**
   * @return {Frame} Returns the top frame in the chain.
   */
  peek() {
    return this._frames[this._frames.length - 1]
  }

  /**
   * Appends a frame to the frame chain.
   * @param {Frame} frame The frame to be added.
   */
  push(frame) {
    return this._frames.push(frame)
  }

  [Symbol.iterator]() {
    return this._frames[Symbol.iterator]()
  }

  /**
   * @return {Location} The location of the current frame in the page.
   */
  getCurrentFrameOffset() {
    let result = Location.ZERO

    this._frames.forEach(frame => {
      result = result.offsetByLocation(frame.getLocation())
    })

    return result
  }

  /**
   * @return {Location} The outermost frame's location, or NoFramesException.
   */
  getDefaultContentScrollPosition() {
    if (this._frames.length === 0) {
      throw new NoFramesError('No frames in frame chain')
    }
    return new Location(this._frames[0].getOriginalLocation())
  }

  /**
   * @return {{width: number, height: number}} The size of the current frame.
   */
  getCurrentFrameSize() {
    this._logger.verbose('getCurrentFrameSize()')
    const result = this._frames[this._frames.length - 1].size
    this._logger.verbose('Done!')
    return result
  }

  /**
   * @return {RectangleSize} The inner size of the current frame.
   */
  getCurrentFrameInnerSize() {
    this._logger.verbose('getCurrentFrameInnerSize()')
    const result = this._frames[this._frames.length - 1].getInnerSize()
    this._logger.verbose('Done!')
    return result
  }
}

module.exports = FrameChain
