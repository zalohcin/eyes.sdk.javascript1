
import RectangleSizeData, { RectangleSize } from '../input/RectangleSize';
import { TestResultsStatus } from '../enums/TestResultsStatus';
import SessionUrlsData, { SessionUrls } from './SessionUrls';
import StepInfoData, { StepInfo } from './StepInfo';
import { fromISO8601DateTime } from '../utils/DateUtils';
import { AppUrls } from './AppUrls';
import { toPlain, toString } from '../utils/GeneralUtils';

export type SessionAccessibilityStatus = {
    level: "AA" | "AAA",
    version: "WCAG_2_0" | "WCAG_2_1",
    status: "Passed" | "Failed"
}

export type TestResults = {
    id?: string,
    name?: string,
    secretToken?: string,
    status?: TestResultsStatus,
    appName?: string,
    batchName?: string,
    batchId?: string,
    branchName?: string,
    hostOS?: string,
    hostApp?: string,
    hostDisplaySize?: RectangleSize | object,
    accessibilityStatus?: SessionAccessibilityStatus,
    startedAt?: Date | string,
    duration?: number,
    isNew?: boolean,
    isDifferent?: boolean,
    isAborted?: boolean,
    appUrls?: SessionUrls | object,
    apiUrls?: SessionUrls | object,
    stepsInfo?: StepInfo[] | object[],
    steps?: number,
    matches?: number,
    mismatches?: number,
    missing?: number,
    exactMatches?: number,
    strictMatches?: number,
    contentMatches?: number,
    layoutMatches?: number,
    noneMatches?: number,
    url?: string,
    serverConnector?: unknown
}


export default class TestResultsData implements Required<TestResults>{
    private _id: string;
    private _name: string;
    private _secretToken: string;
    private _status: TestResultsStatus;
    private _appName: string;
    private _batchName: string;
    private _batchId: string;
    private _branchName: string;
    private _hostOS: string;
    private _hostApp: string;
    private _hostDisplaySize: RectangleSize | object;
    private _accessibilityStatus: SessionAccessibilityStatus;
    private _startedAt: Date | string;
    private _duration: number;
    private _isNew: boolean;
    private _isDifferent: boolean;
    private _isAborted: boolean;
    private _appUrls: SessionUrls | object;
    private _apiUrls: SessionUrls | object;
    private _stepsInfo: StepInfo[] | object[];
    private _steps: number;
    private _matches: number;
    private _mismatches: number;
    private _missing: number;
    private _exactMatches: number;
    private _strictMatches: number;
    private _contentMatches: number;
    private _layoutMatches: number;
    private _noneMatches: number;
    private _url: string;
    private _serverConnector: unknown;

    constructor({
        id,
        name,
        secretToken,
        status,
        appName,
        batchName,
        batchId,
        branchName,
        hostOS,
        hostApp,
        hostDisplaySize,
        startedAt,
        duration,
        isNew,
        isDifferent,
        isAborted,
        appUrls,
        apiUrls,
        stepsInfo,
        steps,
        matches,
        mismatches,
        missing,
        exactMatches,
        strictMatches,
        contentMatches,
        layoutMatches,
        noneMatches,
        url,
        accessibilityStatus
    }: TestResults = {}) {
        if (hostDisplaySize && !(hostDisplaySize instanceof RectangleSizeData)) {
            hostDisplaySize = new RectangleSizeData(hostDisplaySize as RectangleSize)
        }

        if (appUrls && !(appUrls instanceof SessionUrlsData)) {
            appUrls = new SessionUrlsData(appUrls)
        }

        if (apiUrls && !(apiUrls instanceof SessionUrlsData)) {
            apiUrls = new SessionUrlsData(apiUrls)
        }

        if (startedAt && !(startedAt instanceof Date)) {
            startedAt = fromISO8601DateTime(startedAt)
        }

        if (stepsInfo && stepsInfo.length > 0 && !(stepsInfo[0] instanceof StepInfoData)) {
            for (const step of stepsInfo) {
                stepsInfo.push(new StepInfoData(step))
            }
        }

        this._id = id;
        this._name = name;
        this._secretToken = secretToken;
        this._status = status;
        this._appName = appName;
        this._batchName = batchName;
        this._batchId = batchId;
        this._branchName = branchName;
        this._hostOS = hostOS;
        this._hostApp = hostApp;
        this._hostDisplaySize = hostDisplaySize;
        this._startedAt = startedAt;
        this._duration = duration;
        this._isNew = isNew;
        this._isDifferent = isDifferent;
        this._isAborted = isAborted;
        this._appUrls = appUrls;
        this._apiUrls = apiUrls;
        this._stepsInfo = stepsInfo;
        this._steps = steps;
        this._matches = matches;
        this._mismatches = mismatches;
        this._missing = missing;
        this._exactMatches = exactMatches;
        this._strictMatches = strictMatches;
        this._contentMatches = contentMatches;
        this._layoutMatches = layoutMatches;
        this._noneMatches = noneMatches;
        this._url = url;
        this._accessibilityStatus = accessibilityStatus;
        this._serverConnector = undefined;
    }

    getId(): string {
        return this._id
    }

    setId(value: string): void {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    getName(): string {
        return this._name
    }

    setName(value: string): void {
        this._name = value
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    getSecretToken(): string {
        return this._secretToken;
    }

    setSecretToken(value: string): void {
        this._secretToken = value;
    }

    get secretToken(): string {
        return this._secretToken;
    }

    set secretToken(value: string) {
        this._secretToken = value;
    }

    getStatus(): TestResultsStatus {
        return this._status;
    }

    setStatus(value: TestResultsStatus): void {
        this._status = value;
    }

    get status(): TestResultsStatus {
        return this._status;
    }

    set status(value: TestResultsStatus) {
        this._status = value;
    }

    getAppName(): string {
        return this._appName;
    }

    setAppName(value: string): void {
        this._appName = value
    }

    get appName(): string {
        return this._appName;
    }

    set appName(value: string) {
        this._appName = value;
    }

    getBatchName(): string {
        return this._batchName
    }

    setBatchName(value: string): void {
        this._batchName = value
    }

    get batchName(): string {
        return this._batchName;
    }

    set batchName(value: string) {
        this._batchName = value;
    }

    getBatchId(): string {
        return this._batchId;
    }

    setBatchId(value: string): void {
        this._batchId = value;
    }

    get batchId(): string {
        return this._batchId;
    }

    set batchId(value: string) {
        this._batchId = value;
    }

    getBranchName(): string {
        return this._branchName;
    }

    setBranchName(value: string) {
        this._branchName = value;
    }

    get branchName(): string {
        return this._batchName;
    }

    set branchName(value: string) {
        this._batchName = value;
    }

    getHostOS(): string {
        return this._hostOS;
    }

    setHostOS(value: string): void {
        this._hostOS = value;
    }

    get hostOS(): string {
        return this._hostOS;
    }

    set hostOS(value: string) {
        this._hostOS = value;
    }

    getHostApp(): string {
        return this._hostApp;
    }

    setHostApp(value: string): void {
        this._hostApp = value;
    }

    get hostApp(): string {
        return this._hostApp;
    }

    set hostApp(value: string) {
        this._hostApp = value;
    }

    getHostDisplaySize(): RectangleSize | object {
        return this._hostDisplaySize;
    }

    setHostDisplaySize(value: RectangleSize | object): void {
        this._hostDisplaySize = value;
    }

    get hostDisplaySize(): RectangleSize | object {
        return this._hostDisplaySize;
    }

    set hostDisplaySize(value: RectangleSize | object) {
        this._hostDisplaySize = value;
    }

    getAccessibilityStatus(): SessionAccessibilityStatus {
        return this._accessibilityStatus
    }

    setAccessibilityStatus(value: SessionAccessibilityStatus): void {
        this._accessibilityStatus = value;
    }

    get accessibilityStatus(): SessionAccessibilityStatus {
        return this._accessibilityStatus;
    }

    set accessibilityStatus(value: SessionAccessibilityStatus) {
        this._accessibilityStatus = value;
    }

    getStartedAt(): Date | string {
        return this._startedAt;
    }

    setStartedAt(value: Date | string): void {
        this._startedAt = value;
    }

    get startedAt(): Date | string {
        return this._startedAt;
    }

    set startedAt(value: Date | string) {
        this._startedAt = value;
    }

    getDuration(): number {
        return this._duration;
    }

    setDuration(value: number): void {
        this._duration = value;
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    getIsNew(): boolean {
        return this._isNew;
    }

    setIsNew(value: boolean): void {
        this._isNew = value
    }

    get isNew(): boolean {
        return this._isNew;
    }

    set isNew(value: boolean) {
        this._isNew = value;
    }

    getIsDifferent(): boolean {
        return this._isDifferent;
    }

    setIsDifferent(value: boolean): void {
        this._isDifferent = value;
    }

    get isDifferent(): boolean {
        return this._isDifferent;
    }

    set isDifferent(value: boolean) {
        this._isDifferent = value;
    }

    getIsAborted(): boolean {
        return this._isAborted;
    }

    setIsAborted(value: boolean): void {
        this._isAborted = value;
    }

    get isAborted(): boolean {
        return this._isAborted;
    }

    set isAborted(value: boolean) {
        this._isAborted = value;
    }

    getAppUrls(): AppUrls | object {
        return this._appUrls;
    }

    setAppUrls(value: AppUrls | object): void {
        this._appUrls = value;
    }

    get appUrls(): SessionUrls | object {
        return this._appUrls;
    }

    set appUrls(value: SessionUrls | object) {
        this._appUrls = value;
    }

    getApiUrls(): SessionUrls | object {
        return this._apiUrls
    }

    setApiUrls(value: SessionUrls | object): void {
        this._apiUrls = value;
    }

    get apiUrls(): SessionUrls | object {
        return this._apiUrls;
    }

    set apiUrls(value: SessionUrls | object) {
        this._apiUrls = value;
    }

    getStepsInfo(): StepInfo[] {
        return this._stepsInfo;
    }

    setStepsInfo(value: StepInfo[]): void {
        this._stepsInfo = value;
    }

    get stepsInfo(): StepInfo[] {
        return this._stepsInfo;
    }

    set stepsInfo(value: StepInfo[]) {
        this._stepsInfo = value;
    }

    getSteps(): number {
        return this._steps;
    }

    setSteps(value: number): void {
        this._steps = value;
    }

    get steps(): number {
        return this._steps;
    }

    set steps(value: number) {
        this._steps = value;
    }

    getMatches(): number {
        return this._matches;
    }

    setMatches(value: number): void {
        this._matches = value;
    }

    get matches(): number {
        return this._matches;
    }

    set matches(value: number) {
        this._matches = value;
    }

    getMismatches(): number {
        return this._mismatches;
    }

    setMismatches(value: number): void {
        this._mismatches = value;
    }

    get mismatches(): number {
        return this._mismatches;
    }

    set mismatches(value: number) {
        this._mismatches = value;
    }

    getMissing(): number {
        return this._missing;
    }

    setMissing(value: number): void {
        this._missing = value;
    }

    get missing(): number {
        return this._missing;
    }

    set missing(value: number) {
        this._missing = value;
    }

    getExactMatches(): number {
        return this._exactMatches;
    }

    setExactMatches(value: number): void {
        this._exactMatches = value;
    }

    get exactMatches(): number {
        return this._exactMatches;
    }

    set exactMatches(value: number) {
        this._exactMatches = value;
    }

    getStrictMatches(): number {
        return this._strictMatches;
    }

    setStrictMatches(value: number): void {
        this._strictMatches = value;
    }

    get strictMatches(): number {
        return this._strictMatches;
    }

    set strictMatches(value: number) {
        this._strictMatches = value;
    }

    getContentMatches(): number {
        return this._contentMatches;
    }

    setContentMatches(value: number): void {
        this._contentMatches = value;
    }

    get contentMatches(): number {
        return this._contentMatches;
    }

    set contentMatches(value: number) {
        this._contentMatches = value;
    }

    getLayoutMatches(): number {
        return this._layoutMatches;
    }

    setLayoutMatches(value: number) {
        this._layoutMatches = value;
    }

    get layoutMatches(): number {
        return this._layoutMatches;
    }

    set layoutMatches(value: number) {
        this._layoutMatches = value;
    }

    getNoneMatches(): number {
        return this._noneMatches;
    }

    setNoneMatches(value: number): void {
        this._noneMatches = value;
    }

    get noneMatches(): number {
        return this._noneMatches;
    }

    set noneMatches(value: number) {
        this._noneMatches = value;
    }

    getUrl(): string {
        return this._url;
    }

    setUrl(value: string): void {
        this._url = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    getServerConnector(): unknown {
        return this._serverConnector;
    }

    setServerConnector(value: unknown): void {
        this._serverConnector = value;
    }

    get serverConnector(): unknown {
        return this._serverConnector;
    }

    set serverConnector(value: unknown) {
        this._serverConnector = value;
    }

    toJSON() {
        return toPlain(this, ['_serverConnector'])
    }

    toString() {
        const isNewTestStr = this._isNew ? 'new test' : 'existing test'
        return `TestResults of ${isNewTestStr} ${toString(this, [
            '_secretToken',
            '_serverConnector',
        ])}`
    }
}