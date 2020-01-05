'use strict'

const {ArgumentGuard} = require('@applitools/eyes-common')
const {PositionProvider} = require('@applitools/eyes-sdk-core')

const {EyesSeleniumUtils} = require('../EyesSeleniumUtils')
const {CssTranslatePositionMemento} = require('./CssTranslatePositionMemento')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is useful when we want to stitch a page which
 * contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger
   * @param {SeleniumJavaScriptExecutor} executor
   * @param {WebElement} scrollRootElement
   */
  constructor(logger, executor, scrollRootElement) {
    super()

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    ArgumentGuard.notNull(scrollRootElement, 'scrollRootElement')

    this._logger = logger
    this._executor = executor
    this._scrollRootElement = scrollRootElement

    /** @type {Location} */
    this._lastSetPosition = undefined

    this._logger.verbose('creating CssTranslatePositionProvider')
  }

  /**
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose(`position to return: ${this._lastSetPosition}`)
    return this._lastSetPosition
  }

  /**
   * @inheritDoc
   */
  async setPosition(location) {
    ArgumentGuard.notNull(location, 'location')
    this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`)

    // TODO
    // Remove this.. came form selenium ?
    // await this._executor.executeScript(
    //   `arguments[0].style.transform = 'translate(10px, -${location.getY()}px)';`,
    //   this._scrollRootElement,
    // )

    let translate = `translate(-${location.getX()}px, -${location.getY()}px)`
    if (location.getX() === 0 && location.getY() === 0) {
      translate = ''
    }

    const bannerIndex = await this._executor.executeScript(
      `arguments[0].style.transform = '${translate}'; return document.body.children.length;`,
      this._scrollRootElement,
    )
    await this._fixTestcafeBanner(bannerIndex, -location.getX(), -location.getY())

    this._logger.verbose('Done!')
    this._lastSetPosition = location
    return this._lastSetPosition
  }

  async _fixTestcafeBanner(bannerIndex, transformLeft, transformTop) {
    this._logger.verbose(`CssTranslatePositionProvider - fixing banner at index: ${bannerIndex}`)

    const fixTestcafeBanner = new Function(`
      const testCafeBanner = document.body.children[${bannerIndex}].firstChild.firstChild
      testCafeBanner.style.setProperty('top', 'calc(100vh - 52px - 15px - ${transformTop}px)')
      testCafeBanner.style.setProperty('bottom', 'auto')
      testCafeBanner.style.setProperty('left', '-${transformLeft}px')
    `)

    try {
      await this._executor.executeScript(fixTestcafeBanner, this._scrollRootElement)
      this._logger.verbose('CssTranslatePositionProvider - fixed testcafe banner')
    } catch (e) {
      this._logger.verbose('CssTranslatePositionProvider - failed to fix testcafe banner', e)
    }
  }

  /**
   * @inheritDoc
   */
  async getEntireSize() {
    const entireSize = await EyesSeleniumUtils.getEntireElementSize(
      this._executor,
      this._scrollRootElement,
    )
    this._logger.verbose('CssTranslatePositionProvider - Entire size:', entireSize)
    return entireSize
  }

  /**
   * @inheritDoc
   * @return {Promise<CssTranslatePositionMemento>}
   */
  async getState() {
    let transforms = await this._executor.executeScript(
      'return arguments[0].style.transform;',
      this._scrollRootElement,
    )
    // TODO
    // maybe we can do something else here ? check, since if later we
    // try to update to this translate we set it to "" as well..
    if (!transforms) {
      transforms = 'translate(0px, 0px)'
    }
    this._logger.verbose('Current transform', transforms)
    return new CssTranslatePositionMemento(transforms, this._lastSetPosition)
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {CssTranslatePositionMemento} state - The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    let transform = state.getTransform()
    if (transform === 'translate(0px, 0px)') {
      transform = ''
    }

    const script =
      'var originalTransform = arguments[0].style.transform;' +
      `arguments[0].style.transform = '${transform}';` +
      'return [originalTransform, document.body.children.length];'

    const [, bannerIndex] = await this._executor.executeScript(script, this._scrollRootElement)
    await this._fixTestcafeBanner(bannerIndex, 0, 0)
    this._logger.verbose('Transform (position) restored.')
    this._lastSetPosition = state.getPosition()
  }

  /**
   * @return {WebElement}
   */
  getScrolledElement() {
    return this._scrollRootElement
  }
}

exports.CssTranslatePositionProvider = CssTranslatePositionProvider
