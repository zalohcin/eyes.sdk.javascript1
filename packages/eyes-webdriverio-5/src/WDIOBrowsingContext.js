const {EyesBrowsingContext, FrameChain, EyesUtils} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const WDIOFrame = require('./WDIOFrame')

class WDIOBrowsingContext extends EyesBrowsingContext {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
    this._frameChain = new FrameChain(this._logger)
  }

  get frameChain() {
    return this._frameChain.clone()
  }

  reset() {
    this._frameChain.clear()
  }

  async frame(reference) {
    if (await this._driver.controller.isMobileDevice()) return
    if (!reference) {
      this._logger.verbose('WDIOBrowsingContext.frame(null)')
      return this.frameDefault()
    }
    const frame = await WDIOFrame.fromReference(reference).init(this._logger, this._driver)
    const result = await this._driver.unwrapped.switchToFrame(frame.element.unwrapped)
    if (frame.scrollRootElement) {
      await frame.scrollRootElement.init(this._driver)
    }
    await this._frameChain.push(frame)
    this._logger.verbose('Done!')
    return result
  }

  async frameDefault() {
    if (await this._driver.controller.isMobileDevice()) return
    this._logger.verbose('WDIOBrowsingContext.frameDefault()')
    const result = await this._driver.unwrapped.switchToFrame(null)
    this._logger.verbose('Done! Switching to default content...')
    if (this._frameChain.size > 0) {
      this._frameChain.clear()
    }
    return result
  }

  async frameParent(elevation = 1) {
    if (await this._driver.controller.isMobileDevice()) return
    this._logger.verbose(`WDIOBrowsingContext.frameParent(${elevation})`)
    let result
    while (elevation-- > 0) {
      result = await this._driver.unwrapped.switchToParentFrame()
      this._logger.verbose('Done! Switching to parent frame..')
      if (this._frameChain.size > 0) {
        this._frameChain.pop()
      }
    }
    return result
  }

  async frames(path) {
    if (await this._driver.controller.isMobileDevice()) return
    const currentPath = Array.from(this._frameChain)
    const requiredPath = Array.from(path || [])
    if (currentPath.length === 0) return this.framesAppend(requiredPath)
    if (requiredPath.length === 0) return this.frameDefault()
    const diffIndex = requiredPath.findIndex(
      (frame, index) => !WDIOFrame.equals(currentPath[index], frame),
    )
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

  async framesAppend(path) {
    if (await this._driver.controller.isMobileDevice()) return
    this._logger.verbose('WDIOBrowsingContext.framesAppend(path)')
    for (const frameReference of path) {
      await this.frame(frameReference)
    }
    this._logger.verbose('Done switching into nested frames!')
  }

  async framesRefresh() {
    if (await this._driver.controller.isMobileDevice()) return
    let contextInfo = await EyesUtils.getCurrentContextInfo(this._logger, this._driver.executor)
    if (contextInfo.isRoot) {
      this._frameChain.clear()
    } else {
      const framePath = []
      const frameChain = this._frameChain.clone()
      const lastTrackedFrame = frameChain.current ? frameChain.current.element : null
      while (!contextInfo.isRoot) {
        await this._driver.unwrapped.switchToParentFrame()
        let frameElement
        if (contextInfo.selector) {
          frameElement = await this._driver.finder.findElement(contextInfo.selector)
        } else {
          const {element, selector} = await EyesUtils.findFrameByContext(
            this._logger,
            this._driver,
            contextInfo,
            WDIOWrappedElement.equals,
          )
          frameElement = new WDIOWrappedElement(this._logger, this._driver, element, selector)
        }
        if (!frameElement) throw new Error('Unable to find out the chain of frames')
        if (WDIOWrappedElement.equals(frameElement, lastTrackedFrame)) {
          await this.frameParent(frameChain.size - 1)
          framePath.unshift(...frameChain)
        } else {
          framePath.unshift(frameElement)
        }
        contextInfo = await EyesUtils.getCurrentContextInfo(this._logger, this._driver.executor)
      }
      if (contextInfo.isRoot) this._frameChain.clear()
      await this.framesAppend(framePath)
    }
  }

  async framesSwitchAndReturn(framePath, operation) {
    if (await this._driver.controller.isMobileDevice()) return operation()
    const frameChain = this.frameChain
    await this.frames(framePath)
    try {
      return await operation()
    } finally {
      await this.frames(frameChain)
    }
  }

  async framesAppendAndReturn(framePath, operation) {
    if (await this._driver.controller.isMobileDevice()) return operation()
    const depth = framePath.length
    await this.framesAppend(framePath)
    try {
      return await operation()
    } finally {
      await this.frameParent(depth)
    }
  }
}

module.exports = WDIOBrowsingContext
