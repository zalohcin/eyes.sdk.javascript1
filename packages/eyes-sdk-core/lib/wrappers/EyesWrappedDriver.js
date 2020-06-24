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
 * @template Driver, Element, Selector
 * @typedef {import('./EyesJsExecutor').SpecJsExecutor<Driver, Element, Selector>} SpecJsExecutor
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesBrowsingContext').SpecBrowsingContext<Driver, Element, Selector>} SpecBrowsingContext
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesElementFinder').SpecElementFinder<Driver, Element, Selector>} SpecElementFinder
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesDriverController').SpecDriverController<Driver, Element, Selector>} SpecDriverController
 */

/**
 * @template Driver, Element, Selector
 * @typedef {SpecJsExecutor<Driver, Element, Selector> & SpecBrowsingContext<Driver, Element, Selector> & SpecElementFinder<Driver, Element, Selector> & SpecDriverController<Driver, Element, Selector>} SpecDriver
 */

/**
 * @typedef DriverOverrides
 * @prop {(reference) => Promise<*>} switchToFrame
 * @prop {() => Promise<*>} switchToParentFrame
 * @prop {(url: string) => Promise<*>} visit
 */

/**
 * @template Driver - Driver provided by wrapped framework
 * @template Element - Element provided by wrapped framework
 * @template Selector - Selector supported by framework
 */
class EyesWrappedDriver {
  /**
   * @template Driver, Element, Selector
   * @param {SpecDriver<Driver, Element, Selector>} spec - specifications for the specific framework
   * @param {DriverOverrides} overrides - specifications for the specific framework
   * @return {typeof EyesWrappedDriver} specialized version of this class
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
  /** @type {SpecDriver<Driver, Element, Selector>} */
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
   * @param {Driver} driver - specific driver object for the framework
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
   * @type {Driver}
   */
  get unwrapped() {
    return this._driver
  }
  /**
   * Implementation of JavaScript executor interface for specific SDK
   * @type {EyesJsExecutor<Driver, Element, Selector>}
   */
  get executor() {
    return this._executor
  }
  /**
   * Implementation of browsing context switcher interface for specific SDK
   * @type {EyesBrowsingContext<Driver, Element, Selector>}
   */
  get context() {
    return this._context
  }
  /**
   * Implementation of element finder interface for specific SDK
   * @type {EyesElementFinder<Driver, Element, Selector>}
   */
  get finder() {
    return this._finder
  }
  /**
   * Implementation of driver controller interface for specific SDK
   * @type {EyesDriverController<Driver, Element, Selector>}
   */
  get controller() {
    return this._controller
  }
}

module.exports = EyesWrappedDriver
