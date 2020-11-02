import Configuration, {PlainConfiguration} from './Configuration'
import CheckSettings, {PlainCheckSettings} from './CheckSettings'
import RectangleSize, {PlainRectangleSize} from './RectangleSize'
import Region, {PlainRegion} from './Region'
import ClassicRunner from './ClassicRunner'
import VisualGridRunner from './VisualGridRunner'

export default class Eyes {
  #config: Configuration
  #runner: EyesRunner
  #driver: any

  static setViewportSize(driver: any, viewportSize: RectangleSize|PlainRectangleSize) {

  }

  constructor(serverUrlOrRunner?: string|EyesRunner, isDisabled?: boolean, runner?: EyesRunner = new ClassicRunner()) {
    if (serverUrlOrRunner instanceof EyesRunner) {
      this.#runner = serverUrlOrRunner
    } else {
      this.#config.serverUrl = serverUrlOrRunner
      this.#config.isDisabled = isDisabled
      this.#runner = runner
    }
  }
  async open(driver, appNameOrConfig?: string|Configuration|PlainConfiguration, testName?: string, viewportSize?: RectangleSize|PlainRectangleSize, sessionType?: SessionType) {

  }
  async check(nameOrCheckSettings?: string|CheckSettings|PlainCheckSettings, checkSettings?: CheckSettings|PlainCheckSettings) {

  }
  async checkWindow(name?: string, timeout?: number, isFully: boolean = true) {
    return this.check({name, timeout, isFully})
  }
  async checkFrame(element: any, timeout?: number, name?: string) {
    return this.check({name, frames: [element], timeout, isFully: true})
  }
  async checkElement(element: any, timeout?: number, name?: string) {
    return this.check({name, region: element, timeout, isFully: true})
  }
  async checkElementBy(selector: any, timeout?: number, name?: string) {
    return this.check({name, region: selector, timeout, isFully: true})
  }
  async checkRegionByElement(element: any, name?: string, timeout?: number) {
    return this.check({name, region: element, timeout})
  }
  async checkRegion(region?: Region, name?: string, timeout?: number) {
    return this.check({name, region, timeout})
  }
  async checkRegionBy(selector: any, name?: string, timeout?: number, isFully: boolean = false) {
    return this.check({name, region: selector, timeout, isFully})
  }
  async checkRegionInFrame(frameReference: any, selector?: any, timeout?: number, name?: string, isFully: boolean = false) {
    return this.check({name, region: selector, frames: [frameReference], timeout, isFully})
  }
  async close(throwErr: boolean = true) {

  }
  async abort(throwErr: boolean = true) {

  }
  async locale(visualLocatorSettings: any) {

  }

  async getViewportSize() : Promise<RectangleSize> {

  }
  async setViewportSize() : Promise<void> {

  }
  async getTitle() : Promise<string> {

  }

  getRunner() {
    return this.#runner
  }
  getDriver() {
    return this.#driver
  }

  // #region CONFIG

  getHideCaret() : boolean {
    return this.#config.hideCaret
  }
  setHideCaret(hideCaret: boolean) {
    this.#config.hideCaret = hideCaret
  }
  getHideScrollbars() : boolean {
    return this.#config.hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean) {
    this.#config.hideScrollbars = hideScrollbars
  }
  getForceFullPageScreenshot() : boolean {
    return this.#config.forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this.#config.forceFullPageScreenshot = forceFullPageScreenshot
  }
  getWaitBeforeScreenshot() : number {
    return this.#config.waitBeforeScreenshot
  }
  setWaitBeforeScreenshot(waitBeforeScreenshot: number) {
    this.#config.waitBeforeScreenshot = waitBeforeScreenshot
  }
  getStitchMode() : StitchMode {
    return this.#config.stitchMode
  }
  setStitchMode(stitchMode: StitchMode) {
    this.#config.stitchMode = stitchMode
  }
  getStitchOverlap() : number {
    return this.#config.stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number) {
    this.#config.stitchOverlap = stitchOverlap
  }

  // #endregion
}