import * as TypeUtils from './utils/TypeUtils'
import SessionType from './enums/SessionType'
import StitchMode from './enums/StitchMode'
import CheckSettingsFluent, {CheckSettings} from './input/CheckSettings'
import ProxySettingsData, {ProxySettings} from './input/ProxySettings'
import ConfigurationData, {Configuration} from './input/Configuration'
import RectangleSizeData, {RectangleSize} from './RectangleSize'
import {Region} from './Region'
import EyesRunner, {ClassicRunner, VisualGridRunner} from './Runners'

export default abstract class Eyes<TDriver, TContext, TElement, TSelector> {
  private _config: ConfigurationData
  private _runner: EyesRunner

  static setViewportSize<TDriver>(driver: TDriver, viewportSize: RectangleSizeData|RectangleSize) {

  }

  constructor(runner?: EyesRunner, config?: Configuration|ConfigurationData)
  constructor(config: Configuration|ConfigurationData, runner?: EyesRunner)
  constructor(runnerOrConfig?: EyesRunner|Configuration|ConfigurationData, configOrRunner?: Configuration|ConfigurationData|EyesRunner) {
    if (TypeUtils.instanceOf(runnerOrConfig, EyesRunner)) {
      this._runner = runnerOrConfig
      this._config = new ConfigurationData(configOrRunner)
    } else if (TypeUtils.instanceOf(configOrRunner, EyesRunner)) {
      this._runner = configOrRunner
      this._config = new ConfigurationData(runnerOrConfig)
    } else {
      this._runner = new EyesRunner()
      this._config = new ConfigurationData()
    }
  }

  async open(driver: TDriver, config?: Configuration|ConfigurationData) : Promise<TDriver>
  async open(driver: TDriver, appName?: string, testName?: string, viewportSize?: RectangleSize, sessionType?: SessionType) : Promise<TDriver>
  async open(driver: TDriver, configOrAppName?: Configuration|ConfigurationData|string, testName?: string, viewportSize?: RectangleSize, sessionType?: SessionType) : Promise<TDriver> {
    const config: Configuration = {...this._config}
    if (TypeUtils.isObject(configOrAppName)) Object.assign(config, configOrAppName)
    if (TypeUtils.isString(configOrAppName)) config.appName = configOrAppName
    if (TypeUtils.isString(testName)) config.testName = testName
    if (TypeUtils.isString(viewportSize)) config.viewportSize = viewportSize
    if (TypeUtils.isString(sessionType)) config.sessionType = sessionType

    // DO THE THING

    return driver
  }

  async check(name: string, checkSettings: CheckSettingsFluent<TElement, TSelector>) : Promise<void>
  async check(checkSettings?: CheckSettings<TElement, TSelector>) : Promise<void>
  async check(checkSettingsOrName?: CheckSettings<TElement, TSelector>|string, checkSettings?: CheckSettingsFluent<TElement, TSelector>) : Promise<void> {
    if (TypeUtils.isString(checkSettingsOrName)) checkSettings.name(checkSettingsOrName)
    // DO THE Thing
  }
  async checkWindow(name?: string, timeout?: number, isFully: boolean = true) {
    return this.check({name, timeout, isFully})
  }
  async checkFrame(element: TElement|TSelector|string|number, timeout?: number, name?: string) {
    return this.check({name, frames: [element], timeout, isFully: true})
  }
  async checkElement(element: TElement, timeout?: number, name?: string) {
    return this.check({name, region: element, timeout, isFully: true})
  }
  async checkElementBy(selector: TSelector, timeout?: number, name?: string) {
    return this.check({name, region: selector, timeout, isFully: true})
  }
  async checkRegion(region?: Region, name?: string, timeout?: number) {
    return this.check({name, region, timeout})
  }
  async checkRegionByElement(element: TElement, name?: string, timeout?: number) {
    return this.check({name, region: element, timeout})
  }
  async checkRegionBy(selector: TSelector, name?: string, timeout?: number, isFully: boolean = false) {
    return this.check({name, region: selector, timeout, isFully})
  }
  async checkRegionInFrame(frame: TElement|TSelector|string|number, selector: TSelector, timeout?: number, name?: string, isFully: boolean = false) {
    return this.check({name, region: selector, frames: [frame], timeout, isFully})
  }

  async close(throwErr: boolean = true) {
    // DO THE THING
  }

  async abort(throwErr: boolean = true) {
    // Do THE THING
  }

  async locate(visualLocatorSettings: any) {

  }

  async getViewportSize() : Promise<RectangleSizeData> {

  }
  async setViewportSize(viewportSize: RectangleSize|RectangleSizeData) : Promise<void> {

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

  setProxy(proxy: ProxySettings|ProxySettingsData) : void
  setProxy(isDisabled: true) : void
  setProxy(url: string, username?: string, password?: string, isHttpOnly?: boolean) : void
  setProxy(proxyOrUrlOrIsDisabled: ProxySettings|ProxySettingsData|string|true, username?: string, password?: string, isHttpOnly?: boolean) {
    this._config.setProxy(proxyOrUrlOrIsDisabled as string, username, password, isHttpOnly)
    return this
  }

  getProxy() : ProxySettingsData {
    return this._config.getProxy()
  }

  getRotation() : number {
    return this._rotation
  }
  setRotation(rotation: number) {
    this._rotation = rotation
  }

  getSaveDebugScreenshots() : boolean {
    return this._saveDebugScreenshots
  }
  setSaveDebugScreenshots(saveDebugScreenshots: boolean) {
    this._saveDebugScreenshots = saveDebugScreenshots
  }

  getSaveDiffs() : boolean {
    return this._config.saveDiffs
  }
  setSaveDiffs(saveDiffs: boolean) {
    this._config.saveDiffs = saveDiffs
  }

  getSaveNewTests() : boolean {
    return this._config.saveNewTests
  }
  setSaveNewTests(saveNewTests: boolean) {
    this._config.saveNewTests = saveNewTests
  }

  getScaleRatio() : number {
    return this._scaleRatio
  }
  setScaleRatio(scaleRatio: number) {
    this._scaleRatio = scaleRatio
  }

  getScrollRootElement() : TElement|TSelector {
    return this._scrollRootElement
  }
  setScrollRootElement(scrollRootElement: TElement|TSelector) {
    this._scrollRootElement = scrollRootElement
  }

  getServerUrl() : string {
    return this._config.serverUrl
  }
  setServerUrl(serverUrl: string) {
    this._config.serverUrl = serverUrl
  }

  getSendDom() : boolean {
    return this._config.sendDom
  }
  setSendDom(sendDom: boolean) {
    this._config.sendDom = sendDom
  }

  getHideCaret() : boolean {
    return this._config.hideCaret
  }
  setHideCaret(hideCaret: boolean) {
    this._config.hideCaret = hideCaret
  }

  getHideScrollbars() : boolean {
    return this._config.hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean) {
    this._config.hideScrollbars = hideScrollbars
  }

  getForceFullPageScreenshot() : boolean {
    return this._config.forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this._config.forceFullPageScreenshot = forceFullPageScreenshot
  }

  getWaitBeforeScreenshots() : number {
    return this._config.waitBeforeScreenshots
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number) {
    this._config.waitBeforeScreenshots = waitBeforeScreenshots
  }

  getStitchMode() : StitchMode {
    return this._config.stitchMode
  }
  setStitchMode(stitchMode: StitchMode) {
    this._config.stitchMode = stitchMode
  }

  getStitchOverlap() : number {
    return this._config.stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number) {
    this._config.stitchOverlap = stitchOverlap
  }

  // #endregion
}