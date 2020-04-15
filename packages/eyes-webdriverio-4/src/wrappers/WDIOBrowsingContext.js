const {
  TypeUtils,
  RectangleSize,
  Location,
  EyesBrowsingContext,
  FrameChain,
  Frame,
  EyesUtils,
} = require('@applitools/eyes-sdk-core')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const By = require('../By')
const WDIOElement = require('./WDIOElement')

class WDIOBrowsingContext extends EyesBrowsingContext {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
    this._frameChain = new FrameChain(this._logger)

    this._scrollPosition = new ScrollPositionProvider(this._logger, this._driver.executor)
  }

  get frameChain() {
    return this._frameChain.clone()
  }

  reset() {
    this._frameChain.clear()
  }

  async getFrameInfo() {
    return this._driver.executor.executeScript(`
      var isCORS, isRoot;
      try {
        isRoot = window.top.document === window.document;
        isCORS = false;
      } catch(err) {
        isRoot = false;
        isCORS = true;
      }
      return {isCORS: isCORS,isRoot: isRoot, frameElement: window.frameElement, contentDocument: document};
    `)
  }

  async frameInit(element) {
    const [
      rect,
      [clientWidth, clientHeight],
      [borderLeftWidth, borderTopWidth],
      originalOverflow,
      originalLocation,
    ] = await Promise.all([
      element.getRect(),
      element.getProperty('clientWidth', 'clientHeight'),
      element.getCssProperty('border-left-width', 'border-top-width'),
      element.getOverflow(),
      EyesUtils.getScrollLocation(this._logger, this._driver.executor),
    ])

    return new Frame(this._logger, {
      driver: this._driver,
      element,
      size: new RectangleSize(Math.round(rect.getWidth()), Math.round(rect.getHeight())),
      innerSize: new RectangleSize(Math.round(clientWidth), Math.round(clientHeight)),
      location: new Location(
        Math.round(rect.getLeft() + Number.parseFloat(borderLeftWidth)),
        Math.round(rect.getTop() + Number.parseFloat(borderTopWidth)),
      ),
      originalLocation,
      originalOverflow,
    })
  }

  async frame(arg) {
    if (!arg) {
      this._logger.verbose('WDIOBrowsingContext.frame(null)')
      return this.frameDefault()
    }

    let frame
    if (TypeUtils.isInteger(arg)) {
      const frameIndex = arg
      this._logger.verbose(`WDIOBrowsingContext.frame(${frameIndex})`)
      this._logger.verbose('Getting frames list...')
      const frameElements = await this._driver.finder.findElements('frame, iframe')
      if (frameIndex > frameElements.length) {
        throw new TypeError(`Frame index [${frameIndex}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      frame = await this.frameInit(frameElements[frameIndex])
    } else if (TypeUtils.isString(arg)) {
      const frameNameOrId = arg
      this._logger.verbose(`WDIOBrowsingContext.frame(${frameNameOrId})`)
      this._logger.verbose('Getting frames by name...')
      let frameElement = await this._driver.finder.findElement(By.name(frameNameOrId))
      if (!frameElement) {
        this._logger.verbose('No frames Found! Trying by id...')
        frameElement = await this._driver.finder.findElement(By.id(frameNameOrId))
        if (!frameElement) {
          throw new TypeError(`No frame with name or id '${frameNameOrId}' exists!`)
        }
      }
      frame = await this.frameInit(frameElement)
    } else if (arg instanceof WDIOElement) {
      this._logger.verbose('WDIOBrowsingContext.frame(wdioElement)')
      frame = await this.frameInit(arg)
    } else if (WDIOElement.isCompatible(arg)) {
      this._logger.verbose('WDIOBrowsingContext.frame(wdioElement)')
      frame = await this.frameInit(new WDIOElement(this._logger, this._driver, arg))
    } else if (arg instanceof Frame) {
      frame = arg
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }

    this._logger.verbose('Done! Switching to frame...')
    const result = await this._driver.unwrapped.frame(frame.element.unwrapped)
    await this._frameChain.push(frame)
    this._logger.verbose('Done!')
    return result
  }

  async frameDefault() {
    this._logger.verbose('WDIOBrowsingContext.frameDefault()')
    const result = await this._driver.unwrapped.frame()
    this._logger.verbose('Done! Switching to default content...')
    if (this._frameChain.size > 0) {
      this._frameChain.clear()
    }
    return result
  }

  async frameParent(elevation = 1) {
    this._logger.verbose(`WDIOBrowsingContext.frameParent(${elevation})`)
    let result
    while (elevation-- > 0) {
      result = await this._driver.unwrapped.frameParent()
      this._logger.verbose('Done! Switching to parent frame..')
      if (this._frameChain.size > 0) {
        this._frameChain.pop()
      }
    }
    return result
  }

  async frames(path) {
    const currentPath = this._frameChain.toArray()
    const requiredPath = Array.from(path || [])
    if (currentPath.length <= 0) return this.framesAppend(requiredPath)
    if (requiredPath.length <= 0) return this.frameDefault()
    const diffIndex = requiredPath.findIndex(
      (frame, index) => !Frame.equals(currentPath[index], frame),
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
    this._logger.verbose('WDIOBrowsingContext.framesAppend(path)')
    for (const frameReference of path) {
      await this.frame(frameReference)
    }
    this._logger.verbose('Done switching into nested frames!')
  }

  async framesDoScroll(frameChain) {
    this._logger.verbose('WDIOBrowsingContext.framesDoScroll(frameChain)')
    await this.frameDefault()
    this._frameDefaultPositionMemento = await this._scrollPosition.getState()
    for (const frame of frameChain) {
      this._logger.verbose('Scrolling by parent scroll position...')
      const frameLocation = frame.location
      await this._scrollPosition.setPosition(frameLocation)
      await this.frame(frame)
    }
    this._logger.verbose('Done switching into nested frames!')
  }

  async framesRefresh() {
    let frameInfo = await this.getFrameInfo()
    if (frameInfo.isRoot) {
      this._frameChain.clear()
    } else {
      const framePath = []
      const lastTrackedFrame = this._frameChain.current
        ? this._frameChain.current.element.elementId
        : null
      while (!frameInfo.isRoot) {
        let frameTarget
        await this.frameParent()
        if (frameInfo.isCORS) {
          const frameElements = await this._driver.finder.findElements('frame, iframe')
          for (const frameElement of frameElements) {
            await this.frame(frameElement)
            const contentDocument = await this._driver.executor.executeScript('return document')
            await this.frameParent()
            if (WDIOElement.equals(contentDocument, frameInfo.contentDocument)) {
              frameTarget = frameElement
              break
            }
          }
        } else {
          frameTarget = frameInfo.frameElement
        }
        if (!frameTarget) throw new Error('Unable to find out the chain of frames')
        if (WDIOElement.equals(frameTarget, lastTrackedFrame)) break
        const xpath = await EyesUtils.getElementXpath(
          this._logger,
          this._driver.executor,
          frameTarget,
        )
        framePath.unshift(new WDIOElement(this._logger, this._driver, frameTarget, `/${xpath}`))
        frameInfo = await this.getFrameInfo()
      }
      if (frameInfo.isRoot) this._frameChain.clear()
      await this.framesAppend(framePath)
    }
  }

  async framesToAndFro(toPath, operation) {
    const originalFrameChain = this.frameChain
    await this.frames(toPath)
    try {
      return await operation(toPath)
    } finally {
      await this.frames(originalFrameChain)
    }
  }
}

module.exports = WDIOBrowsingContext
