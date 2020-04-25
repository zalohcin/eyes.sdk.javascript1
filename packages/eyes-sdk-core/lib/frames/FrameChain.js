'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const Frame = require('./Frame')
/**
 * @typedef {import('@applitools/eyes-common').Logger} Logger
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 */

class FrameChain {
  /**
   * @param {Logger} logger - logger instance
   * @param {FrameChain} other - frame chain from which the current frame chain will be created
   */
  constructor(logger, other) {
    ArgumentGuard.notNull(logger, 'logger')

    this._logger = logger
    this._frames = []

    if (other) {
      this._frames = Array.from(other)
    }
  }

  /**
   * Equality check for two frame chains
   * @param {FrameChain} c1 - frame chain to be compared
   * @param {FrameChain} c2 - frame chain to be compared
   * @return {boolean} true if both objects represent the same frame chain, false otherwise
   */
  static equals(c1, c2) {
    if (c1.size !== c2.size) {
      return false
    }
    for (let index = 0; index < c1.size; ++index) {
      if (Frame.equals(c1.frameAt(index), c2.frameAt(index))) {
        return false
      }
    }
    return true
  }

  /**
   * @param {number} index - index of needed frame
   * @return {Frame} frame by index in array
   */
  frameAt(index) {
    if (this._frames.length > index) {
      return this._frames[index]
    }
    throw new Error('No frames for given index')
  }

  /**
   * @return {number} number of frames in the chain
   */
  get size() {
    return this._frames.length
  }

  /**
   * @return {boolean} true if frame chain is empty, false otherwise
   */
  get isEmpty() {
    return this._frames.length === 0
  }

  /**
   * @return {Frame} first frame context (the first frame in the chain)
   */
  get first() {
    return this._frames[0]
  }

  /**
   * @return {Frame} current frame context (the last frame in the chain)
   */
  get current() {
    return this._frames[this._frames.length - 1]
  }

  /**
   * Removes all frames in the frame chain
   */
  clear() {
    this._frames = []
  }

  /**
   * @return {FrameChain} cloned frame chain
   */
  clone() {
    return new FrameChain(this._logger, this)
  }

  /**
   * Removes the last inserted frame element. Practically means we switched
   * back to the parent of the current frame
   */
  pop() {
    this._frames.pop()
  }

  /**
   * Appends a frame to the frame chain
   * @param {Frame} frame - frame to be added
   */
  push(frame) {
    return this._frames.push(frame)
  }

  /**
   * @return {Location} location of the current frame in the page
   */
  getCurrentFrameOffset() {
    return this._frames.reduce((location, frame) => {
      return location.offsetByLocation(frame.location)
    }, Location.ZERO)
  }

  /**
   * @return {Location} location of the current frame related to the viewport
   */
  getCurrentFrameLocationInViewport() {
    return this._frames.reduce((location, frame) => {
      return location.offset(
        frame.location.getX() - frame.parentScrollLocation.getX(),
        frame.location.getY() - frame.parentScrollLocation.getY(),
      )
    }, Location.ZERO)
  }

  [Symbol.iterator]() {
    return this._frames[Symbol.iterator]()
  }
}

module.exports = FrameChain
