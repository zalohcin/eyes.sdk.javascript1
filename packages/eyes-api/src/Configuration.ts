import RectangleSize, {PlainRectangleSize} from './RectangleSize'
import ProxySettings, {PlainProxySettings} from './ProxySettings'
import BatchInfo, {PlainBatchInfo} from './BatchInfo'
import PropertyData, {PlainPropertyData} from './PropertyData'
import ImageMatchSettings, {PlainImageMatchSettings} from './ImageMatchSettings'
import SessionType from './enums/SessionType'
import StitchMode from './enums/StitchMode'
import {isBoolean, isInteger, isString, isArray} from './utils/ArgumentGuard'
import * as TypeUtils from './utils/TypeUtils'

// type PlainConfiguration {
  
// }

export default class Configuration {
  private _showLogs: boolean
  get showLogs() : boolean {
    return this._showLogs
  }
  set showLogs(showLogs: boolean) {
    isBoolean(showLogs, {name: 'showLogs'})
    this._showLogs = showLogs
  }
  getShowLogs() : boolean {
    return this._showLogs
  }
  setShowLogs(showLogs: boolean) : this {
    this.showLogs = showLogs
    return this
  }

  private _appName: string
  get appName() : string {
    return this._appName
  }
  set appName(appName: string) {
    isString(appName, {name: 'appName', strict: false})
    this._appName = appName
  }
  getAppName() : string {
    return this._appName
  }
  setAppName(appName: string) : this {
    this.appName = appName
    return this
  }

  private _testName: string
  get testName() : string {
    return this._testName
  }
  set testName(testName: string) {
    isString(testName, {name: 'testName', strict: false})
    this._testName = testName
  }
  getTestName() : string {
    return this._testName
  }
  setTestName(testName: string) : this {
    this.testName = testName
    return this
  }

  private _displayName: string
  get displayName() : string {
    return this._displayName
  }
  set displayName(displayName: string) {
    isString(displayName, {name: 'displayName', strict: false})
    this._displayName = displayName
  }
  getDisplayName() : string {
    return this._displayName
  }
  setDisplayName(displayName: string) : this {
    this.displayName = displayName
    return this
  }

  private _isDisabled: boolean
  get isDisabled() : boolean {
    return this._isDisabled
  }
  set isDisabled(isDisabled: boolean) {
    isBoolean(isDisabled, {name: 'isDisabled', strict: false})
    this._isDisabled = isDisabled
  }
  getIsDisabled() : boolean {
    return this._isDisabled
  }
  setIsDisabled(isDisabled: boolean) : this {
    this.isDisabled = isDisabled
    return this
  }

  private _matchTimeout: number
  get matchTimeout() : number {
    return this._matchTimeout
  }
  set matchTimeout(matchTimeout: number) {
    isInteger(matchTimeout, {name: 'matchTimeout', gt: 500})
    this._matchTimeout = matchTimeout
  }
  getMatchTimeout() : number {
    return this._matchTimeout
  }
  setMatchTimeout(matchTimeout: number) : this {
    this.matchTimeout = matchTimeout
    return this
  }

  private _sessionType: SessionType
  get sessionType() : SessionType {
    return this._sessionType
  }
  set sessionType(sessionType: SessionType) {
    this._sessionType = sessionType
  }
  getSessionType() : SessionType {
    return this._sessionType
  }
  setSessionType(sessionType: SessionType) : this {
    this.sessionType = sessionType
    return this
  }

  private _viewportSize: RectangleSize
  get viewportSize() : PlainRectangleSize {
    return this._viewportSize
  }
  set viewportSize(viewportSize: PlainRectangleSize) {
    if (!viewportSize) this._viewportSize = undefined
    this._viewportSize = new RectangleSize(viewportSize)
  }
  getViewportSize() : RectangleSize {
    return this._viewportSize
  }
  setViewportSize(viewportSize: PlainRectangleSize|RectangleSize) : this {
    this.viewportSize = viewportSize
    return this
  }

  private _agentId: string
  get agentId() : string {
    return this._agentId
  }
  set agentId(agentId: string) {
    isString(agentId, {name: 'agentId'})
    this._agentId = agentId
  }
  getAgentId() : string {
    return this._agentId
  }
  setAgentId(agentId: string) : this {
    this.agentId = agentId
    return this
  }

  private _apiKey: string
  get apiKey() : string {
    return this._apiKey
  }
  set apiKey(apiKey: string) {
    isString(apiKey, {name: 'apiKey', alpha: true, numeric: true})
    this._apiKey = apiKey
  }
  getApiKey() : string {
    return this._apiKey
  }
  setApiKey(apiKey: string) : this {
    this.apiKey = apiKey
    return this
  }

  private _serverUrl: string
  get serverUrl() : string {
    return this._serverUrl
  }
  set serverUrl(serverUrl: string) {
    isString(serverUrl, {name: 'serverUrl', strict: false})
    this._serverUrl = serverUrl
  }
  getServerUrl() : string {
    return this._serverUrl
  }
  setServerUrl(serverUrl: string) : this {
    this.serverUrl = serverUrl
    return this
  }

  private _proxy: ProxySettings
  get proxy() : PlainProxySettings {
    return this._proxy
  }
  set proxy(proxy: PlainProxySettings) {
    if (!proxy) this._proxy = undefined
    this._proxy = new ProxySettings(proxy)
  }
  getProxy() : ProxySettings {
    return this._proxy
  }
  setProxy(proxy: PlainProxySettings|ProxySettings) : this {
    this.proxy = proxy
    return this
  }

  private _connectionTimeout: number
  get connectionTimeout() : number {
    return this._connectionTimeout
  }
  set connectionTimeout(connectionTimeout: number) {
    isInteger(connectionTimeout, {name: 'connectionTimeout', gte: 0})
    this._connectionTimeout = connectionTimeout
  }
  getConnectionTimeout() : number {
    return this._connectionTimeout
  }
  setConnectionTimeout(connectionTimeout: number) : this {
    this.connectionTimeout = connectionTimeout
    return this
  }

  private _removeSession: boolean
  get removeSession() : boolean {
    return this._removeSession
  }
  set removeSession(removeSession: boolean) {
    isBoolean(removeSession, {name: 'removeSession'})
    this._removeSession = removeSession
  }
  getRemoveSession() : boolean {
    return this._removeSession
  }
  setRemoveSession(removeSession: boolean) : this {
    this.removeSession = removeSession
    return this
  }

  private _batch: BatchInfo
  get batch() : PlainBatchInfo {
    return this._batch
  }
  set batch(batch: PlainBatchInfo) {
    if (!batch) this._batch = undefined
    this._batch = new BatchInfo(batch)
  }
  getBatch() : BatchInfo {
    return this._batch
  }
  setBatch(batch: PlainBatchInfo|BatchInfo) : this {
    this.batch = batch
    return this
  }

  private _properties: PropertyData[]
  get properties() : PlainPropertyData[] {
    return this._properties
  }
  set properties(properties: PlainPropertyData[]) {
    isArray(properties, {name: 'properties'})
    this._properties = properties.map(prop => new PropertyData(prop))
  }
  getProperties() : PropertyData[] {
    return this._properties
  }
  setProperties(properties: PlainPropertyData[]|PropertyData[]) : this {
    this.properties = properties
    return this
  }
  addProperty(name: string, value: string) : this
  addProperty(prop: PlainPropertyData|PropertyData) : this
  addProperty(propOrName: PlainPropertyData|PropertyData|string, value?: string) : this {
    const prop = TypeUtils.isString(propOrName)
      ? new PropertyData({name: propOrName, value})
      : new PropertyData(propOrName)
    this._properties.push(prop)
    return this
  }

  private _baselineEnvName: string
  get baselineEnvName() : string {
    return this._baselineEnvName
  }
  set baselineEnvName(baselineEnvName: string) {
    isString(baselineEnvName, {name: 'baselineEnvName', strict: false})
    this._baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined
  }
  getBaselineEnvName() : string {
    return this._baselineEnvName
  }
  setBaselineEnvName(baselineEnvName: string) : this {
    this.baselineEnvName = baselineEnvName
    return this
  }

  private _environmentName: string
  get environmentName() : string {
    return this._environmentName
  }
  set environmentName(environmentName: string) {
    isString(environmentName, {name: 'environmentName', strict: false})
    this._environmentName = environmentName ? environmentName.trim() : undefined
  }
  getEnvironmentName() : string {
    return this._environmentName
  }
  setEnvironmentName(environmentName: string) : this {
    this.environmentName = environmentName
    return this
  }

  private _branchName: string
  get branchName() : string {
    return this._branchName
  }
  set branchName(branchName: string) {
    isString(branchName, {name: 'branchName'})
    this._branchName = branchName
  }
  getBranchName() : string {
    return this._branchName
  }
  setBranchName(branchName: string) : this {
    this.branchName = branchName
    return this
  }

  private _parentBranchName: string
  get parentBranchName() : string {
    return this._parentBranchName
  }
  set parentBranchName(parentBranchName: string) {
    isString(parentBranchName, {name: 'parentBranchName'})
    this._parentBranchName = parentBranchName
  }
  getParentBranchName() : string {
    return this._parentBranchName
  }
  setParentBranchName(parentBranchName: string) : this {
    this.parentBranchName = parentBranchName
    return this
  }

  private _baselineBranchName: string
  get baselineBranchName() : string {
    return this._baselineBranchName
  }
  set baselineBranchName(baselineBranchName: string) {
    isString(baselineBranchName, {name: 'baselineBranchName'})
    this._baselineBranchName = baselineBranchName
  }
  getBaselineBranchName() : string {
    return this._baselineBranchName
  }
  setBaselineBranchName(baselineBranchName: string) : this {
    this.baselineBranchName = baselineBranchName
    return this
  }

  private _compareWithParentBranch: boolean
  get compareWithParentBranch() : boolean {
    return this._compareWithParentBranch
  }
  set compareWithParentBranch(compareWithParentBranch: boolean) {
    isBoolean(compareWithParentBranch, {name: 'compareWithParentBranch'})
    this._compareWithParentBranch = compareWithParentBranch
  }
  getCompareWithParentBranch() : boolean {
    return this._compareWithParentBranch
  }
  setCompareWithParentBranch(compareWithParentBranch: boolean) : this {
    this.compareWithParentBranch = compareWithParentBranch
    return this
  }

  private _ignoreBaseline: boolean
  get ignoreBaseline() : boolean {
    return this._ignoreBaseline
  }
  set ignoreBaseline(ignoreBaseline: boolean) {
    isBoolean(ignoreBaseline, {name: 'ignoreBaseline'})
    this._ignoreBaseline = ignoreBaseline
  }
  getIgnoreBaseline() : boolean {
    return this._ignoreBaseline
  }
  setIgnoreBaseline(ignoreBaseline: boolean) : this {
    this.ignoreBaseline = ignoreBaseline
    return this
  }

  private _saveFailedTests: boolean
  get saveFailedTests() : boolean {
    return this._saveFailedTests
  }
  set saveFailedTests(saveFailedTests: boolean) {
    isBoolean(saveFailedTests, {name: 'saveFailedTests'})
    this._saveFailedTests = saveFailedTests
  }
  getSaveFailedTests() : boolean {
    return this._saveFailedTests
  }
  setSaveFailedTests(saveFailedTests: boolean) : this {
    this.saveFailedTests = saveFailedTests
    return this
  }

  private _saveNewTests: boolean
  get saveNewTests() : boolean {
    return this._saveNewTests
  }
  set saveNewTests(saveNewTests: boolean) {
    isBoolean(saveNewTests, {name: 'saveNewTests'})
    this._saveNewTests = saveNewTests
  }
  getSaveNewTests() : boolean {
    return this._saveNewTests
  }
  setSaveNewTests(saveNewTests: boolean) : this {
    this.saveNewTests = saveNewTests
    return this
  }

  private _saveDiffs: boolean
  get saveDiffs() : boolean {
    return this._saveDiffs
  }
  set saveDiffs(saveDiffs: boolean) {
    isBoolean(saveDiffs, {name: 'saveDiffs'})
    this._saveDiffs = saveDiffs
  }
  getSaveDiffs() : boolean {
    return this._saveDiffs
  }
  setSaveDiffs(saveDiffs: boolean) : this {
    this.saveDiffs = saveDiffs
    return this
  }

  private _sendDom: boolean
  get sendDom() : boolean {
    return this._sendDom
  }
  set sendDom(sendDom: boolean) {
    isBoolean(sendDom, {name: 'sendDom'})
    this._sendDom = sendDom
  }
  getSendDom() : boolean {
    return this._sendDom
  }
  setSendDom(sendDom: boolean) : this {
    this.sendDom = sendDom
    return this
  }

  private _hostApp: string
  get hostApp() : string {
    return this._hostApp
  }
  set hostApp(hostApp: string) {
    this._hostApp = hostApp ? hostApp.trim() : undefined
  }
  getHostApp() : string {
    return this._hostApp
  }
  setHostApp(hostApp: string) : this {
    this.hostApp = hostApp
    return this
  }

  private _hostOS: string
  get hostOS() : string {
    return this._hostOS
  }
  set hostOS(hostOS: string) {
    this._hostOS = hostOS ? hostOS.trim() : undefined
  }
  getHostOS() : string {
    return this._hostOS
  }
  setHostOS(hostOS: string) : this {
    this.hostOS = hostOS
    return this
  }

  private _hostAppInfo: string
  get hostAppInfo() : string {
    return this._hostAppInfo
  }
  set hostAppInfo(hostAppInfo: string) {
    this._hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined
  }
  getHostAppInfo() : string {
    return this._hostAppInfo
  }
  setHostAppInfo(hostAppInfo: string) : this {
    this.hostAppInfo = hostAppInfo
    return this
  }

  private _hostOSInfo: string
  get hostOSInfo() : string {
    return this._hostOSInfo
  }
  set hostOSInfo(hostOSInfo: string) {
    this._hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined
  }
  getHostOSInfo() : string {
    return this.hostOSInfo
  }
  setHostOSInfo(hostOSInfo: string) : this {
    this.hostOSInfo = hostOSInfo
    return this
  }

  private _deviceInfo: string
  get deviceInfo() : string {
    return this._deviceInfo
  }
  set deviceInfo(deviceInfo: string) {
    this._deviceInfo = deviceInfo ? deviceInfo.trim() : undefined
  }
  getDeviceInfo() : string {
    return this._deviceInfo
  }
  setDeviceInfo(deviceInfo: string) : this {
    this.deviceInfo = deviceInfo
    return this
  }

  private _defaultMatchSettings: ImageMatchSettings
  get defaultMatchSettings() : PlainImageMatchSettings {
    return this._defaultMatchSettings
  }
  set defaultMatchSettings(defaultMatchSettings: PlainImageMatchSettings) {
    // ArgumentGuard.isString(value, 'defaultMatchSettings', false)
    this._defaultMatchSettings = defaultMatchSettings
  }
  getDefaultMatchSettings() : ImageMatchSettings {
    return this.defaultMatchSettings
  }
  setDefaultMatchSettings(defaultMatchSettings: PlainImageMatchSettings|ImageMatchSettings) : this {
    this.defaultMatchSettings = defaultMatchSettings
    return this
  }


  private _forceFullPageScreenshot: boolean
  get forceFullPageScreenshot() : boolean {
    return this._forceFullPageScreenshot
  }
  set forceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    // ArgumentGuard.isString(value, 'forceFullPageScreenshot', false)
    this._forceFullPageScreenshot = forceFullPageScreenshot
  }
  getForceFullPageScreenshot() : boolean {
    return this.forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean) : this {
    this.forceFullPageScreenshot = forceFullPageScreenshot
    return this
  }

  private _waitBeforeScreenshots: number
  get waitBeforeScreenshots() : number {
    return this._waitBeforeScreenshots
  }
  set waitBeforeScreenshots(waitBeforeScreenshots: number) {
    // ArgumentGuard.isString(value, 'waitBeforeScreenshots', false)
    this._waitBeforeScreenshots = waitBeforeScreenshots
  }
  getWaitBeforeScreenshots() : number {
    return this.waitBeforeScreenshots
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number) : this {
    this.waitBeforeScreenshots = waitBeforeScreenshots
    return this
  }

  private _stitchMode: StitchMode
  get stitchMode() : StitchMode {
    return this._stitchMode
  }
  set stitchMode(stitchMode: StitchMode) {
    // ArgumentGuard.isString(value, 'stitchMode', false)
    this._stitchMode = stitchMode
  }
  getStitchMode() : StitchMode {
    return this.stitchMode
  }
  setStitchMode(stitchMode: StitchMode) : this {
    this.stitchMode = stitchMode
    return this
  }

  private _hideScrollbars: boolean
  get hideScrollbars() : boolean {
    return this._hideScrollbars
  }
  set hideScrollbars(hideScrollbars: boolean) {
    // ArgumentGuard.isString(value, 'hideScrollbars', false)
    this._hideScrollbars = hideScrollbars
  }
  getHideScrollbars() : boolean {
    return this.hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean) : this {
    this.hideScrollbars = hideScrollbars
    return this
  }

  private _hideCaret: boolean
  get hideCaret() : boolean {
    return this._hideCaret
  }
  set hideCaret(hideCaret: boolean) {
    // ArgumentGuard.isString(value, 'hideCaret', false)
    this._hideCaret = hideCaret
  }
  getHideCaret() : boolean {
    return this.hideCaret
  }
  setHideCaret(hideCaret: boolean) : this {
    this.hideCaret = hideCaret
    return this
  }

  private _stitchOverlap: number
  get stitchOverlap() : number {
    return this._stitchOverlap
  }
  set stitchOverlap(stitchOverlap: number) {
    // ArgumentGuard.isString(value, 'stitchOverlap', false)
    this._stitchOverlap = stitchOverlap
  }
  getStitchOverlap() : number {
    return this.stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number) : this {
    this.stitchOverlap = stitchOverlap
    return this
  }

  private _concurrentSessions: number
  get concurrentSessions() : number {
    return this._concurrentSessions
  }
  set concurrentSessions(concurrentSessions: number) {
    // ArgumentGuard.isString(value, 'concurrentSessions', false)
    this._concurrentSessions = concurrentSessions
  }
  getConcurrentSessions() : number {
    return this.concurrentSessions
  }
  setConcurrentSessions(concurrentSessions: number) : this {
    this.concurrentSessions = concurrentSessions
    return this
  }

  private _isThrowExceptionOn: boolean
  get isThrowExceptionOn() : boolean {
    return this._isThrowExceptionOn
  }
  set isThrowExceptionOn(isThrowExceptionOn: boolean) {
    // ArgumentGuard.isString(value, 'isThrowExceptionOn', false)
    this._isThrowExceptionOn = isThrowExceptionOn
  }
  getIsThrowExceptionOn() : boolean {
    return this.isThrowExceptionOn
  }
  setIsThrowExceptionOn(isThrowExceptionOn: boolean) : this {
    this.isThrowExceptionOn = isThrowExceptionOn
    return this
  }

  private _browsersInfo: RenderInfo[]
  get browsersInfo() : RenderInfo[] {
    return this._browsersInfo
  }
  set browsersInfo(browsersInfo: RenderInfo[]) {
    // ArgumentGuard.isString(value, 'browsersInfo', false)
    this._browsersInfo = browsersInfo
  }
  getBrowsersInfo() : RenderInfo[] {
    return this.browsersInfo
  }
  setBrowsersInfo(browsersInfo: RenderInfo[]) : this {
    this.browsersInfo = browsersInfo
    return this
  }

  private _visualGridOptions: object
  get visualGridOptions() : object {
    return this._visualGridOptions
  }
  set visualGridOptions(visualGridOptions: object) {
    // ArgumentGuard.isString(value, 'visualGridOptions', false)
    this._visualGridOptions = visualGridOptions
  }
  getVisualGridOptions() : object {
    return this.visualGridOptions
  }
  setVisualGridOptions(visualGridOptions: object) : this {
    this.visualGridOptions = visualGridOptions
    return this
  }

  private _layoutBreakpoints: boolean|number[]
  get layoutBreakpoints() : boolean|number[] {
    return this._layoutBreakpoints
  }
  set layoutBreakpoints(layoutBreakpoints: boolean|number[]) {
    // ArgumentGuard.isString(value, 'layoutBreakpoints', false)
    this._layoutBreakpoints = layoutBreakpoints
  }
  getLayoutBreakpoints() : boolean|number[] {
    return this.layoutBreakpoints
  }
  setLayoutBreakpoints(layoutBreakpoints: boolean|number[]) : this {
    this.layoutBreakpoints = layoutBreakpoints
    return this
  }

  private _disableBrowserFetching: boolean
  get disableBrowserFetching() : boolean {
    return this._disableBrowserFetching
  }
  set disableBrowserFetching(disableBrowserFetching: boolean) {
    // ArgumentGuard.isString(value, 'disableBrowserFetching', false)
    this._disableBrowserFetching = disableBrowserFetching
  }
  getDisableBrowserFetching() : boolean {
    return this.disableBrowserFetching
  }
  setDisableBrowserFetching(disableBrowserFetching: boolean) : this {
    this.disableBrowserFetching = disableBrowserFetching
    return this
  }

  private _dontCloseBatches: boolean
  get dontCloseBatches() : boolean {
    return this._dontCloseBatches
  }
  set dontCloseBatches(dontCloseBatches: boolean) {
    // ArgumentGuard.isString(value, 'dontCloseBatches', false)
    this._dontCloseBatches = dontCloseBatches
  }
  getDontCloseBatches() : boolean {
    return this.dontCloseBatches
  }
  setDontCloseBatches(dontCloseBatches: boolean) : this {
    this.dontCloseBatches = dontCloseBatches
    return this
  }
}