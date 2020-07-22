'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const TypeUtils = require('../utils/TypeUtils')
const EyesContext = require('./EyesContext')
const EyesUtils = require('../EyesUtils')

/**
 * @template TDriver, TElement, TSelector
 * @typedef {Object} SpecDriver
 * @prop {(driver: any) => driver is TDriver} isDriver
 * @prop {(element: any) => element is TElement} isElement
 * @prop {(selector: any) => selector is TSelector} isSelector
 * @prop {(driver: TDriver) => TDriver} [transformDriver]
 * @prop {(element: TElement) => TElement} [transformElement]
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesDriver {
  static specialize(spec) {
    const SpecializedContext = EyesContext.specialize(spec)
    return class SpecializedDriver extends EyesDriver {
      static spec() {
        return spec
      }
      get spec() {
        
      }
    }
  }

  static isDriver(driver) {
    return driver instanceof EyesDriver || this.spec.isDriver(driver)
  }

  static isElement(element) {
    return element instanceof EyesElement || this.spec.isElement(element)
  }

  static isSelector(selector) {
    return this.spec.isSelector(selector)
  }

  static isContext(context) {
    return (
      context instanceof EyesContext ||
      TypeUtils.isInteger(context) ||
      TypeUtils.isString(context) ||
      this.spec.isSelector(context) ||
      this.spec.isElement(context)
    )
  }

  static toFrameworkSelector(selector) {
    return this.spec.toFrameworkSelector(selector)
  }

  static toEyesSelector(selector) {
    return this.spec.toEyesSelector(selector)
  }

  constructor(logger, driver) {
    if (driver instanceof EyesDriver) {
      return driver
    }

    this._logger = logger

    if (this.spec.isDriver(driver)) {
      this._driver = this.spec.transformDriver ? this.spec.transformDriver(driver) : driver
    } else {
      throw new TypeError('EyesDriver constructor called with argument of unknown type!')
    }

    this._mainContext = this.Context.fromReference()
    this._currentContext = this._mainContext
  }

  get spec() {
    throw new TypeError('The class is not specialized. Create a specialize EyesDriver first')
  }

  get proxify() {
    throw new TypeError('The class is not specialized. Create a specialized EyesDriver first')
  }

  get contexts() {
    return {main: this._mainContext, current: this._currentContext}
  }

  async init() {
    await this._mainContext.init(this)
    this._mainContext._context = this._driver
    // this._isStateless = await this.spec.isStateless(this._driver)
    // this._isNative = await this.spec.isNative(this._driver)
    // this._isMobile = await this.spec.isMobile(this._driver)
    // this._isAndroid = await this.spec.isAndroid(this._driver)
    // this._isIOS = await this.spec.isIOS(this._driver)
    return this
  }

  async _init() {
    if (this.isNative) return
    let contextInfo = await EyesUtils.getCurrentContextInfo(this._logger, this._currentContext)
    if (contextInfo.isRoot) {
      this._currentContext = await this._mainContext.init()
      return
    }
    const contextPath = []
    while (!contextInfo.isRoot) {
      await this.switchToParentContext()
      const frameElement = contextInfo.selector
        ? await this._currentContext.findElement({type: 'xpath', selector: contextInfo.selector})
        : await EyesUtils.findFrameByContext(this._logger, this._currentContext, contextInfo)
      if (!frameElement) throw new Error('Unable to find out the chain of frames')
      if (frameChain.current && (await frameChain.current.equals(frameElement))) {
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

  async switchTo(context) {
    if (await this._currentContext.equals(context)) return
    const currentPath = this._currentContext.path
    const requiredPath = context.path

    let diffIndex = -1
    for (const [index, context] of requiredPath.entries()) {
      if (currentPath[index] && !(await currentPath[index].equals(context))) {
        diffIndex = index
        break
      }
    }

    if (diffIndex === 0) {
      throw Error('Impossible to switch, due to required context has different main context')
    } else if (diffIndex < 0) {
      // required path is same as current or it is a sub-path of current

      // required path is same as current
      if (currentPath.length === requiredPath.length) return

      // required path is a sub-path of current
      // chose an optimal way to traverse from current context to target context
      if (currentPath.length - requiredPath.length <= requiredPath.length) {
        await this.parentContext(currentPath.length - requiredPath.length)
      } else {
        await this.mainContext()
        await this.childContext(...requiredPath)
      }
    } else if (currentPath.length - diffIndex <= diffIndex) {
      // required path is different from current or they are partially intersected
      // chose an optimal way to traverse from current context to target context

      await this.parentContext(currentPath.length - diffIndex)
      return this.childContext(...requiredPath.slice(diffIndex))
    } else {
      await this.mainMain()
      await this.childContext(...requiredPath)
    }

    return this._currentContext
  }

  async childContext(...references) {
    // TODO not native platform
    this._logger.verbose('EyesDriver.childContext()')
    for (const reference of references) {
      if (reference === this._mainContext) continue
      this._currentContext = await this._currentContext.context(reference)
      await this._context.focus()
    }
    return this._currentContext
  }

  async switchToMainContext() {
    if (this._isNative) return
    this._logger.verbose('EyesDriver.switchToMainContext()')
    if (!this._isStateless) {
      await this.spec.mainContext(this._currentContext.unwrapped)
    }
    this._currentContext = this._mainContext
    return this._currentContext
  }

  async switchToParentContext(elevation = 1) {
    // TODO not native platform
    this._logger.verbose(`EyesDriver.switchToParentContext(${elevation})`)
    if (this.isInitialized && this._currentContext.path.length <= elevation) {
      return this.mainContext()
    }
    try {
      while (elevation > 0) {
        const context = await this.spec.parentContext(this._currentContext.unwrapped)
        this._currentContext = this._currentContext.parent
        elevation -= 1
      }
    } catch (err) {
      this._logger.verbose('WARNING: error during switch to parent frame', err)
      const path = this._currentContext.path.slice(1, -elevation)
      await this.mainFrame()
      await this.childFrame(...path)
      elevation = 0
    }
    this._currentContext = this._currentContext.path[
      this._currentContext.path.length - elevation - 1
    ]
    return this._currentContext
  }

  async findElement(selector) {
    return this._currentContext.findElement(selector)
  }

  async proxify(driver) {
    return this.spec.proxyDriver(driver, this)
  }
}

module.exports = EyesDriver
