'use strict'

/* eslint-disable no-unused-vars */

/**
 * An interface for browsing context
 * @ignore
 * @interface
 */
class EyesBrowsingContext {
  /**
   * Returns current frame chain
   * @return {FrameChain} copy of the current frame chain
   */
  get frameChain() {}
  /**
   * Clear current frame chain
   */
  reset() {}
  /**
   * Switch to the child (frame) context by reference
   * @param {number|string|object|EyesWrappedElement|Frame} arg reference to the frame
   * @return {Promise<*>}
   */
  async frame(arg) {}
  /**
   * Switch to the top level context
   * @return {Promise<*>}
   */
  async frameDefault() {}
  /**
   * Switch to the parent context
   * @return {Promise<*>}
   */
  async frameParent() {}
  /**
   * Switch to the specified frame path from the top level
   * @param {FrameChain|Array<*>} arg
   * @return {Promise<*>}
   */
  async frames(arg) {}
  /**
   * Refresh frame chain from the real driver target context
   * @return {Promise<*>}
   */
  async framesRefresh() {}
}

exports.EyesBrowsingContext = EyesBrowsingContext
