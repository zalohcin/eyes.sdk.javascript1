'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../frames/FrameChain').FrameChain} FrameChain
 * @typedef {import('../frames/Frame').Frame} Frame
 * @typedef {import('./EyesWrappedElement').EyesWrappedElement} EyesWrappedElement
 * @typedef {import('./EyesWrappedElement').UnwrappedElement} UnwrappedElement
 */
/**
 * Reference to the frame, index of the frame in the current context, name or id of the element,
 * framework element object, {@link EyesWrappedElement} implementation object or a {@link Frame} object
 * @typedef {number|string|UnwrappedElement|EyesWrappedElement|Frame} FrameReference
 */

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
   * @param {FrameReference} arg reference to the frame
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
   * @param {FrameChain|FrameReference[]} arg
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
