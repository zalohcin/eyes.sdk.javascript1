const {
  TypeUtils,
  EyesJsBrowserUtils,
  RectangleSize,
  Location,
  EyesBrowsingContext,
  FrameChain,
  Frame,
} = require('@applitools/eyes-sdk-core')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const By = require('../By')
const WDIOElement = require('./WDIOElement')
const EyesWDIOUtils = require('../EyesWDIOUtils')

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
      EyesWDIOUtils.getCurrentScrollPosition(this._driver.executor),
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
      this._logger.verbose('WDIOTBrowsingContext.frame(null)')
      return this.frameDefault()
    }

    let frame
    if (TypeUtils.isInteger(arg)) {
      const frameIndex = arg
      this._logger.verbose(`WDIOTBrowsingContext.frame(${frameIndex})`)
      this._logger.verbose('Getting frames list...')
      const frameElements = await this._driver.finder.findElements('frame, iframe')
      if (frameIndex > frameElements.length) {
        throw new TypeError(`Frame index [${frameIndex}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      frame = await this.frameInit(frameElements[frameIndex])
    } else if (TypeUtils.isString(arg)) {
      const frameNameOrId = arg
      this._logger.verbose(`WDIOTBrowsingContext.frame(${frameNameOrId})`)
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
      this._logger.verbose('WDIOTBrowsingContext.frame(wdioElement)')
      frame = await this.frameInit(arg)
    } else if (WDIOElement.isCompatible(arg)) {
      this._logger.verbose('WDIOTBrowsingContext.frame(wdioElement)')
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
    this._logger.verbose('WDIOTBrowsingContext.frameDefault()')
    const result = await this._driver.unwrapped.frame()
    this._logger.verbose('Done! Switching to default content...')
    if (this._frameChain.size > 0) {
      this._frameChain.clear()
    }
    return result
  }

  async frameParent() {
    this._logger.verbose('WDIOTBrowsingContext.frameParent()')
    const result = await this._driver.unwrapped.frameParent()
    this._logger.verbose('Done! Switching to parent frame..')
    if (this._frameChain.size > 0) {
      this._frameChain.pop()
    }
    return result
  }

  async frames(arg) {
    if (this._frameChain.size > 0) {
      await this.frameDefault()
    }
    await this.framesAppend(arg)
  }

  async framesAppend(arg) {
    if (arg instanceof FrameChain) {
      const frameChain = arg
      this._logger.verbose('WDIOTBrowsingContext.frames(frameChain)')
      for (const frame of frameChain) {
        await this.frame(frame.element)
      }
    } else if (TypeUtils.isArray(arg)) {
      const framePath = arg
      this._logger.verbose('WDIOTBrowsingContext.frames(framesPath)')
      for (const frameReference of framePath) {
        await this.frame(frameReference)
      }
    }
    this._logger.verbose('Done switching into nested frames!')
  }

  async framesDoScroll(frameChain) {
    this._logger.verbose('WDIOTBrowsingContext.framesDoScroll(frameChain)')
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
        const xpath = await EyesJsBrowserUtils.getElementXpath(this._driver.executor, frameTarget)
        framePath.unshift(new WDIOElement(this._logger, this._driver, frameTarget, `/${xpath}`))
        frameInfo = await this.getFrameInfo()
      }
      if (frameInfo.isRoot) this._frameChain.clear()
      await this.framesAppend(framePath)
    }
  }
}

module.exports = WDIOBrowsingContext
