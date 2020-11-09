import * as TypeUtils from './utils/TypeUtils'
import SessionType from './enums/SessionType'
import StitchMode from './enums/StitchMode'
import MatchLevel from './enums/MatchLevel'
import CheckSettingsFluent, {CheckSettings} from './input/CheckSettings'
import ProxySettingsData, {ProxySettings} from './input/ProxySettings'
import ConfigurationData, {Configuration} from './input/Configuration'
import BatchInfoData, {BatchInfo} from './input/BatchInfo'
import RectangleSizeData, {RectangleSize} from './input/RectangleSize'
import {Region} from './input/Region'
import EyesRunner, {ClassicRunner, VisualGridRunner} from './Runners'

export default abstract class Eyes<TDriver = unknown, TElement = unknown, TSelector = unknown> {
  private _config: ConfigurationData
  private _runner: EyesRunner
  private _driver: TDriver

  static setViewportSize<TDriver>(driver: TDriver, viewportSize: RectangleSizeData|RectangleSize) {

  }

  constructor(runner?: EyesRunner, config?: Configuration|ConfigurationData)
  constructor(config: Configuration|ConfigurationData, runner?: EyesRunner)
  constructor(runnerOrConfig?: EyesRunner|Configuration|ConfigurationData, configOrRunner?: Configuration|ConfigurationData|EyesRunner) {
    if (TypeUtils.instanceOf(runnerOrConfig, EyesRunner)) {
      this._runner = runnerOrConfig
      this._config = new ConfigurationData(configOrRunner as Configuration|ConfigurationData)
    } else if (TypeUtils.instanceOf(configOrRunner, EyesRunner)) {
      this._runner = configOrRunner
      this._config = new ConfigurationData(runnerOrConfig as Configuration|ConfigurationData)
    } else {
      this._runner = new ClassicRunner()
      this._config = new ConfigurationData()
    }
  }

  get runner() {
    return this._runner
  }
  getRunner() : EyesRunner {
    return this._runner
  }

  get driver() : TDriver {
    return this._driver
  }
  getDriver() : TDriver {
    return this._driver
  }

  get config() : Configuration {
    return this._config
  }
  set config(config: Configuration) {
    this._config = new ConfigurationData(config)
  }
  getConfiguration() : ConfigurationData {
    return this._config
  }
  setConfiguration(config: Configuration|ConfigurationData) {
    this._config = new ConfigurationData(config)
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

  getRotation() : number {
    return this._rotation
  }
  setRotation(rotation: number) {
    this._rotation = rotation
  }

  getDebugScreenshotsPrefix() {
    // return this._debugScreenshotsProvider.getPrefix()
  }
  setDebugScreenshotsPrefix(debugScreenshotsPrefix: boolean) {
    // this._debugScreenshotsProvider.setPrefix(prefix)
  }

  setDebugScreenshotsPath(debugScreenshotsPath: string) {
    // this._debugScreenshotsProvider.setPath(pathToSave)
  }
  getDebugScreenshotsPath() {
    // return this._debugScreenshotsProvider.getPath()
  }

  getSaveDebugScreenshots() : boolean {
    return this._saveDebugScreenshots
  }
  setSaveDebugScreenshots(saveDebugScreenshots: boolean) {
    this._saveDebugScreenshots = saveDebugScreenshots
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

  // #region CONFIG

  addProperty(name: string, value: string) {
    return this._config.addProperty(name, value)
  }
  clearProperties() {
    return this._config.setProperties([])
  }

  getBatch() : BatchInfoData {
    return this._config.getBatch()
  }
  setBatch(batch: BatchInfo|BatchInfoData) : void
  setBatch(name: string, id?: string, startedAt?: Date|string) : void
  setBatch(batchOrName: BatchInfo|BatchInfoData|string, id?: string, startedAt?: Date|string) {
    if (TypeUtils.isString(batchOrName)) {
      this._config.setBatch({name: batchOrName, id, startedAt: new Date(startedAt)})
    } else {
      this._config.setBatch(batchOrName)
    }
  }

  getApiKey() : string {
    return this._config.getApiKey()
  }
  setApiKey(apiKey: string) {
    this._config.setApiKey(apiKey)
  }

  getTestName() : string {
    return this._config.getTestName()
  }
  setTestName(testName: string) {
    this._config.setTestName(testName)
  }
  
  getAppName() : string {
    return this._config.getAppName()
  }
  setAppName(appName: string) {
    this._config.setAppName(appName)
  }

  getBaselineBranchName() : string {
    return this._config.getBaselineBranchName()
  }
  setBaselineBranchName(baselineBranchName: string) {
    this._config.setBaselineBranchName(baselineBranchName)
  }

  /** @deprecated */
  getBaselineName() : string {
    return this.getBaselineEnvName()
  }
  /** @deprecated */
  setBaselineName(baselineName: string) {
    this.setBaselineEnvName(baselineName)
  }

  getBaselineEnvName() : string {
    return this._config.getBaselineEnvName()
  }
  setBaselineEnvName(baselineEnvName: string) {
    this._config.setBaselineEnvName(baselineEnvName)
  }

  getBranchName() : string {
    return this._config.getBranchName()
  }
  setBranchName(branchName: string) {
    this._config.setBranchName(branchName)
  }

  getHostApp() : string {
    return this._config.getHostApp()
  }
  setHostApp(hostApp: string) {
    this._config.setHostApp(hostApp)
  }

  getHostOS() : string {
    return this._config.getHostOS()
  }
  setHostOS(hostOS: string) {
    this._config.setHostOS(hostOS)
  }

  getHostAppInfo() : string {
    return this._config.getHostAppInfo()
  }
  setHostAppInfo(hostAppInfo: string) {
    this._config.setHostAppInfo(hostAppInfo)
  }

  getHostOSInfo() : string {
    return this._config.getHostOSInfo()
  }
  setHostOSInfo(hostOSInfo: string) {
    this._config.setHostOSInfo(hostOSInfo)
  }

  getDeviceInfo() : string {
    return this._config.getDeviceInfo()
  }
  setDeviceInfo(deviceInfo: string) {
    this._config.setDeviceInfo(deviceInfo)
  }

  setIgnoreCaret(ignoreCaret: boolean) {
    this._config.setIgnoreCaret(ignoreCaret)
  }
  getIgnoreCaret() : boolean {
    return this._config.getIgnoreCaret()
  }

  getIsDisabled() : boolean {
    return this._config.getIsDisabled()
  }
  setIsDisabled(isDisabled: boolean) {
    this._config.setIsDisabled(isDisabled)
  }

  getMatchLevel() : MatchLevel {
    return this._config.getMatchLevel()
  }
  setMatchLevel(matchLevel: MatchLevel) {
    this._config.setMatchLevel(matchLevel)
  }

  getMatchTimeout() : number {
    return this._config.getMatchTimeout()
  }
  setMatchTimeout(matchTimeout: number) {
    this._config.setMatchTimeout(matchTimeout)
  }

  getParentBranchName() : string {
    return this._config.getParentBranchName()
  }
  setParentBranchName(parentBranchName: string) {
    this._config.setParentBranchName(parentBranchName)
  }

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

  getServerUrl() : string {
    return this._config.getServerUrl()
  }
  setServerUrl(serverUrl: string) {
    this._config.setServerUrl(serverUrl)
  }

  getSendDom() : boolean {
    return this._config.getSendDom()
  }
  setSendDom(sendDom: boolean) {
    this._config.setSendDom(sendDom)
  }

  getHideCaret() : boolean {
    return this._config.getHideCaret()
  }
  setHideCaret(hideCaret: boolean) {
    this._config.setHideCaret(hideCaret)
  }

  getHideScrollbars() : boolean {
    return this._config.getHideScrollbars()
  }
  setHideScrollbars(hideScrollbars: boolean) {
    this._config.setHideScrollbars(hideScrollbars)
  }

  getForceFullPageScreenshot() : boolean {
    return this._config.getForceFullPageScreenshot()
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this._config.setForceFullPageScreenshot(forceFullPageScreenshot)
  }

  getWaitBeforeScreenshots() : number {
    return this._config.getWaitBeforeScreenshots()
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number) {
    this._config.setWaitBeforeScreenshots(waitBeforeScreenshots)
  }

  getStitchMode() : StitchMode {
    return this._config.getStitchMode()
  }
  setStitchMode(stitchMode: StitchMode) {
    this._config.setStitchMode(stitchMode)
  }

  getStitchOverlap() : number {
    return this._config.getStitchOverlap()
  }
  setStitchOverlap(stitchOverlap: number) {
    this._config.setStitchOverlap(stitchOverlap)
  }

  // #endregion
}