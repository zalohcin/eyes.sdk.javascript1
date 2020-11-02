import RectangleSize, {PlainRectangleSize} from './RectangleSize'
import SessionType from './enums/SessionType'

type PlainConfiguration {
  
}

export default class Configuration {
  #showLogs: boolean
  get showLogs() : boolean {
    return this.#showLogs
  }
  set showLogs(showLogs: boolean) {
    // ArgumentGuard.isBoolean(value, 'showLogs')
    this.#showLogs = showLogs
  }
  getShowLogs() : boolean {
    return this.showLogs
  }
  setShowLogs(showLogs: boolean) : this {
    this.showLogs = showLogs
    return this
  }

  #appName: string
  get appName() : string {
    return this.#appName
  }
  set appName(appName: string) {
    // ArgumentGuard.isString(value, 'appName', false)
    this.#appName = appName
  }
  getAppName() : string {
    return this.appName
  }
  setAppName(appName: string) : this {
    this.appName = appName
    return this
  }

  #testName: string
  get testName() : string {
    return this.#testName
  }
  set testName(testName: string) {
    // ArgumentGuard.isString(value, 'testName', false)
    this.#testName = testName
  }
  getTestName() : string {
    return this.testName
  }
  setTestName(testName: string) : this {
    this.testName = testName
    return this
  }

  #displayName: string
  get displayName() : string {
    return this.#displayName
  }
  set displayName(displayName: string) {
    // ArgumentGuard.isString(value, 'displayName', false)
    this.#displayName = displayName
  }
  getDisplayName() : string {
    return this.displayName
  }
  setDisplayName(displayName: string) : this {
    this.displayName = displayName
    return this
  }

  #isDisabled: boolean
  get isDisabled() : boolean {
    return this.#isDisabled
  }
  set isDisabled(isDisabled: boolean) {
    // ArgumentGuard.isString(value, 'isDisabled', false)
    this.#isDisabled = isDisabled
  }
  getIsDisabled() : boolean {
    return this.isDisabled
  }
  setIsDisabled(isDisabled: boolean) : this {
    this.isDisabled = isDisabled
    return this
  }

  #matchTimeout: number
  get matchTimeout() : number {
    return this.#matchTimeout
  }
  set matchTimeout(matchTimeout: number) {
    // ArgumentGuard.isString(value, 'matchTimeout', false)
    // if (value !== 0 && MIN_MATCH_TIMEOUT > value) {
    //   throw new TypeError(
    //     `Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`,
    //   )
    // }
    this.#matchTimeout = matchTimeout
  }
  getMatchTimeout() : number {
    return this.matchTimeout
  }
  setMatchTimeout(matchTimeout: number) : this {
    this.matchTimeout = matchTimeout
    return this
  }

  #sessionType: SessionType
  get sessionType() : SessionType {
    return this.#sessionType
  }
  set sessionType(sessionType: SessionType) {
    // ArgumentGuard.isString(value, 'sessionType', false)
    // if (value !== 0 && MIN_MATCH_TIMEOUT > value) {
    //   throw new TypeError(
    //     `Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`,
    //   )
    // }
    this.#sessionType = sessionType
  }
  getSessionType() : SessionType {
    return this.sessionType
  }
  setSessionType(sessionType: SessionType) : this {
    this.sessionType = sessionType
    return this
  }

  #viewportSize: RectangleSize
  get viewportSize() : RectangleSize {
    return this.#viewportSize
  }
  set viewportSize(viewportSize: RectangleSize) {
    // ArgumentGuard.isString(value, 'viewportSize', false)
    this.#viewportSize = viewportSize
  }
  getViewportSize() : RectangleSize {
    return this.viewportSize
  }
  setViewportSize(viewportSize: RectangleSize|PlainRectangleSize) : this {
    this.viewportSize = viewportSize
    return this
  }

  #agentId: string

  #apiKey: string

  #serverUrl: string

  #proxySettings: ProxySettings

  #connectionTimeout: number

  #removeSession: boolean

  #batch: BatchInfo

  #properties: PropertyData[]

  #baselineEnvName: string

  #environmentName: string

  #branchName: string

  #parentBranchName: string

  #baselineBranchName: string

  #compareWithParentBranch: boolean

  #ignoreBaseline: boolean

  #saveFailedTests: boolean

  #saveNewTests: boolean

  #saveDiffs: boolean

  #sendDom: boolean

  #hostApp: string
  
  #hostOS: string

  #hostAppInfo: string

  #hostOSInfo: string

  #deviceInfo: string

  #defaultMatchSettings: ImageMatchSettings

  #forceFullPageScreenshot: boolean

  #waitBeforeScreenshots: number

  #stitchMode: StitchMode
  
  #hideScrollbars: boolean

  #hideCaret: boolean

  #stitchOverlap: number

  #concurrentSessions: number

  #isThrowExceptionOn: boolean

  #browsersInfo: RenderInfo[]

  #visualGridOptions: object

  #layoutBreakpoints: boolean|number[]

  #disableBrowserFetching: boolean

  #dontCloseBatches: boolean

}