'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../frames/FrameChain')} FrameChain
 * @typedef {import('../frames/Frame').FrameReference} FrameReference
 */

/**
 * An interface for browsing context
 * @interface
 */
class EyesBrowsingContext {
  /**
   * Returns current frame chain
   * @return {FrameChain} copy of the current frame chain
   */
  get frameChain() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Clear current frame chain
   */
  reset() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Switch to the child (frame) context by reference
   * @param {FrameReference} reference - reference to the frame
   * @return {Promise<*>}
   */
  async frame(reference) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Switch to the top level context
   * @return {Promise<*>}
   */
  async frameDefault() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Switch to the parent context
   * @return {Promise<*>}
   */
  async frameParent() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Switch to the specified frame path from the top level
   * @param {Iterable<FrameReference>} path
   * @return {Promise<*>}
   */
  async frames(path) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Refresh frame chain from the real driver target context
   * @return {Promise<*>}
   */
  async framesRefresh() {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesBrowsingContext
