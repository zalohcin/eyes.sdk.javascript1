import RectangleSize, {PlainRectangleSize} from './RectangleSize'

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
    this.#appName = appName
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
    this.#testName = testName
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
    this.#displayName = displayName
    return this
  }

  #isDisabled: boolean

  #matchTimeout: number

  #sessionType: SessionType

  #viewportSize: RectangleSize

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