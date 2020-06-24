'use strict'
const FrameChain = require('../frames/FrameChain')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../logging/Logger')} Logger
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesWrappedDriver')<Driver, Element, Selector>} EyesWrappedDriver
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('../frames/Frame')<Driver, Element, Selector>} Frame
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('../frames/Frame').FrameReference<Driver, Element, Selector>} FrameReference
 */

/**
 * The object which implements the lowest-level functions to work with browsing context
 * @template Driver, Element, Selector
 * @typedef SpecBrowsingContext
 * @prop {(reference: FrameReference<Driver, Element, Selector>) => Frame} createFrameReference - return new frame reference
 * @prop {(leftFrame: Frame<Driver, Element, Selector>, rightFrame: Frame<Driver, Element, Selector>) => Promise<boolean>} isEqualFrames - return true if two frames are equal, false otherwise
 * @prop {(driver: Driver, reference: FrameReference<Driver, Element, Selector>) => void} switchToFrame - switch to frame specified with a reference
 * @prop {(driver: Driver) => void} switchToParentFrame - switch to parent frame
 */

/**
 * @template Driver - Driver provided by wrapped framework
 * @template Element - Element provided by wrapped framework
 * @template Selector - Selector supported by framework
 */
class EyesBrowsingContext {
  /**
   * @template Driver, Element, Selector
   * @param {SpecBrowsingContext<Driver, Element, Selector>} spec - specifications for the specific framework
   * @return {EyesBrowsingContext} specialized version of this class
   */
  static specialize(spec) {
    return class extends EyesBrowsingContext {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /**
   * @type {SpecBrowsingContext}
   */
  static get spec() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecBrowsingContext<Driver, Element, Selector>} */
  get spec() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct browsing context instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver - parent driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
    this._topContext = this.spec.createFrameReference(null)
    this._frameChain = new FrameChain(this._logger)
  }
  /**
   * Representation of the top-level context
   * @type {Frame<Driver, Element, Selector>}
   */
  get topContext() {
    return this._topContext
  }
  /**
   * Copy of the current frame chain
   * @type {FrameChain}
   */
  get frameChain() {
    return this._frameChain.clone()
  }
  /**
   * Clear current frame chain
   */
  reset() {
    this._frameChain.clear()
  }
  /**
   * Switch to the child (frame) context by reference
   * @param {FrameReference<Driver, Element, Selector>} reference - reference to the frame
   * @return {Promise<void>}
   */
  async frame(reference) {
    if (await this._driver.controller.isNative()) return
    if (!reference) {
      this._logger.verbose('EyesBrowsingContext.frame(null)')
      return this.frameDefault()
    }
    const parentFrame = this._frameChain.isEmpty ? this._topContext : this._frameChain.current
    const frame = await this.spec
      .createFrameReference(reference)
      .init(this._logger, this._driver, parentFrame)
    const result = await this.spec.switchToFrame(this._driver.unwrapped, frame.element.unwrapped)
    if (frame.scrollRootElement) {
      await frame.scrollRootElement.init(this._driver)
    }
    await this._frameChain.push(frame)
    this._logger.verbose('Done!')
    return result
  }
  /**
   * Switch to the top level context
   * @return {Promise<void>}
   */
  async frameDefault() {
    if (await this._driver.controller.isNative()) return
    this._logger.verbose('EyesBrowsingContext.frameDefault()')
    const result = await this.spec.switchToFrame(this._driver.unwrapped, null)
    this._logger.verbose('Done! Switching to default content...')
    if (this._frameChain.size > 0) {
      this._frameChain.clear()
    }
    return result
  }
  /**
   * Switch to the parent context
   * @param {number} [elevation=1] - elevation level
   * @return {Promise<void>}
   */
  async frameParent(elevation = 1) {
    if (await this._driver.controller.isNative()) return
    try {
      this._logger.verbose(`EyesBrowsingContext.frameParent(${elevation})`)
      while (elevation > 0) {
        await this.spec.switchToParentFrame(this._driver.unwrapped)
        this._logger.verbose('Done! Switching to parent frame..')
        if (this._frameChain.size > 0) {
          this._frameChain.pop()
        }
        elevation -= 1
      }
    } catch (err) {
      this._logger.verbose('WARNING: error during switch to parent frame', err)
      const framePath = Array.from(this._frameChain).slice(0, this._frameChain.length - elevation)
      await this.frameDefault()
      return this.framesAppend(framePath)
    }
  }
  /**
   * Switch to the specified frame path from the top level
   * @param {Iterable<FrameReference<Driver, Element, Selector>>} path
   * @return {Promise<void>}
   */
  async frames(path) {
    if (await this._driver.controller.isNative()) return
    const currentPath = Array.from(this._frameChain)
    const requiredPath = Array.from(path || [])
    if (currentPath.length === 0) return this.framesAppend(requiredPath)
    if (requiredPath.length === 0) return this.frameDefault()
    let diffIndex = -1
    for (const [index, frame] of requiredPath.entries()) {
      if (!(await this.spec.isEqualFrames(currentPath[index], frame))) {
        diffIndex = index
        break
      }
    }
    // required path is same as current or it is a sub-path of current
    if (diffIndex < 0) {
      // required path is same as current
      if (currentPath.length === requiredPath.length) return

      // required path is a sub-path of current
      // chose an optimal way to traverse from current context to target context
      if (currentPath.length - requiredPath.length <= requiredPath.length) {
        return this.frameParent(currentPath.length - requiredPath.length)
      } else {
        await this.frameDefault()
        return this.framesAppend(requiredPath)
      }
    }

    // required path is different from current or they are partially intersected
    // chose an optimal way to traverse from current context to target context
    if (currentPath.length - diffIndex <= diffIndex) {
      await this.frameParent(currentPath.length - diffIndex)
      const diffPath = requiredPath.slice(diffIndex)
      return this.framesAppend(diffPath)
    } else {
      await this.frameDefault()
      return this.framesAppend(requiredPath)
    }
  }
  /**
   * Append the specified frame path to the current context
   * @param {Iterable<FrameReference<Driver, Element, Selector>>} path
   * @return {Promise<void>}
   */
  async framesAppend(path) {
    if (await this._driver.controller.isNative()) return
    this._logger.verbose('EyesBrowsingContext.framesAppend(path)')
    for (const frameReference of path) {
      await this.frame(frameReference)
    }
    this._logger.verbose('Done switching into nested frames!')
  }
  /**
   * Refresh frame chain from the real driver target context
   * @return {Promise<*>}
   */
  async framesRefresh() {
    if (await this._driver.controller.isNative()) return
    let contextInfo = await EyesUtils.getCurrentContextInfo(this._logger, this._driver.executor)
    if (contextInfo.isRoot) {
      this._frameChain.clear()
      await this._topContext.init(this._logger, this._driver)
    } else {
      const framePath = []
      const frameChain = this._frameChain.clone()
      while (!contextInfo.isRoot) {
        await this.frameParent()
        let frameElement
        if (contextInfo.selector) {
          frameElement = await this._driver.finder.findElement({
            type: 'xpath',
            selector: contextInfo.selector,
          })
        } else {
          frameElement = await EyesUtils.findFrameByContext(
            this._logger,
            this._driver,
            contextInfo,
            this.spec.isEqualFrames,
          )
        }
        if (!frameElement) throw new Error('Unable to find out the chain of frames')
        if (await this.spec.isEqualFrames(frameElement, frameChain.current)) {
          await this.frameParent(frameChain.size - 1)
          framePath.unshift(...frameChain)
        } else {
          framePath.unshift(frameElement)
        }
        contextInfo = await EyesUtils.getCurrentContextInfo(this._logger, this._driver.executor)
      }
      if (contextInfo.isRoot) this._frameChain.clear()
      await this._topContext.init(this._logger, this._driver)
      await this.framesAppend(framePath)
    }
  }
  /**
   * Perform an operation in the browsing context with required frame chain and return it back after operation is finished
   * @param {Iterable<FrameReference<Driver, Element, Selector>>} path
   * @param {Function} operation
   * @return {Promise<any>} promise which resolve whatever an operation will resolve
   */
  async framesSwitchAndReturn(framePath, operation) {
    if (await this._driver.controller.isNative()) return operation()
    const frameChain = this.frameChain
    await this.frames(framePath)
    try {
      return await operation()
    } finally {
      await this.frames(frameChain)
    }
  }
  /**
   * Perform an operation in the browsing context with appended frame chain and return it back after operation is finished
   * @param {Iterable<FrameReference<Driver, Element, Selector>>} path
   * @param {Function} operation
   * @return {Promise<any>} promise which resolve whatever an operation will resolve
   */
  async framesAppendAndReturn(framePath, operation) {
    if (await this._driver.controller.isNative()) return operation()
    const depth = framePath.length
    await this.framesAppend(framePath)
    try {
      return await operation()
    } finally {
      await this.frameParent(depth)
    }
  }
}

module.exports = EyesBrowsingContext
