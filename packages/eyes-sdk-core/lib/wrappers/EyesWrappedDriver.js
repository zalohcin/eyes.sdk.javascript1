'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const EyesJsExecutor = require('./EyesJsExecutor')
const EyesBrowsingContext = require('./EyesBrowsingContext')
const EyesElementFinder = require('./EyesElementFinder')
const EyesDriverController = require('./EyesDriverController')

/**
 * @typedef {import('../logging/Logger')} Logger
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesJsExecutor').SpecJsExecutor<TDriver, TElement, TSelector>} SpecJsExecutor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesBrowsingContext').SpecBrowsingContext<TDriver, TElement, TSelector>} SpecBrowsingContext
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesElementFinder').SpecElementFinder<TDriver, TElement, TSelector>} SpecElementFinder
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesDriverController').SpecDriverController<TDriver, TElement, TSelector>} SpecDriverController
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {SpecJsExecutor<TDriver, TElement, TSelector> & SpecBrowsingContext<TDriver, TElement, TSelector> & SpecElementFinder<TDriver, TElement, TSelector> & SpecDriverController<TDriver, TElement, TSelector>} SpecDriver
 */

/**
 * @typedef DriverOverrides
 * @prop {(reference) => Promise<*>} switchToFrame
 * @prop {() => Promise<*>} switchToParentFrame
 * @prop {(url: string) => Promise<*>} visit
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (logger: Logger, driver: TDriver) => TDriver & EyesWrappedDriver<TDriver, TElement, TSelector>} EyesWrappedDriverCtor
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesWrappedDriver {
  /**
   * @template TDriver, TElement, TSelector
   * @param {SpecDriver<TDriver, TElement, TSelector>} spec - specifications for the specific framework
   * @param {DriverOverrides} overrides - specifications for the specific framework
   * @return {EyesWrappedDriverCtor<TDriver, TElement, TSelector>}
   */
  static specialize(spec, overrides) {
    const BrowsingContext = EyesBrowsingContext.specialize(spec)
    const JsExecutor = EyesJsExecutor.specialize(spec)
    const ElementFinder = EyesElementFinder.specialize(spec)
    const DriverController = EyesDriverController.specialize(spec)
    return class extends EyesWrappedDriver {
      /** @override */
      static get overrides() {
        return overrides || {}
      }
      /** @override */
      get overrides() {
        return overrides || {}
      }
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get specs() {
        return spec
      }
      /** @override */
      static get JsExecutor() {
        return JsExecutor
      }
      /** @override */
      get JsExecutor() {
        return JsExecutor
      }
      /** @override */
      static get BrowsingContext() {
        return BrowsingContext
      }
      /** @override */
      get BrowsingContext() {
        return BrowsingContext
      }
      /** @override */
      static get ElementFinder() {
        return ElementFinder
      }
      /** @override */
      get ElementFinder() {
        return ElementFinder
      }
      /** @override */
      static get DriverController() {
        return DriverController
      }
      /** @override */
      get DriverController() {
        return DriverController
      }
    }
  }
  /** @type {Object<string, Function>} */
  static get overrides() {
    return {}
  }
  /**
   * @type {SpecDriver}
   */
  static get spec() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesJsExecutor} */
  static get JsExecutor() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesBrowsingContext} */
  static get BrowsingContext() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesElementFinder} */
  static get ElementFinder() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesDriverController} */
  static get DriverController() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {Object<string, Function>} */
  get overrides() {
    return {}
  }
  /** @type {SpecDriver<TDriver, TElement, TSelector>} */
  get spec() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesJsExecutor} */
  get JsExecutor() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesBrowsingContext} */
  get BrowsingContext() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesElementFinder} */
  get ElementFinder() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {typeof EyesDriverController} */
  get DriverController() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /**
   * Construct wrapped driver instance and initialize all of helpers interfaces
   * @param {Logger} logger - logger instance
   * @param {TDriver} driver - specific driver object for the framework
   */
  constructor(logger, driver) {
    ArgumentGuard.notNull(driver, 'driver')
    if (driver instanceof EyesWrappedDriver) {
      return driver
    }
    this._logger = logger
    this._driver = this.specs.prepareDriver ? this.specs.prepareDriver(driver) : driver

    this._executor = new this.JsExecutor(this._logger, this)
    this._finder = new this.ElementFinder(this._logger, this)
    this._context = new this.BrowsingContext(this._logger, this)
    this._controller = new this.DriverController(this._logger, this)

    /**
     * The set of function which should be use to override unwrapped driver functionality
     * @type {DriverOverrides}
     */
    const overrides = this.overrides
    const proxies = {
      switchToFrame: reference => this._context.frame(reference),
      switchToParentFrame: () => this._context.frameParent(),
      visit: url => {
        this._context.reset()
        return this.specs.visit(this._driver, url)
      },
    }
    this._proxy = new Proxy(this, {
      get(target, key, receiver) {
        // WORKAROUND we couldn't return Promise-like object from the async function
        if (key === 'then') return undefined
        if (key in overrides) return overrides[key].bind(receiver, proxies)
        if (key in target) return Reflect.get(target, key, receiver)
        return Reflect.get(target._driver, key)
      },
    })
    return this._proxy
  }
  /**
   * Unwrapped driver for specific SDK
   * @type {TDriver}
   */
  get unwrapped() {
    return this._driver
  }
  /**
   * Implementation of JavaScript executor interface for specific SDK
   * @type {EyesJsExecutor<TDriver, TElement, TSelector>}
   */
  get executor() {
    return this._executor
  }
  /**
   * Implementation of browsing context switcher interface for specific SDK
   * @type {EyesBrowsingContext<TDriver, TElement, TSelector>}
   */
  get context() {
    return this._context
  }
  /**
   * Implementation of element finder interface for specific SDK
   * @type {EyesElementFinder<TDriver, TElement, TSelector>}
   */
  get finder() {
    return this._finder
  }
  /**
   * Implementation of driver controller interface for specific SDK
   * @type {EyesDriverController<TDriver, TElement, TSelector>}
   */
  get controller() {
    return this._controller
  }
}

module.exports = EyesWrappedDriver
