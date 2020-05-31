/// <reference types="node" />
declare module "lib/utils/Enum" {
    export = Enum;
    function Enum<E>(name: string, valuesObj: E): Readonly<E>;
}
declare module "lib/config/AccessibilityLevel" {
    export = AccessibilityLevels;
    const AccessibilityLevels: Readonly<{
        AA: string;
        AAA: string;
    }>;
    namespace AccessibilityLevels {
        export { AccessibilityLevel };
    }
    type AccessibilityLevel = string;
}
declare module "lib/config/AccessibilityGuidelinesVersion" {
    export = AccessibilityGuidelinesVersions;
    const AccessibilityGuidelinesVersions: Readonly<{
        WCAG_2_0: string;
        WCAG_2_1: string;
    }>;
    namespace AccessibilityGuidelinesVersions {
        export { AccessibilityGuidelinesVersion };
    }
    type AccessibilityGuidelinesVersion = string;
}
declare module "lib/config/AccessibilityRegionType" {
    export = AccessibilityRegionTypes;
    const AccessibilityRegionTypes: Readonly<{
        IgnoreContrast: string;
        RegularText: string;
        LargeText: string;
        BoldText: string;
        GraphicalObject: string;
    }>;
    namespace AccessibilityRegionTypes {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/utils/TypeUtils" {
    export function isNull(value: any): boolean;
    export function isNotNull(value: any): boolean;
    export function isString(value: any): boolean;
    export function isNumber(value: any): boolean;
    export function isInteger(value: any): boolean;
    export function isBoolean(value: any): boolean;
    export function isObject(value: any): boolean;
    export function isPlainObject(value: any): boolean;
    export function isArray(value: any): boolean;
    export function isBuffer(value: any): boolean;
    export function isBase64(value: any): boolean;
    export function isUrl(value: any): boolean;
    export function has(object: object, keys: string | string[]): boolean;
    export function hasMethod(object: object, methods: string | string[]): boolean;
    export function getOrDefault(value: any, defaultValue: any): any;
    export function isFunction(value: any): boolean;
    export function isIterator(value: any): boolean;
}
declare module "lib/utils/DateTimeUtils" {
    export function toISO8601DateTime(date?: Date | undefined): string;
    export function toRfc1123DateTime(date?: Date | undefined): string;
    export function toLogFileDateTime(date?: Date | undefined, utc?: boolean | undefined): string;
    export function fromISO8601DateTime(dateTime: string): Date;
}
declare module "lib/utils/GeneralUtils" {
    export function urlConcat(url: string, ...suffixes: string[]): string;
    export function stripTrailingSlash(url: string): string;
    export function isAbsoluteUrl(url: string): boolean;
    export function stringify(...args: any[]): string;
    export function stringifySingle(arg: any): string;
    export function toString(object: object, exclude?: string[] | undefined): string;
    export function toPlain(object: object, exclude?: string[] | undefined, rename?: object | undefined): object;
    export function mergeDeep<TFirst, TSecond>(target: TFirst, source: TSecond): TFirst | TSecond;
    export function guid(): string;
    export function randomAlphanumeric(length?: number): string;
    export function sleep(ms: number): Promise<any>;
    export function toISO8601DateTime(date?: Date | undefined): string;
    export function toRfc1123DateTime(date?: Date | undefined): string;
    export function toLogFileDateTime(date?: Date | undefined): string;
    export function fromISO8601DateTime(dateTime: string): Date;
    export function jwtDecode(token: string): object;
    export function cartesianProduct(...arrays: ([] | Object)[]): Array<Array<[]>>;
    export function getPropertyByPath(object: object, path: string): any | undefined;
    export function getEnvValue(propName: string, isBoolean?: boolean): any | undefined;
    export function backwardCompatible(...args: any[]): {};
    export function cleanStringForJSON(str: string): string;
    export function isFeatureFlagOn(featureName: any): boolean;
    export function isFeatureFlagOff(featureName: any): boolean;
    export function presult<T>(promise: PromiseLike<T>): PromiseLike<[any, T | undefined]>;
    export function pexec(...args: any[]): import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: Buffer;
        stderr: Buffer;
    }> & import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: string | Buffer;
        stderr: string | Buffer;
    }>;
    export function cachify(getterFunction: any, cacheRegardlessOfArgs?: boolean): (...args: any[]) => any;
}
declare module "lib/utils/ArgumentGuard" {
    export function notEqual(param: object, value: object, paramName: string): void;
    export function alphanumeric(param: object, paramName: string): void;
    export function notNull(param: object, paramName: string): void;
    export function isNull(param: object, paramName: string): void;
    export function notNullOrEmpty(param: object, paramName: string): void;
    export function greaterThanOrEqualToZero(param: number, paramName: string, shouldBeInteger?: boolean): void;
    export function greaterThanZero(param: number, paramName: string, isInteger?: boolean): void;
    export function notZero(param: number, paramName: string, isInteger?: boolean): void;
    export function isInteger(param: number, paramName: string, strict?: boolean | undefined): void;
    export function isString(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isNumber(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isBoolean(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isArray(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isPlainObject(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isBuffer(param: object, paramName: string, strict?: boolean | undefined): void;
    export function isBase64(param: object): void;
    export function isValidState(isValid: boolean, errMsg: string): void;
    export function isValidType(param: object, type: object, strict?: boolean | undefined): void;
    export function isValidEnumValue(value: any, enumObject: object, strict?: boolean | undefined): void;
    export function hasProperties(object: object, properties: string | string[], paramName: string): void;
}
declare module "lib/geometry/RectangleSize" {
    export = RectangleSize;
    class RectangleSize {
        static parse(size: string): RectangleSize;
        constructor(varArg1: RectangleSize | RectangleSizeObject | number, varArg2?: number | undefined, ...args: any[]);
        _width: any;
        _height: any;
        isEmpty(): boolean;
        getWidth(): number;
        getHeight(): number;
        equals(obj: object | RectangleSize): boolean;
        scale(scaleRatio: number): RectangleSize;
        toJSON(): {
            width: any;
            height: any;
        };
        toString(): string;
    }
    namespace RectangleSize {
        export { EMPTY, RectangleSizeObject };
    }
    type RectangleSizeObject = {
        width: number;
        height: number;
    };
    var EMPTY: RectangleSize;
}
declare module "lib/geometry/Location" {
    export = Location;
    class Location {
        constructor(varArg1: Location | LocationObject | number, varArg2?: number | undefined, ...args: any[]);
        _x: number;
        _y: number;
        getX(): number;
        getY(): number;
        equals(obj: Location): boolean;
        offset(dx: number, dy: number): Location;
        offsetNegative(other: Location): Location;
        offsetByLocation(amount: Location): Location;
        scale(scaleRatio: number): Location;
        toJSON(): {
            x: number;
            y: number;
        };
        toString(): string;
        toStringForFilename(): string;
    }
    namespace Location {
        export { ZERO, LocationObject };
    }
    type LocationObject = {
        x: number;
        y: number;
    };
    var ZERO: Location;
}
declare module "lib/geometry/CoordinatesType" {
    export = CoordinatesTypes;
    const CoordinatesTypes: Readonly<{
        SCREENSHOT_AS_IS: string;
        CONTEXT_AS_IS: string;
        CONTEXT_RELATIVE: string;
    }>;
    namespace CoordinatesTypes {
        export { CoordinatesType };
    }
    type CoordinatesType = string;
}
declare module "lib/geometry/Region" {
    export = Region;
    class Region {
        static isRegionCompatible(object: object): boolean;
        constructor(varArg1: Region | RegionObject | Location | number, varArg2?: number | import("lib/geometry/RectangleSize") | undefined, varArg3?: string | number | undefined, varArg4?: number | undefined, varArg5?: string | undefined, ...args: any[]);
        _error: any;
        _left: any;
        _top: any;
        _width: any;
        _height: any;
        _coordinatesType: any;
        getLeft(): number;
        setLeft(value: number): void;
        getTop(): number;
        setTop(value: number): void;
        getRight(): number;
        getBottom(): number;
        getWidth(): number;
        setWidth(value: number): void;
        getHeight(): number;
        setHeight(value: number): void;
        getCoordinatesType(): CoordinatesType;
        setCoordinatesType(value: CoordinatesType): void;
        getError(): string;
        setError(value: string): void;
        getLocation(): Location;
        setLocation(location: Location): void;
        getSize(): import("lib/geometry/RectangleSize");
        setSize(size: import("lib/geometry/RectangleSize")): void;
        equals(obj: object | Region): boolean;
        isEmpty(): boolean;
        isSizeEmpty(): boolean;
        offset(dx: number, dy: number): Region;
        getMiddleOffset(): Location;
        scale(scaleRatio: number): Region;
        getSubRegions(subRegionSize: import("lib/geometry/RectangleSize"), isFixedSize?: boolean | undefined, scrollDownAmmount?: number | undefined): Region[];
        contains(locationOrRegion: Region | Location): boolean;
        isIntersected(other: Region): boolean;
        intersect(other: Region): void;
        protected makeEmpty(): void;
        toJSON(): {
            error: any;
            left?: undefined;
            top?: undefined;
            width?: undefined;
            height?: undefined;
            coordinatesType?: undefined;
        } | {
            left: any;
            top: any;
            width: any;
            height: any;
            coordinatesType: any;
            error?: undefined;
        };
        toPersistedRegions(_driver: any): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
        }[]>;
        toString(): string;
    }
    namespace Region {
        export { EMPTY, CoordinatesType, RegionObject };
    }
    type CoordinatesType = string;
    const Location: typeof import("lib/geometry/Location");
    type RegionObject = {
        left: number;
        top: number;
        width: number;
        height: number;
        coordinatesType: CoordinatesType | undefined;
    };
    var EMPTY: Region;
}
declare module "lib/config/AccessibilityMatchSettings" {
    export = AccessibilityMatchSettings;
    class AccessibilityMatchSettings {
        constructor({ left, top, width, height, type }?: {
            left: number;
            top: number;
            width: number;
            height: number;
            type: AccessibilityRegionType;
        }, ...args: any[]);
        _left: number;
        _top: number;
        _width: number;
        _height: number;
        _type: string;
        getLeft(): number;
        setLeft(value: number): void;
        getTop(): number;
        setTop(value: number): void;
        getWidth(): number;
        setWidth(value: number): void;
        getHeight(): number;
        setHeight(value: number): void;
        getType(): AccessibilityRegionType;
        setType(value: AccessibilityRegionType): void;
        getRegion(): import("lib/geometry/Region");
        toJSON(): object;
        toString(): string;
    }
    namespace AccessibilityMatchSettings {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/config/BatchInfo" {
    export = BatchInfo;
    class BatchInfo {
        constructor(varArg1?: string | import("lib/config/BatchInfo") | BatchInfoObject | undefined, varArg2?: string | undefined, varArg3?: string | undefined);
        _id: any;
        _isGeneratedId: boolean;
        _name: any;
        _startedAt: any;
        _sequenceName: any;
        _notifyOnCompletion: any;
        _isCompleted: any;
        getId(): string;
        getIsGeneratedId(): boolean;
        setIsGeneratedId(value: any): any;
        setId(value: string): this;
        getName(): string;
        setName(name: string): this;
        getStartedAt(): Date;
        setStartedAt(startedAt: string): this;
        getSequenceName(): string;
        setSequenceName(sequenceName: string): this;
        getNotifyOnCompletion(): boolean;
        setNotifyOnCompletion(notifyOnCompletion: boolean): this;
        getIsCompleted(): boolean;
        setIsCompleted(isCompleted: boolean): this;
        toJSON(): object;
        toString(): string;
        _generateAndSetId(): void;
    }
    namespace BatchInfo {
        export { BatchInfoObject };
    }
    type BatchInfoObject = {
        id?: string;
        name?: string;
        startedAt?: any | string;
        sequenceName?: string;
        notifyOnCompletion?: boolean;
    };
}
declare module "lib/config/BrowserType" {
    export = BrowserTypes;
    const BrowserTypes: Readonly<{
        CHROME: string;
        FIREFOX: string;
        IE_11: string;
        IE_10: string;
        EDGE: string;
        EDGE_CHROMIUM: string;
        EDGE_LEGACY: string;
        SAFARI: string;
        CHROME_ONE_VERSION_BACK: string;
        CHROME_TWO_VERSIONS_BACK: string;
        FIREFOX_ONE_VERSION_BACK: string;
        FIREFOX_TWO_VERSIONS_BACK: string;
        SAFARI_ONE_VERSION_BACK: string;
        SAFARI_TWO_VERSIONS_BACK: string;
        EDGE_CHROMIUM_ONE_VERSION_BACK: string;
    }>;
    namespace BrowserTypes {
        export { BrowserType };
    }
    type BrowserType = string;
}
declare module "lib/config/PropertyData" {
    export = PropertyData;
    class PropertyData {
        constructor(varArg1: string | PropertyDataObject | PropertyData, varArg2?: string | undefined, ...args: any[]);
        _name: string;
        _value: string;
        getName(): string;
        setName(value: string): void;
        getValue(): string;
        setValue(value: string): void;
        toJSON(): {
            name: string;
            value: string;
        };
        toString(): string;
    }
    namespace PropertyData {
        export { PropertyDataObject };
    }
    type PropertyDataObject = {
        name: string;
        value: string;
    };
}
declare module "lib/config/ProxySettings" {
    export = ProxySettings;
    class ProxySettings {
        constructor(uri: string | boolean, username?: string | undefined, password?: string | undefined, isHttpOnly?: boolean | undefined);
        _isDisabled: boolean;
        _uri: string | true;
        _username: string | undefined;
        _password: string | undefined;
        _isHttpOnly: boolean | undefined;
        _url: import("url").URL;
        getUri(): string | true;
        getUsername(): string | undefined;
        getPassword(): string | undefined;
        getIsHttpOnly(): boolean | undefined;
        getIsDisabled(): boolean;
        toProxyObject(): {
            protocol: string;
            host: string;
            port: number;
            auth: {
                username: string;
                password: string;
            };
            isHttpOnly: boolean;
        } | boolean;
    }
    namespace ProxySettings {
        export { ProxySettingsObject };
    }
    type ProxySettingsObject = {
        url: string;
        username: (string | undefined);
        password: (string | undefined);
    };
}
declare module "lib/config/StitchMode" {
    export = StitchModes;
    const StitchModes: Readonly<{
        SCROLL: string;
        CSS: string;
    }>;
    namespace StitchModes {
        export { StitchMode };
    }
    type StitchMode = string;
}
declare module "lib/config/ScreenOrientation" {
    export = ScreenOrientations;
    const ScreenOrientations: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
    namespace ScreenOrientations {
        export { ScreenOrientation };
    }
    type ScreenOrientation = string;
}
declare module "lib/config/MatchLevel" {
    export = MatchLevels;
    const MatchLevels: Readonly<{
        None: string;
        LegacyLayout: string;
        Layout: string;
        Layout2: string;
        Content: string;
        Strict: string;
        Exact: string;
    }>;
    namespace MatchLevels {
        export { MatchLevel };
    }
    type MatchLevel = string;
}
declare module "lib/config/ExactMatchSettings" {
    export = ExactMatchSettings;
    class ExactMatchSettings {
        constructor({ minDiffIntensity, minDiffWidth, minDiffHeight, matchThreshold }?: {
            minDiffIntensity: any;
            minDiffWidth: any;
            minDiffHeight: any;
            matchThreshold: any;
        }, ...args: any[]);
        _minDiffIntensity: any;
        _minDiffWidth: any;
        _minDiffHeight: any;
        _matchThreshold: any;
        getMinDiffIntensity(): number;
        setMinDiffIntensity(value: number): void;
        getMinDiffWidth(): number;
        setMinDiffWidth(value: number): void;
        getMinDiffHeight(): number;
        setMinDiffHeight(value: number): void;
        getMatchThreshold(): number;
        setMatchThreshold(value: number): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/config/ImageMatchSettings" {
    export = ImageMatchSettings;
    class ImageMatchSettings {
        constructor(imageMatchSettings: any, ...args: any[]);
        _matchLevel: any;
        _ignoreCaret: any;
        _useDom: any;
        _enablePatterns: any;
        _ignoreDisplacements: any;
        _exact: any;
        _ignoreRegions: any[];
        _layoutRegions: any[];
        _strictRegions: any[];
        _contentRegions: any[];
        _accessibilityMatchSettings: any[];
        _floatingMatchSettings: any[];
        getMatchLevel(): any;
        setMatchLevel(value: any): void;
        getAccessibilitySettings(): any;
        setAccessibilitySettings(value: any): void;
        _accessibilitySettings: any;
        getExact(): import("lib/config/ExactMatchSettings");
        setExact(value: import("lib/config/ExactMatchSettings")): void;
        getIgnoreCaret(): boolean;
        setIgnoreCaret(value: boolean): void;
        getUseDom(): boolean;
        setUseDom(value: boolean): void;
        getEnablePatterns(): boolean;
        setEnablePatterns(value: boolean): void;
        getIgnoreDisplacements(): boolean;
        setIgnoreDisplacements(value: boolean): void;
        getIgnoreRegions(): any[];
        setIgnoreRegions(ignoreRegions: any[]): void;
        setLayoutRegions(layoutRegions: any[]): void;
        getLayoutRegions(): any[];
        getStrictRegions(): any[];
        setStrictRegions(strictRegions: any[]): void;
        getContentRegions(): any[];
        setContentRegions(contentRegions: any[]): void;
        getFloatingRegions(): any[];
        setAccessibilityRegions(accessibilityMatchSettings: any[]): void;
        getAccessibilityRegions(): any[];
        setFloatingRegions(floatingMatchSettings: any[]): void;
        toJSON(): object;
        _toPlain(): object;
        toString(): string;
    }
}
declare module "lib/config/Configuration" {
    export = Configuration;
    class Configuration {
        constructor(configuration?: object | import("lib/config/Configuration") | undefined);
        private _showLogs;
        _saveDebugData: boolean;
        _appName: string;
        _testName: string;
        _displayName: string;
        _isDisabled: boolean;
        _matchTimeout: number;
        _sessionType: any;
        _viewportSize: import("lib/geometry/RectangleSize");
        _agentId: string;
        _apiKey: string;
        _serverUrl: string;
        _proxySettings: import("lib/config/ProxySettings");
        _connectionTimeout: number;
        _removeSession: boolean;
        _batch: import("lib/config/BatchInfo");
        _properties: import("lib/config/PropertyData")[];
        _baselineEnvName: string;
        _environmentName: string;
        _branchName: string;
        _parentBranchName: string;
        _baselineBranchName: string;
        _compareWithParentBranch: boolean;
        _saveFailedTests: boolean;
        _saveNewTests: boolean;
        _ignoreBaseline: boolean;
        _saveDiffs: boolean;
        _sendDom: boolean;
        _hostApp: string;
        _hostOS: string;
        _hostAppInfo: string;
        _hostOSInfo: string;
        _deviceInfo: string;
        _defaultMatchSettings: import("lib/config/ImageMatchSettings");
        _forceFullPageScreenshot: boolean;
        _waitBeforeScreenshots: number;
        _stitchMode: any;
        _hideScrollbars: boolean;
        _hideCaret: boolean;
        _stitchOverlap: number;
        _concurrentSessions: number;
        _isThrowExceptionOn: boolean;
        _browsersInfo: RenderBrowserInfo[] | DeviceInfo[];
        _dontCloseBatches: boolean;
        getShowLogs(): boolean;
        setShowLogs(value: boolean): this;
        getSaveDebugData(): boolean;
        setSaveDebugData(value: boolean): this;
        getApiKey(): string;
        setApiKey(value: string): this;
        getServerUrl(): string;
        setServerUrl(value: string): this;
        getProxy(): import("lib/config/ProxySettings");
        setProxy(value: import("lib/config/ProxySettings") | any | string | boolean): this;
        getConnectionTimeout(): number;
        setConnectionTimeout(value: number): this;
        getRemoveSession(): boolean;
        setRemoveSession(value: boolean): this;
        getCompareWithParentBranch(): boolean;
        setCompareWithParentBranch(value: boolean): this;
        getIgnoreBaseline(): boolean;
        setIgnoreBaseline(value: boolean): this;
        getSaveNewTests(): boolean;
        setSaveNewTests(value: boolean): this;
        getSaveFailedTests(): boolean;
        setSaveFailedTests(value: boolean): this;
        getMatchTimeout(): number;
        setMatchTimeout(value: number): this;
        getIsDisabled(): boolean;
        setIsDisabled(value: boolean): this;
        getBatch(): import("lib/config/BatchInfo");
        setBatch(value: import("lib/config/BatchInfo") | any): this;
        getProperties(): import("lib/config/PropertyData")[];
        setProperties(value: import("lib/config/PropertyData")[] | any[]): this;
        addProperty(propertyOrName: import("lib/config/PropertyData") | string, propertyValue?: string | undefined): this;
        getBranchName(): string;
        setBranchName(value: string): this;
        getAgentId(): string;
        setAgentId(value: string): this;
        getParentBranchName(): string;
        setParentBranchName(value: string): this;
        getBaselineBranchName(): string;
        setBaselineBranchName(value: string): this;
        getBaselineEnvName(): string;
        setBaselineEnvName(value: string): this;
        getEnvironmentName(): string;
        setEnvironmentName(value: string): this;
        getSaveDiffs(): boolean;
        setSaveDiffs(value: boolean): this;
        getSendDom(): boolean;
        setSendDom(value: boolean): this;
        getHostApp(): string;
        setHostApp(value: string): this;
        getHostOS(): string;
        setHostOS(value: string): this;
        getHostAppInfo(): string;
        setHostAppInfo(value: string): this;
        getHostOSInfo(): string;
        setHostOSInfo(value: string): this;
        getDeviceInfo(): string;
        setDeviceInfo(value: string): this;
        getAppName(): string;
        setAppName(value: string): this;
        getTestName(): string;
        setTestName(value: string): this;
        getDisplayName(): string;
        setDisplayName(value: string): this;
        getViewportSize(): import("lib/geometry/RectangleSize");
        setViewportSize(value: import("lib/geometry/RectangleSize") | any): this;
        getSessionType(): any;
        setSessionType(value: any): this;
        getDefaultMatchSettings(): import("lib/config/ImageMatchSettings");
        setDefaultMatchSettings(value: import("lib/config/ImageMatchSettings") | object): this;
        getMatchLevel(): any;
        setMatchLevel(value: any): this;
        getAccessibilityValidation(): AccessibilitySettings;
        setAccessibilityValidation(value: AccessibilitySettings): this;
        getUseDom(): boolean;
        setUseDom(value: boolean): this;
        getEnablePatterns(): boolean;
        setEnablePatterns(value: boolean): this;
        getIgnoreDisplacements(): boolean;
        setIgnoreDisplacements(value: boolean): this;
        getIgnoreCaret(): boolean;
        setIgnoreCaret(value: boolean): this;
        getForceFullPageScreenshot(): boolean;
        setForceFullPageScreenshot(value: boolean): this;
        getWaitBeforeScreenshots(): number;
        setWaitBeforeScreenshots(value: number): this;
        getStitchMode(): any;
        setStitchMode(value: any): this;
        getHideScrollbars(): boolean;
        setHideScrollbars(value: boolean): this;
        getHideCaret(): boolean;
        setHideCaret(value: boolean): this;
        getStitchOverlap(): number;
        setStitchOverlap(value: number): this;
        getDontCloseBatches(): boolean;
        setDontCloseBatches(value: boolean): this;
        getConcurrentSessions(): number;
        setConcurrentSessions(value: number): this;
        getIsThrowExceptionOn(): boolean;
        setIsThrowExceptionOn(value: boolean): this;
        getBrowsersInfo(): RenderBrowserInfo[] | DeviceInfo[] | undefined;
        setBrowsersInfo(value: RenderBrowserInfo[] | DeviceInfo[] | object[]): this;
        addBrowsers(...browsersInfo: RenderBrowserInfo[]): this;
        addBrowser(width: number, height: number, browserType?: any): this;
        addDeviceEmulation(deviceName: any, screenOrientation?: ScreenOrientation | undefined): this;
        mergeConfig(other: Configuration | object): void;
        toOpenEyesConfiguration(): object;
        toJSON(): object;
        cloneConfig(): Configuration;
    }
    namespace Configuration {
        export { AccessibilityLevel, AccessibilityGuidelinesVersion, RenderBrowserInfo, DeviceInfo, AccessibilitySettings };
    }
    type RenderBrowserInfo = {
        width: number;
        height: number;
        name: any;
    };
    type DeviceInfo = {
        deviceName: string;
        screenOrientation: ScreenOrientation;
    };
    type AccessibilitySettings = {
        level: AccessibilityLevel;
        guidelinesVersion: AccessibilityGuidelinesVersion;
    };
    type AccessibilityLevel = string;
    type AccessibilityGuidelinesVersion = string;
    const ScreenOrientation_1: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
}
declare module "lib/config/DeviceName" {
    export = DeviceNames;
    const DeviceNames: Readonly<{
        Blackberry_PlayBook: string;
        BlackBerry_Z30: string;
        Galaxy_A5: string;
        Galaxy_Note_10: string;
        Galaxy_Note_10_Plus: string;
        Galaxy_Note_2: string;
        Galaxy_Note_3: string;
        Galaxy_Note_4: string;
        Galaxy_Note_8: string;
        Galaxy_Note_9: string;
        Galaxy_S10: string;
        Galaxy_S10_Plus: string;
        Galaxy_S3: string;
        Galaxy_S5: string;
        Galaxy_S8: string;
        Galaxy_S8_Plus: string;
        Galaxy_S9: string;
        Galaxy_S9_Plus: string;
        iPad: string;
        iPad_6th_Gen: string;
        iPad_7th_Gen: string;
        iPad_Air_2: string;
        iPad_Mini: string;
        iPad_Pro: string;
        iPhone_11: string;
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_4: string;
        iPhone_5SE: string;
        iPhone_6_7_8: string;
        iPhone_6_7_8_Plus: string;
        iPhone_X: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_XS_Max: string;
        Kindle_Fire_HDX: string;
        Laptop_with_HiDPI_screen: string;
        Laptop_with_MDPI_screen: string;
        Laptop_with_touch: string;
        LG_G6: string;
        LG_Optimus_L70: string;
        Microsoft_Lumia_550: string;
        Microsoft_Lumia_950: string;
        Nexus_10: string;
        Nexus_4: string;
        Nexus_5: string;
        Nexus_5X: string;
        Nexus_6: string;
        Nexus_6P: string;
        Nexus_7: string;
        Nokia_Lumia_520: string;
        Nokia_N9: string;
        OnePlus_7T: string;
        OnePlus_7T_Pro: string;
        Pixel_2: string;
        Pixel_2_XL: string;
        Pixel_3: string;
        Pixel_3_XL: string;
        Pixel_4: string;
        Pixel_4_XL: string;
    }>;
    namespace DeviceNames {
        export { DeviceName };
    }
    type DeviceName = string;
}
declare module "lib/config/FloatingMatchSettings" {
    export = FloatingMatchSettings;
    class FloatingMatchSettings {
        constructor({ left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset, }?: {
            left: any;
            top: any;
            width: any;
            height: any;
            maxUpOffset: any;
            maxDownOffset: any;
            maxLeftOffset: any;
            maxRightOffset: any;
        }, ...args: any[]);
        _left: any;
        _top: any;
        _width: any;
        _height: any;
        _maxUpOffset: any;
        _maxDownOffset: any;
        _maxLeftOffset: any;
        _maxRightOffset: any;
        getLeft(): number;
        setLeft(value: number): void;
        getTop(): number;
        setTop(value: number): void;
        getWidth(): number;
        setWidth(value: number): void;
        getHeight(): number;
        setHeight(value: number): void;
        getMaxUpOffset(): number;
        setMaxUpOffset(value: number): void;
        getMaxDownOffset(): number;
        setMaxDownOffset(value: number): void;
        getMaxLeftOffset(): number;
        setMaxLeftOffset(value: number): void;
        getMaxRightOffset(): number;
        setMaxRightOffset(value: number): void;
        getRegion(): import("lib/geometry/Region");
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/config/SessionType" {
    export = SessionTypes;
    const SessionTypes: Readonly<{
        SEQUENTIAL: string;
        PROGRESSION: string;
    }>;
    namespace SessionTypes {
        export { SessionType };
    }
    type SessionType = string;
}
declare module "lib/config/IosDeviceName" {
    export = IosDeviceNames;
    const IosDeviceNames: Readonly<{
        iPhone_11_Pro: string;
    }>;
    namespace IosDeviceNames {
        export { IosDeviceName };
    }
    type IosDeviceName = string;
}
declare module "lib/config/IosScreenOrientation" {
    export = IosScreenOrientations;
    const IosScreenOrientations: Readonly<{
        PORTRAIT: string;
        UPSIDE_DOWN: string;
        LANDSCAPE_LEFT: string;
        LANDSCAPE_RIGHT: string;
    }>;
    namespace IosScreenOrientations {
        export { IosScreenOrientation };
    }
    type IosScreenOrientation = string;
}
declare module "lib/config/IosVersion" {
    export = IosVersions;
    const IosVersions: Readonly<{
        Latest: string;
    }>;
    namespace IosVersions {
        export { IosVersion };
    }
    type IosVersion = string;
}
declare module "lib/debug/DebugScreenshotsProvider" {
    export = DebugScreenshotsProvider;
    class DebugScreenshotsProvider {
        _prefix: string;
        _path: string | null;
        getPrefix(): string;
        setPrefix(value: string): void;
        getPath(): string;
        setPath(value: string): void;
        save(_image: any, _suffix: any): Promise<any>;
    }
}
declare module "lib/utils/FileUtils" {
    export function writeFromBuffer(imageBuffer: Buffer, filename: string): Promise<any>;
    export function readToBuffer(path: string): Promise<Buffer>;
}
declare module "lib/debug/FileDebugScreenshotsProvider" {
    export = FileDebugScreenshotsProvider;
    const FileDebugScreenshotsProvider_base: typeof import("lib/debug/DebugScreenshotsProvider");
    class FileDebugScreenshotsProvider extends FileDebugScreenshotsProvider_base {
    }
}
declare module "lib/debug/NullDebugScreenshotProvider" {
    export = NullDebugScreenshotProvider;
    const NullDebugScreenshotProvider_base: typeof import("lib/debug/DebugScreenshotsProvider");
    class NullDebugScreenshotProvider extends NullDebugScreenshotProvider_base {
    }
}
declare module "lib/errors/EyesError" {
    export = EyesError;
    class EyesError extends Error {
        constructor(message?: string | undefined, error?: Error | undefined);
    }
}
declare module "lib/errors/CoordinatesTypeConversionError" {
    export = CoordinatesTypeConversionError;
    const CoordinatesTypeConversionError_base: typeof import("lib/errors/EyesError");
    class CoordinatesTypeConversionError extends CoordinatesTypeConversionError_base {
        constructor(fromOrMsg: any | string, to?: any, ...args: any[]);
    }
}
declare module "lib/server/SessionStartInfo" {
    export = SessionStartInfo;
    class SessionStartInfo {
        constructor({ agentId, sessionType, appIdOrName, verId, scenarioIdOrName, displayName, batchInfo, baselineEnvName, environmentName, environment, defaultMatchSettings, branchName, parentBranchName, parentBranchBaselineSavedBefore, baselineBranchName, compareWithParentBranch, ignoreBaseline, saveDiffs, render, properties, }?: {
            agentId: string;
            sessionType: any;
            appIdOrName: string;
            verId: string;
            scenarioIdOrName: string;
            displayName: string;
            batchInfo: any;
            baselineEnvName: string;
            environmentName: string;
            environment: any;
            defaultMatchSettings: any;
            branchName: string;
            parentBranchName: string;
            parentBranchBaselineSavedBefore: string;
            baselineBranchName: string;
            compareWithParentBranch: boolean;
            ignoreBaseline: boolean;
            saveDiffs: boolean;
            render: boolean;
            properties: any[];
        });
        _agentId: string;
        _sessionType: any;
        _appIdOrName: string;
        _verId: string;
        _scenarioIdOrName: string;
        _displayName: string;
        _batchInfo: any;
        _baselineEnvName: string;
        _environmentName: string;
        _environment: any;
        _defaultMatchSettings: any;
        _branchName: string;
        _parentBranchName: string;
        _parentBranchBaselineSavedBefore: string;
        _baselineBranchName: string;
        _compareWithParentBranch: boolean;
        _ignoreBaseline: boolean;
        _saveDiffs: boolean;
        _render: boolean;
        _properties: any[];
        getAgentId(): string;
        getSessionType(): any;
        getAppIdOrName(): string;
        getVerId(): string;
        getScenarioIdOrName(): string;
        getDisplayName(): string;
        getBatchInfo(): any;
        getBaselineEnvName(): string;
        getEnvironmentName(): string;
        getEnvironment(): any;
        getDefaultMatchSettings(): any;
        getBranchName(): string;
        getParentBranchName(): string;
        getParentBranchBaselineSavedBefore(): string;
        getBaselineBranchName(): string;
        getCompareWithParentBranch(): boolean;
        getIgnoreBaseline(): boolean;
        getProperties(): any[];
        getRender(): boolean;
        getSaveDiffs(): boolean;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/errors/TestFailedError" {
    export = TestFailedError;
    const TestFailedError_base: typeof import("lib/errors/EyesError");
    class TestFailedError extends TestFailedError_base {
        constructor(testResults?: any, messageOrSession?: string | import("lib/server/SessionStartInfo") | undefined);
        _testResults: any;
        getTestResults(): any;
    }
}
declare module "lib/errors/DiffsFoundError" {
    export = DiffsFoundError;
    const DiffsFoundError_base: typeof import("lib/errors/TestFailedError");
    class DiffsFoundError extends DiffsFoundError_base {
        constructor(testResults: any, messageOrSession: string | import("lib/server/SessionStartInfo"));
    }
}
declare module "lib/errors/NewTestError" {
    export = NewTestError;
    const NewTestError_base: typeof import("lib/errors/TestFailedError");
    class NewTestError extends NewTestError_base {
        constructor(testResults: any, messageOrSession: string | import("lib/server/SessionStartInfo"));
    }
}
declare module "lib/errors/OutOfBoundsError" {
    export = OutOfBoundsError;
    const OutOfBoundsError_base: typeof import("lib/errors/EyesError");
    class OutOfBoundsError extends OutOfBoundsError_base {
        constructor(message?: string | undefined, error?: Error | undefined);
    }
}
declare module "lib/errors/EyesDriverOperationError" {
    export = EyesDriverOperationError;
    const EyesDriverOperationError_base: typeof import("lib/errors/EyesError");
    class EyesDriverOperationError extends EyesDriverOperationError_base {
        constructor(message?: string | undefined, error?: Error | undefined);
    }
}
declare module "lib/errors/ElementNotFoundError" {
    export = ElementNotFoundError;
    const ElementNotFoundError_base: typeof import("lib/errors/EyesError");
    class ElementNotFoundError extends ElementNotFoundError_base {
        constructor(selector: any);
    }
}
declare module "lib/handler/PropertyHandler" {
    export = PropertyHandler;
    class PropertyHandler {
        set(obj: any): boolean;
        get(): any;
    }
}
declare module "lib/handler/ReadOnlyPropertyHandler" {
    export = ReadOnlyPropertyHandler;
    const ReadOnlyPropertyHandler_base: typeof import("lib/handler/PropertyHandler");
    class ReadOnlyPropertyHandler extends ReadOnlyPropertyHandler_base {
        constructor(logger?: any, obj?: object | undefined);
        _logger: any;
        _obj: object | null;
    }
}
declare module "lib/handler/SimplePropertyHandler" {
    export = SimplePropertyHandler;
    const SimplePropertyHandler_base: typeof import("lib/handler/PropertyHandler");
    class SimplePropertyHandler extends SimplePropertyHandler_base {
        constructor(obj?: object | undefined);
        _obj: object | null;
    }
}
declare module "lib/utils/StreamUtils" {
    const _exports: {
        ReadableBufferStream: unknown;
        WritableBufferStream: unknown;
    };
    export = _exports;
    const ReadableBufferStream_base: typeof import("stream").Readable;
    class ReadableBufferStream extends ReadableBufferStream_base {
        constructor(buffer: Buffer, options?: object | undefined);
        _buffer: Buffer;
    }
    const WritableBufferStream_base: typeof import("stream").Writable;
    class WritableBufferStream extends WritableBufferStream_base {
        constructor(options?: object | undefined);
        _buffer: Buffer;
        writeInt(value: any): boolean;
        writeShort(value: any): boolean;
        writeByte(value: any): boolean;
        getBuffer(): Buffer;
        resetBuffer(): Buffer;
    }
}
declare module "lib/images/ImageDeltaCompressor" {
    export = ImageDeltaCompressor;
    class ImageDeltaCompressor {
        static compressByRawBlocks(targetData: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | any, targetBuffer: Buffer, sourceData: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | any, blockSize?: number | undefined): Buffer;
    }
}
declare module "lib/utils/ImageUtils" {
    export function parseImage(buffer: Buffer): Promise<import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)>;
    export function packImage(image: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)): Promise<Buffer>;
    export function createImage(width: number, height: number): import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement);
    export function scaleImage(image: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), scaleRatio: number): Promise<import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)>;
    export function resizeImage(image: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), targetWidth: number, targetHeight: number): Promise<import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)>;
    export function cropImage(image: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), region: any): Promise<import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)>;
    export function rotateImage(image: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), degrees: number): Promise<import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)>;
    export function copyPixels(dstImage: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), dstPosition: {
        x: number;
        y: number;
    }, srcImage: import("png-async").Image | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement), srcPosition: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): void;
    export function getImageSizeFromBuffer(imageBuffer: Buffer): {
        width: number;
        height: number;
    };
}
declare module "lib/images/MutableImage" {
    export = MutableImage;
    class MutableImage {
        static newImage(width: number, height: number): MutableImage;
        constructor(image: Buffer | string);
        _imageBuffer: Buffer;
        _isParsed: boolean;
        _imageBmp: any | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement);
        _width: number;
        _height: number;
        _top: number;
        _left: number;
        getCoordinates(): Location;
        setCoordinates(coordinates: Location): void;
        getSize(): import("lib/geometry/RectangleSize");
        getWidth(): number;
        getHeight(): number;
        asObject(): Promise<{
            imageBuffer: Buffer;
            width: number;
            height: number;
        }>;
        scale(scaleRatio: number): Promise<MutableImage>;
        crop(region: any): Promise<MutableImage>;
        getImagePart(region: any): Promise<MutableImage>;
        rotate(degrees: number): Promise<MutableImage>;
        copyRasterData(dx: number, dy: number, srcImage: MutableImage): Promise<any>;
        getImageBuffer(): Promise<Buffer> | null;
        getImageBase64(): Promise<string> | null;
        getImageData(): Promise<any | (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement)> | null;
    }
    const Location: typeof import("lib/geometry/Location");
}
declare module "lib/logging/LogHandler" {
    export = LogHandler;
    class LogHandler {
        constructor(isVerbose?: boolean | undefined);
        setIsVerbose(isVerbose: boolean): void;
        _isVerbose: boolean | undefined;
        getIsVerbose(): boolean;
        open(): void;
        close(): void;
        onMessage(verbose: boolean, logString: string): void;
    }
}
declare module "lib/logging/ConsoleLogHandler" {
    export = ConsoleLogHandler;
    const ConsoleLogHandler_base: typeof import("lib/logging/LogHandler");
    class ConsoleLogHandler extends ConsoleLogHandler_base {
        constructor(isVerbose?: boolean | undefined);
    }
}
declare module "lib/logging/DebugLogHandler" {
    export = DebugLogHandler;
    const DebugLogHandler_base: typeof import("lib/logging/LogHandler");
    class DebugLogHandler extends DebugLogHandler_base {
        constructor(isVerbose?: boolean | undefined, appName?: string | undefined, debugInstance?: object | undefined);
        _debug: any;
        extend(name: string): DebugLogHandler;
    }
}
declare module "lib/logging/FileLogHandler" {
    export = FileLogHandler;
    const FileLogHandler_base: typeof import("lib/logging/LogHandler");
    class FileLogHandler extends FileLogHandler_base {
        constructor(isVerbose: boolean, filename?: string | undefined, append?: boolean | undefined);
        _filename: string;
        _append: boolean;
        _writer: import("fs").WriteStream | undefined;
    }
}
declare module "lib/utils/PerformanceUtils" {
    export function start(name?: string | undefined, storeResults?: boolean | undefined): object;
    export function end(name: string, deleteResults?: boolean | undefined): {
        name: string;
        time: number;
        summary: string;
    };
    export function result(name: string): {
        name: string;
        time: number;
        summary: string;
    };
    export function elapsedString(milliseconds: number): string;
}
declare module "lib/logging/NullLogHandler" {
    export = NullLogHandler;
    const NullLogHandler_base: typeof import("lib/logging/LogHandler");
    class NullLogHandler extends NullLogHandler_base {
        constructor(isVerbose?: boolean | undefined);
    }
}
declare module "lib/logging/Logger" {
    export = Logger;
    class Logger {
        constructor(showLogs?: string | boolean | undefined, debugAppName?: string | undefined);
        _logHandler: import("lib/logging/ConsoleLogHandler") | import("lib/logging/DebugLogHandler");
        _sessionId: string;
        _isIncludeTime: boolean;
        setSessionId(sessionId: string): void;
        setIncludeTime(isIncludeTime: boolean): void;
        getLogHandler(): any;
        setLogHandler(handler?: any): void;
        extend(name: string): Logger;
        verbose(...args: any): void;
        log(...args: any): void;
        private _getFormattedString;
        private _getMethodName;
    }
}
declare module "lib/useragent/BrowserNames" {
    export = BrowserNames;
    const BrowserNames: Readonly<{
        Edge: string;
        IE: string;
        Firefox: string;
        Chrome: string;
        Safari: string;
        Chromium: string;
    }>;
    namespace BrowserNames {
        export { BrowserName };
    }
    type BrowserName = string;
}
declare module "lib/useragent/OSNames" {
    export = OSNames;
    const OSNames: Readonly<{
        Android: string;
        ChromeOS: string;
        IOS: string;
        Linux: string;
        Macintosh: string;
        MacOSX: string;
        Unknown: string;
        Windows: string;
    }>;
    namespace OSNames {
        export { OSName };
    }
    type OSName = string;
}
declare module "lib/useragent/UserAgent" {
    export = UserAgent;
    class UserAgent {
        static parseUserAgentString(userAgent: string, unknowns: boolean): UserAgent;
        _OS: string;
        _OSMajorVersion: string;
        _OSMinorVersion: string;
        _browser: string;
        _browserMajorVersion: string;
        _browserMinorVersion: string;
        getBrowser(): string;
        getBrowserMajorVersion(): string;
        getBrowserMinorVersion(): string;
        getOS(): string;
        getOSMajorVersion(): string;
        getOSMinorVersion(): string;
    }
}
declare module "lib/utils/ConfigUtils" {
    export function getConfig({ configParams, configPath, logger, }?: {
        configParams?: any[] | undefined;
        configPath: any;
        logger?: import("lib/logging/Logger") | undefined;
    }): {};
    export function toEnvVarName(camelCaseStr: string): string;
}
declare module "lib/utils/deserializeDomSnapshotResult" {
    export = deserializeDomSnapshotResult;
    function deserializeDomSnapshotResult(domSnapshotResult: any): any;
}
declare module "lib/DomCapture" {
    export = DomCapture;
    class DomCapture {
        static getFullWindowDom(logger: any, driver: any | any, positionProvider?: any, returnType?: {
            OBJECT: string;
            STRING: string;
        } | undefined, script?: string | undefined): Promise<string | object>;
        constructor(logger: any, driver: any | any, script?: string | undefined);
        _logger: any;
        _driver: any;
        _customScript: string | undefined;
        getBrowserName(): Promise<any>;
        getBrowserVersion(): Promise<any>;
        isInternetExplorer(): Promise<boolean>;
        isEdgeClassic(): Promise<boolean | undefined>;
        needsIEScript(): Promise<boolean | undefined>;
        getWindowDom(): Promise<{
            string;
        }>;
        getFrameDom(script: string, url: string): Promise<{
            string;
        }>;
        getLocation(): Promise<any>;
        private _switchToFrame;
        private _switchToParentFrame;
        private _downloadCss;
        getDriver(): any;
    }
    namespace DomCapture {
        export { DomCaptureReturnType };
    }
    namespace DomCaptureReturnType {
        export const OBJECT: string;
        export const STRING: string;
    }
}
declare module "lib/capture/AppOutputProvider" {
    export = AppOutputProvider;
    class AppOutputProvider {
        getAppOutput(region: any, lastScreenshot: any, checkSettings: any): Promise<any>;
    }
}
declare module "lib/capture/AppOutputWithScreenshot" {
    export = AppOutputWithScreenshot;
    class AppOutputWithScreenshot {
        constructor(appOutput: any, screenshot: any);
        _appOutput: any;
        _screenshot: any;
        getAppOutput(): any;
        getScreenshot(): any;
    }
}
declare module "lib/capture/EyesScreenshot" {
    export = EyesScreenshot;
    class EyesScreenshot {
        constructor(image: any);
        _image: any;
        getImage(): any;
        getSubScreenshot(region: import("lib/geometry/Region"), throwIfClipped: boolean): Promise<EyesScreenshot>;
        convertLocation(location: Location, from: any, to: any): Location;
        getLocationInScreenshot(location: Location, coordinatesType: any): Location;
        getIntersectedRegion(region: import("lib/geometry/Region"), coordinatesType: any): import("lib/geometry/Region");
        convertRegionLocation(region: import("lib/geometry/Region"), from: any, to: any): import("lib/geometry/Region");
    }
}
declare module "lib/frames/FrameChain" {
    export = FrameChain;
    class FrameChain {
        static equals(leftFrameChain: FrameChain, rightFrameChain: FrameChain): Promise<boolean>;
        constructor(logger: Logger, other: FrameChain);
        _logger: import("lib/logging/Logger");
        _frames: any;
        get size(): number;
        get isEmpty(): boolean;
        get first(): any;
        get current(): any;
        frameAt(index: number): any;
        clear(): void;
        clone(): FrameChain;
        pop(): any | null;
        push(frame: any): any;
        getCurrentFrameOffset(): Location;
        getCurrentFrameLocationInViewport(): Location;
        getCurrentFrameEffectiveSize(): RectangleSize;
        [Symbol.iterator](): any;
    }
    namespace FrameChain {
        export { Logger, Location, RectangleSize };
    }
    const Location: typeof import("lib/geometry/Location");
    const RectangleSize: typeof import("lib/geometry/RectangleSize");
    type Logger = import("lib/logging/Logger");
    type Location = import("lib/geometry/Location");
    type RectangleSize = import("lib/geometry/RectangleSize");
}
declare module "lib/EyesJsSnippets" {
    export const GET_VIEWPORT_SIZE: string;
    export const GET_CONTENT_ENTIRE_SIZE: "\n  var scrollWidth = document.documentElement.scrollWidth;\n  var bodyScrollWidth = document.body.scrollWidth;\n  var totalWidth = Math.max(scrollWidth, bodyScrollWidth);\n  var clientHeight = document.documentElement.clientHeight;\n  var bodyClientHeight = document.body.clientHeight;\n  var scrollHeight = document.documentElement.scrollHeight;\n  var bodyScrollHeight = document.body.scrollHeight;\n  var maxDocElementHeight = Math.max(clientHeight, scrollHeight);\n  var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight);\n  var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight);\n  return [totalWidth, totalHeight];\n";
    export const GET_ELEMENT_ENTIRE_SIZE: "\n  var element = arguments[0];\n  return [\n    Math.max(element.clientWidth, element.scrollWidth),\n    Math.max(element.clientHeight, element.scrollHeight)\n  ];\n";
    export const GET_ELEMENT_RECT: "\n  var element = arguments[0];\n  var rect = element.getBoundingClientRect();\n  var computedStyle = window.getComputedStyle(element);\n  var isFixed = isFixedElement(element);\n  return {\n    x: isFixed ? element.offsetLeft : rect.left + (window.scrollX || window.pageXOffset),\n    y: isFixed ? element.offsetTop : rect.top + (window.scrollY || window.pageYOffset),\n    width: rect.width,\n    height: rect.height\n  };\n\n  function isFixedElement(element) {\n    var offsetElement = element;\n    while (offsetElement && offsetElement !== document.body && offsetElement !== document.documentElement) {\n      offsetElement = offsetElement.offsetParent;\n    }\n    if (!offsetElement) return true;\n    var position = window.getComputedStyle(offsetElement).getPropertyValue('position');\n    return position === 'fixed';\n  }\n";
    export const GET_ELEMENT_CLIENT_RECT: "\n  var element = arguments[0];\n  var rect = element.getBoundingClientRect();\n  var computedStyle = window.getComputedStyle(element);\n  var borderLeftWidth = parseInt(computedStyle.getPropertyValue('border-left-width'));\n  var borderTopWidth = parseInt(computedStyle.getPropertyValue('border-top-width'));\n  var isFixed = isFixedElement(element);\n  return {\n    x: (isFixed ? element.offsetLeft : rect.left + (window.scrollX || window.pageXOffset)) + borderLeftWidth,\n    y: (isFixed ? element.offsetTop : rect.top + (window.scrollY || window.pageYOffset)) + borderTopWidth,\n    width: element.clientWidth,\n    height: element.clientHeight\n  };\n\n  function isFixedElement(element) {\n    var offsetElement = element;\n    while (offsetElement && offsetElement !== document.body && offsetElement !== document.documentElement) {\n      offsetElement = offsetElement.offsetParent;\n    }\n    if (!offsetElement) return true;\n    var position = window.getComputedStyle(offsetElement).getPropertyValue('position');\n    return position === 'fixed';\n  }\n";
    export const GET_ELEMENT_CSS_PROPERTIES: "\n  var properties = arguments[0];\n  var element = arguments[1];\n  var computedStyle = window.getComputedStyle(element, null);\n  return computedStyle\n    ? properties.map(function(property) { return computedStyle.getPropertyValue(property); })\n    : [];\n";
    export const GET_ELEMENT_PROPERTIES: "\n  var properties = arguments[0];\n  var element = arguments[1];\n  return properties.map(function(property) { return element[property]; });\n";
    export const GET_SCROLL_POSITION: "\n  var element = arguments[0] || document.scrollingElement;\n  if (element) return [element.scrollLeft, element.scrollTop];\n  else {\n    var doc = document.documentElement;\n    return [\n      window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)),\n      window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0))\n    ];\n  }\n";
    export const SCROLL_TO: "\n  var offset = arguments[0];\n  var element = arguments[1] || document.scrollingElement || document.documentElement;\n  if (element.scrollTo) {\n    element.scrollTo(offset.x, offset.y);\n  } else {\n    element.scrollTop = offset.x;\n    element.scrollLeft = offset.y;\n  }\n  return [element.scrollLeft, element.scrollTop];\n";
    export const GET_TRANSFORMS: string;
    export function SET_TRANSFORMS(transforms: any): string;
    export function TRANSLATE_TO(x: any, y: any): string;
    export const IS_SCROLLABLE: "\n  var element = arguments[0] || document.scrollingElement || document.documentElement;\n  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight\n";
    export const GET_SCROLL_ROOT_ELEMENT: "\n  return document.scrollingElement || document.documentElement;\n";
    export const MARK_SCROLL_ROOT_ELEMENT: "\n  var element =  arguments[0] || document.scrollingElement || document.documentElement;\n  element.setAttribute(\"data-applitools-scroll\", \"true\");\n";
    export const GET_OVERFLOW: "\n  var el = arguments[0];\n  return el.style.overflow;\n";
    export function SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE(overflow: any): string;
    export const BLUR_ELEMENT: "\n  var activeElement = arguments[0] || document.activeElement;\n  if (activeElement) activeElement.blur();\n  return activeElement;\n";
    export const FOCUS_ELEMENT: "\n  var activeElement = arguments[0];\n  if (activeElement) activeElement.focus();\n";
    export const GET_ELEMENT_XPATH: string;
    export const GET_ELEMENT_ABSOLUTE_XPATH: string;
    export const GET_CURRENT_CONTEXT_INFO: string;
    export const GET_FRAME_BY_NAME_OR_ID: "\n  var nameOrId = arguments[0];\n  return document.querySelector('iframe[name=\"' + nameOrId + '\"],iframe#' + nameOrId)\n";
    export const GET_FRAMES: "\n  var frames = document.querySelectorAll('frame, iframe');\n  return Array.prototype.map.call(frames, function(frameElement) {\n    return {\n      isCORS: !frameElement.contentDocument,\n      element: frameElement,\n      src: frameElement.src\n    };\n  });\n";
    export const GET_DOCUMENT_ELEMENT: "\n  return document.documentElement\n";
}
declare module "lib/wrappers/EyesWrappedElement" {
    export = EyesWrappedElement;
    class EyesWrappedElement {
        static specialize(SpecsWrappedElement: SpecsWrappedElement): EyesWrappedElement;
        static get specs(): SpecsWrappedElement;
        static fromElement(element: SupportedElement): EyesWrappedElement;
        static fromSelector(selector: SupportedSelector): EyesWrappedElement;
        static isCompatible(element: any): boolean;
        static isSelector(selector: any): boolean;
        static toSupportedSelector(selector: EyesSelector): SupportedSelector;
        static toEyesSelector(selector: SupportedSelector): EyesSelector;
        static extractId(element: EyesWrappedElement | UnwrappedElement): Promise<string>;
        static equals(leftElement: EyesWrappedElement | UnwrappedElement, rightElement: EyesWrappedElement | UnwrappedElement): Promise<boolean>;
        constructor(logger?: import("lib/logging/Logger") | undefined, driver?: import("lib/wrappers/EyesWrappedDriver") | undefined, element?: SupportedElement | undefined, selector?: SupportedSelector | undefined);
        get specs(): SpecsWrappedElement;
        _element: UnwrappedElement | undefined;
        _selector: SupportedSelector | undefined;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        get elementId(): Promise<string>;
        get selector(): SupportedSelector;
        get unwrapped(): UnwrappedElement;
        equals(otherFrame: any): Promise<boolean>;
        init(driver: EyesWrappedDriver): Promise<this>;
        getRect(): Promise<Region>;
        getClientRect(): Promise<Region>;
        getSize(): Promise<RectangleSize>;
        getLocation(): Promise<Location>;
        getCssProperty(...properties: string[]): Promise<string[] | string>;
        getProperty(...properties: string[]): Promise<any[] | any>;
        hideScrollbars(): Promise<string | null>;
        _originalOverflow: string | null | undefined;
        restoreScrollbars(): Promise<void>;
        preservePosition(positionProvider: any): Promise<any>;
        _positionMemento: any;
        restorePosition(positionProvider: any): Promise<any>;
        refresh(freshElement?: UnwrappedElement | undefined): boolean;
        withRefresh(operation: Function): Promise<any>;
    }
    namespace EyesWrappedElement {
        export { Logger, Region, Location, RectangleSize, EyesWrappedDriver, SupportedElement, SupportedSelector, UnwrappedElement, EyesSelector, SpecsWrappedElement };
    }
    type SpecsWrappedElement = {
        isCompatible: (element: any) => boolean;
        isSelector: (selector: any) => boolean;
        toSupportedSelector: (selector: EyesSelector) => SupportedSelector;
        toEyesSelector: (selector: SupportedSelector) => EyesSelector;
        extractId: (element: UnwrappedElement) => Promise<string>;
        extractElement?: (element: SupportedElement) => UnwrappedElement;
        extractSelector?: (element: SupportedElement) => SupportedSelector;
        isStaleElementReferenceResult?: (result: any) => boolean;
    };
    type UnwrappedElement = {
        "": unknown;
    };
    type SupportedSelector = {
        "": unknown;
    };
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type Region = import("lib/geometry/Region");
    type RectangleSize = import("lib/geometry/RectangleSize");
    type Location = import("lib/geometry/Location");
    type SupportedElement = {
        "": unknown;
    };
    type EyesSelector = {
        type: 'css' | 'xpath';
        selector: string;
    };
    type Logger = import("lib/logging/Logger");
}
declare module "lib/wrappers/EyesJsExecutor" {
    export = EyesJsExecutor;
    class EyesJsExecutor {
        static specialize(SpecsJsExecutor: SpecsJsExecutor): EyesJsExecutor;
        static get specs(): SpecsJsExecutor;
        constructor(logger: Logger, driver: EyesWrappedDriver);
        get specs(): SpecsJsExecutor;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        executeScript(script: (string | Function), ...args: any[]): Promise<any>;
        sleep(ms: number): Promise<void>;
    }
    namespace EyesJsExecutor {
        export { Logger, EyesWrappedDriver, SpecsJsExecutor };
    }
    type SpecsJsExecutor = {
        executeScript: (driver: any, script: string | Function, ...args: any[]) => Promise<any>;
        sleep: (driver: any, ms: number) => Promise<void>;
    };
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
}
declare module "lib/wrappers/EyesElementFinder" {
    export = EyesElementFinder;
    class EyesElementFinder {
        static specialize(SpecsElementFinder: SpecsElementFinder): EyesElementFinder;
        static get specs(): SpecsElementFinder;
        constructor(logger: Logger, driver: EyesWrappedDriver);
        get specs(): SpecsElementFinder;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        findElement(selector: SupportedSelector): Promise<EyesWrappedElement>;
        findElements(selector: SupportedSelector): Promise<EyesWrappedElement[]>;
    }
    namespace EyesElementFinder {
        export { Logger, EyesWrappedDriver, UnwrappedDriver, EyesWrappedElement, SupportedElement, EyesSelector, SupportedSelector, SpecsElementFinder };
    }
    type SpecsElementFinder = {
        findElement: (driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement;
        findElements: (driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement;
        createElement: (logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement;
        toSupportedSelector: (selector: EyesSelector) => SupportedSelector;
        toEyesSelector: (selector: SupportedSelector) => EyesSelector;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = {
        "": any;
    };
    type SupportedElement = {
        "": any;
    };
    type EyesSelector = {
        type: "xpath" | "css";
        selector: string;
    };
}
declare module "lib/wrappers/EyesDriverController" {
    export = EyesDriverController;
    class EyesDriverController {
        static specialize(SpecsDriverController: SpecsDriverController): EyesDriverController;
        static get specs(): SpecsDriverController;
        constructor(logger: any, driver: EyesWrappedDriver);
        get specs(): SpecsDriverController;
        _logger: any;
        _driver: import("lib/wrappers/EyesWrappedDriver");
        getWindowLocation(): Promise<Location>;
        setWindowLocation(location: Location): Promise<void>;
        getWindowSize(): Promise<import("lib/geometry/RectangleSize")>;
        setWindowSize(size: import("lib/geometry/RectangleSize")): Promise<void>;
        takeScreenshot(): Promise<import("lib/images/MutableImage")>;
        isLandscapeOrientation(): Promise<boolean>;
        isMobile(): Promise<boolean>;
        isNative(): Promise<boolean>;
        getMobileOS(): Promise<string | null>;
        getAUTSessionId(): Promise<string>;
        getUserAgent(): Promise<string>;
        getTitle(): Promise<string>;
        getSource(): Promise<string>;
    }
    namespace EyesDriverController {
        export { EyesWrappedDriver, UnwrappedDriver, SpecsDriverController };
    }
    type SpecsDriverController = {
        getWindowLocation: (driver: UnwrappedDriver) => Promise<{
            x: number;
            y: number;
        }>;
        setWindowLocation: (driver: UnwrappedDriver, location: {
            x: number;
            y: number;
        }) => Promise<void>;
        getWindowSize: (driver: UnwrappedDriver) => Promise<{
            width: number;
            height: number;
        }>;
        setWindowSize: (driver: UnwrappedDriver, location: {
            width: number;
            height: number;
        }) => Promise<void>;
        getOrientation: (driver: UnwrappedDriver) => Promise<'landscape' | 'portrait'>;
        isMobile: (driver: UnwrappedDriver) => Promise<boolean>;
        isAndroid: (driver: UnwrappedDriver) => Promise<boolean>;
        isIOS: (driver: UnwrappedDriver) => Promise<boolean>;
        isNative: (driver: UnwrappedDriver) => Promise<boolean>;
        getPlatformVersion: (driver: UnwrappedDriver) => Promise<string>;
        getSessionId: (driver: UnwrappedDriver) => Promise<string>;
        takeScreenshot: (driver: UnwrappedDriver) => Promise<string | Buffer>;
        getTitle: (driver: UnwrappedDriver) => Promise<string>;
        getSource: (driver: UnwrappedDriver) => Promise<string>;
        visit: (driver: UnwrappedDriver, url: string) => Promise<void>;
    };
    const Location: typeof import("lib/geometry/Location");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = {
        "": any;
    };
}
declare module "lib/wrappers/EyesWrappedDriver" {
    export = EyesWrappedDriver;
    class EyesWrappedDriver {
        static specialize(SpecsWrappedDriver: SpecsWrappedDriver, overrides: any): EyesWrappedDriver;
        static get overrides(): {
            [x: string]: Function;
        };
        static get specs(): import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
        static get JsExecutor(): import("lib/wrappers/EyesJsExecutor");
        static get BrowsingContext(): import("lib/wrappers/EyesBrowsingContext");
        static get ElementFinder(): import("lib/wrappers/EyesElementFinder");
        static get DriverController(): import("lib/wrappers/EyesDriverController");
        constructor(logger: Logger, driver: UnwrappedDriver);
        get overrides(): {
            [x: string]: Function;
        };
        get specs(): import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
        get JsExecutor(): import("lib/wrappers/EyesJsExecutor");
        get BrowsingContext(): import("lib/wrappers/EyesBrowsingContext");
        get ElementFinder(): import("lib/wrappers/EyesElementFinder");
        get DriverController(): import("lib/wrappers/EyesDriverController");
        _logger: import("lib/logging/Logger");
        _driver: any;
        _executor: any;
        _finder: any;
        _context: any;
        _controller: any;
        _proxy: EyesWrappedDriver;
        get unwrapped(): UnwrappedDriver;
        get executor(): import("lib/wrappers/EyesJsExecutor");
        get context(): import("lib/wrappers/EyesBrowsingContext");
        get finder(): import("lib/wrappers/EyesElementFinder");
        get controller(): import("lib/wrappers/EyesDriverController");
    }
    namespace EyesWrappedDriver {
        export { Logger, SpecsJsExecutor, SpecsBrowsingContext, SpecsElementFinder, SpecsDriverController, UnwrappedDriver, DriverOverrides, SpecsWrappedDriver };
    }
    type UnwrappedDriver = {
        "": unknown;
    };
    type SpecsWrappedDriver = import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
    type Logger = import("lib/logging/Logger");
    type SpecsJsExecutor = {
        executeScript: (driver: any, script: TimerHandler, ...args: any[]) => Promise<any>;
        sleep: (driver: any, ms: number) => Promise<void>;
    };
    type SpecsBrowsingContext = {
        isEqualFrames: (leftFrame: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame"), rightFrame: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => Promise<boolean>;
        createFrameReference: (reference: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => any;
        switchToFrame: (driver: any, reference: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => void;
        switchToParentFrame: (driver: any) => void;
    };
    type SpecsElementFinder = {
        findElement: (driver: UnwrappedDriver, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        findElements: (driver: UnwrappedDriver, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        createElement: (logger: import("lib/logging/Logger"), driver: EyesWrappedDriver, element: import("lib/wrappers/EyesWrappedElement").SupportedElement, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        toSupportedSelector: (selector: import("lib/wrappers/EyesWrappedElement").EyesSelector) => import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        toEyesSelector: (selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement").EyesSelector;
    };
    type SpecsDriverController = {
        getWindowLocation: (driver: UnwrappedDriver) => Promise<{
            x: number;
            y: number;
        }>;
        setWindowLocation: (driver: UnwrappedDriver, location: {
            x: number;
            y: number;
        }) => Promise<void>;
        getWindowSize: (driver: UnwrappedDriver) => Promise<{
            width: number;
            height: number;
        }>;
        setWindowSize: (driver: UnwrappedDriver, location: {
            width: number;
            height: number;
        }) => Promise<void>;
        getOrientation: (driver: UnwrappedDriver) => Promise<"landscape" | "portrait">;
        isMobile: (driver: UnwrappedDriver) => Promise<boolean>;
        isAndroid: (driver: UnwrappedDriver) => Promise<boolean>;
        isIOS: (driver: UnwrappedDriver) => Promise<boolean>;
        isNative: (driver: UnwrappedDriver) => Promise<boolean>;
        getPlatformVersion: (driver: UnwrappedDriver) => Promise<string>;
        getSessionId: (driver: UnwrappedDriver) => Promise<string>;
        takeScreenshot: (driver: UnwrappedDriver) => Promise<string | Buffer>;
        getTitle: (driver: UnwrappedDriver) => Promise<string>;
        getSource: (driver: UnwrappedDriver) => Promise<string>;
        visit: (driver: UnwrappedDriver, url: string) => Promise<void>;
    };
    type DriverOverrides = {
        switchToFrame: (reference: any) => Promise<any>;
        switchToParentFrame: () => Promise<any>;
        visit: (url: string) => Promise<any>;
    };
}
declare module "lib/frames/Frame" {
    export = Frame;
    class Frame {
        static specialize(SpecsFrame: SpecsFrame): Frame;
        static get specs(): SpecsFrame;
        static fromReference(reference: FrameReference, scrollRootElement: EyesWrappedElement): Frame;
        static isReference(reference: any): boolean;
        static equals(leftFrame: Frame | EyesWrappedDriver, rightFrame: Frame | EyesWrappedDriver): Promise<boolean>;
        constructor(logger: Logger, driver: EyesWrappedDriver, frame: {
            element: EyesWrappedElement;
            location: Location;
            size: RectangleSize;
            innerSize: RectangleSize;
            parentScrollLocation: Location;
            scrollRootElement: EyesWrappedElement;
        });
        get specs(): SpecsFrame;
        _reference: {
            element: EyesWrappedElement;
            location: Location;
            size: RectangleSize;
            innerSize: RectangleSize;
            parentScrollLocation: Location;
            scrollRootElement: EyesWrappedElement;
        };
        _element: import("lib/wrappers/EyesWrappedElement");
        _location: import("lib/geometry/Location");
        _size: import("lib/geometry/RectangleSize");
        _innerSize: import("lib/geometry/RectangleSize");
        _parentScrollLocation: import("lib/geometry/Location");
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        _logger: import("lib/logging/Logger");
        get element(): import("lib/wrappers/EyesWrappedElement");
        get location(): import("lib/geometry/Location");
        get size(): import("lib/geometry/RectangleSize");
        get innerSize(): import("lib/geometry/RectangleSize");
        get parentScrollLocation(): import("lib/geometry/Location");
        set scrollRootElement(arg: import("lib/wrappers/EyesWrappedElement"));
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        toReference(): Frame;
        equals(otherFrame: Frame | EyesWrappedDriver): Promise<boolean>;
        init(logger: Logger, driver: EyesWrappedDriver): this;
        refresh(): this;
        hideScrollbars(): Promise<void>;
        restoreScrollbars(): Promise<void>;
        preservePosition(positionProvider: any): Promise<void>;
        restorePosition(positionProvider: any): Promise<void>;
    }
    namespace Frame {
        export { Logger, Location, RectangleSize, EyesWrappedElement, SupportedElement, SupportedSelector, EyesWrappedDriver, FrameReference, SpecsFrame };
    }
    type SpecsFrame = {
        isSelector: (selector: any) => boolean;
        isCompatibleElement: (element: any) => boolean;
        isEqualElements: (leftElement: SupportedElement | EyesWrappedElement, rightElement: SupportedElement | EyesWrappedElement) => Promise<boolean>;
        createElement: (logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    const Location: typeof import("lib/geometry/Location");
    const RectangleSize: typeof import("lib/geometry/RectangleSize");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type Logger = import("lib/logging/Logger");
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type Location = import("lib/geometry/Location");
    type RectangleSize = import("lib/geometry/RectangleSize");
    type SupportedElement = {
        "": any;
    };
    type SupportedSelector = {
        "": any;
    };
}
declare module "lib/wrappers/EyesBrowsingContext" {
    export = EyesBrowsingContext;
    class EyesBrowsingContext {
        static specialize(SpecsBrowsingContext: SpecsBrowsingContext): EyesBrowsingContext;
        static get specs(): SpecsBrowsingContext;
        constructor(logger: Logger, driver: EyesWrappedDriver);
        get specs(): SpecsBrowsingContext;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        _frameChain: import("lib/frames/FrameChain");
        get frameChain(): import("lib/frames/FrameChain");
        reset(): void;
        frame(reference: FrameReference): Promise<void>;
        frameDefault(): Promise<void>;
        frameParent(elevation?: number | undefined): Promise<void>;
        frames(path: Iterable<FrameReference>): Promise<void>;
        framesAppend(path: Iterable<FrameReference>): Promise<void>;
        framesRefresh(): Promise<any>;
        framesSwitchAndReturn(framePath: any, operation: Function): Promise<any>;
        framesAppendAndReturn(framePath: any, operation: Function): Promise<any>;
    }
    namespace EyesBrowsingContext {
        export { Logger, EyesWrappedDriver, UnwrappedDriver, FrameReference, SpecsBrowsingContext };
    }
    type SpecsBrowsingContext = {
        isEqualFrames: (leftFrame: FrameReference, rightFrame: FrameReference) => Promise<boolean>;
        createFrameReference: (reference: FrameReference) => any;
        switchToFrame: (driver: any, reference: FrameReference) => void;
        switchToParentFrame: (driver: any) => void;
    };
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = any;
}
declare module "lib/positioning/PositionProvider" {
    export = PositionProvider;
    class PositionProvider {
        getCurrentPosition(): Promise<Location>;
        setPosition(location: Location): Promise<Location>;
        getEntireSize(): Promise<any>;
        getState(): Promise<any>;
        restoreState(state: any): Promise<any>;
        getScrolledElement(): any;
        toString(): string;
    }
}
declare module "lib/EyesUtils" {
    export type Logger = import("lib/logging/Logger");
    export type EyesBrowsingContext = import("lib/wrappers/EyesBrowsingContext");
    export type EyesDriverController = import("lib/wrappers/EyesDriverController");
    export type EyesElementFinder = import("lib/wrappers/EyesElementFinder");
    export type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    export type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    export type UnwrappedElement = {
        "": any;
    };
    export type SupportedSelector = {
        "": any;
    };
    export type PositionProvider = import("lib/positioning/PositionProvider");
    export type ContextInfo = {
        isRoot: boolean;
        isCORS: boolean;
        document: UnwrappedElement;
        frameSelector: string;
    };
    export type FrameInfo = {
        isCORS: boolean;
        element: UnwrappedElement;
        selector: string;
    };
    export function getViewportSize(_logger: Logger, { executor }: {
        executor: EyesJsExecutor;
    }): import("lib/geometry/RectangleSize");
    export function setViewportSize(logger: Logger, { controller, executor, context }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }, requiredViewportSize: import("lib/geometry/RectangleSize")): Promise<any>;
    export function getTopContextViewportRect(logger: Logger, { controller, executor, context }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): import("lib/geometry/Region");
    export function getTopContextViewportSize(logger: Logger, { controller, context, executor }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): import("lib/geometry/Region");
    export function getCurrentFrameContentEntireSize(_logger: Logger, executor: EyesJsExecutor): import("lib/geometry/Region");
    export function getElementEntireSize(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    export function getElementClientRect(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    export function getElementRect(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    export function getElementProperties(_logger: Logger, executor: EyesJsExecutor, properties: string[], element: EyesWrappedElement | UnwrappedElement): any[];
    export function getElementCssProperties(_logger: Logger, executor: EyesJsExecutor, properties: string[], element: EyesWrappedElement | UnwrappedElement): string[];
    export function getDevicePixelRatio(_logger: Logger, { executor }: {
        executor: EyesJsExecutor;
    }): Promise<number>;
    export function getMobilePixelRatio(_logger: Logger, { controller }: {
        controller: EyesDriverController;
    }, viewportSize: any): Promise<number>;
    export function getTopContextScrollLocation(logger: Logger, { context, executor }: {
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): Promise<Location>;
    export function getScrollLocation(_logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<Location>;
    export function scrollTo(_logger: Logger, executor: EyesJsExecutor, location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<Location>;
    export function getTransforms(_logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<Object>;
    export function setTransforms(_logger: Logger, executor: EyesJsExecutor, transforms: Object, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<any>;
    export function getTranslateLocation(_logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<Location>;
    export function translateTo(_logger: Logger, executor: EyesJsExecutor, location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<Location>;
    export function isScrollable(_logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<boolean>;
    export function getScrollRootElement(_logger: Logger, executor: EyesJsExecutor): Promise<UnwrappedElement>;
    export function markScrollRootElement(_logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<any>;
    export function getOverflow(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string | null>;
    export function setOverflow(_logger: Logger, executor: EyesJsExecutor, overflow: any, element: EyesWrappedElement | UnwrappedElement): Promise<string | null>;
    export function blurElement(logger: Logger, executor: EyesJsExecutor, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined): Promise<UnwrappedElement | null>;
    export function focusElement(logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<any>;
    export function getElementXpath(logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string>;
    export function getElementAbsoluteXpath(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string>;
    export function locatorToPersistedRegions(logger: Logger, { finder, executor }: {
        finder: EyesElementFinder;
        executor: EyesJsExecutor;
    }, selector: SupportedSelector): Promise<{
        type: string;
        selector: string;
    }[]>;
    export function ensureRegionVisible(logger: Logger, { controller, context, executor }: {
        controller: EyesDriverController;
        context: EyesBrowsingContext;
        executor: EyesJsExecutor;
    }, positionProvider: PositionProvider, region: Promise<import("lib/geometry/Region")>): Promise<Location | import("lib/geometry/Location") | undefined>;
    export function ensureFrameVisible(_logger: Logger, context: EyesBrowsingContext, positionProvider: PositionProvider, offset?: Location | undefined): Promise<Location>;
    export function getCurrentContextInfo(_logger: Logger, executor: EyesJsExecutor): Promise<ContextInfo>;
    export function getFrameByNameOrId(_logger: Logger, executor: EyesJsExecutor, nameOrId: string): UnwrappedElement;
    export function findFrameByContext(_logger: Logger, { executor, context }: {
        context: EyesBrowsingContext;
        executor: EyesJsExecutor;
    }, contextInfo: ContextInfo, comparator: (left: UnwrappedElement, right: UnwrappedElement) => Promise<boolean>): Promise<any>;
}
declare module "lib/capture/EyesScreenshotNew" {
    export = EyesScreenshot;
    class EyesScreenshot {
        static getScreenshotType(image: MutableImage, eyes: any): Promise<ScreenshotType>;
        static fromFrameSize(logger: Logger, eyes: any, image: MutableImage, entireFrameSize: import("lib/geometry/RectangleSize")): Promise<EyesScreenshot>;
        static fromScreenshotType(logger: Logger, eyes: any, image: MutableImage, screenshotType?: number | undefined, frameLocationInScreenshot?: Location | undefined): Promise<EyesScreenshot>;
        constructor(logger: Logger, eyes: any, image: MutableImage);
        _logger: import("lib/logging/Logger");
        _image: import("lib/images/MutableImage");
        _eyes: any;
        _frameChain: import("lib/frames/FrameChain");
        _screenshotType: ScreenshotType;
        _currentFrameScrollPosition: Location;
        _frameLocationInScreenshot: Location;
        _frameSize: import("lib/geometry/RectangleSize");
        _frameRect: import("lib/geometry/Region");
        initFromFrameSize(entireFrameSize: import("lib/geometry/RectangleSize")): Promise<EyesScreenshot>;
        init(screenshotType?: number | undefined, frameLocationInScreenshot?: Location | undefined): Promise<EyesScreenshot>;
        getImage(): MutableImage;
        getFrameWindow(): import("lib/geometry/Region");
        getFrameChain(): import("lib/frames/FrameChain");
        getLocationInScreenshot(location: Location, coordinatesType: any): Location;
        _location: Location | undefined;
        getIntersectedRegion(region: import("lib/geometry/Region"), resultCoordinatesType: any): import("lib/geometry/Region");
        convertRegionLocation(region: import("lib/geometry/Region"), from: any, to: any): import("lib/geometry/Region");
        convertLocation(location: Location, from: any, to: any): Location;
        getIntersectedRegionFromElement(element: EyesWrappedElement): Promise<import("lib/geometry/Region")>;
        getSubScreenshot(region: import("lib/geometry/Region"), throwIfClipped: boolean): Promise<EyesScreenshot>;
    }
    namespace EyesScreenshot {
        export { ScreenshotTypes, Logger, MutableImage, EyesWrappedElement, ScreenshotType };
    }
    type ScreenshotType = number;
    const Location: typeof import("lib/geometry/Location");
    type MutableImage = import("lib/images/MutableImage");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Logger = import("lib/logging/Logger");
    const ScreenshotTypes: Readonly<any>;
}
declare module "lib/capture/EyesScreenshotFactory" {
    export = EyesScreenshotFactory;
    class EyesScreenshotFactory {
        constructor(logger: any, eyes: any);
        _logger: any;
        _eyes: any;
        makeScreenshot(image: any): Promise<import("lib/capture/EyesScreenshotNew")>;
    }
}
declare module "lib/capture/EyesSimpleScreenshot" {
    export = EyesSimpleScreenshot;
    const EyesSimpleScreenshot_base: typeof import("lib/capture/EyesScreenshot");
    class EyesSimpleScreenshot extends EyesSimpleScreenshot_base {
        constructor(image: any, location?: Location | undefined);
        _bounds: import("lib/geometry/Region");
        getSize(): import("lib/geometry/RectangleSize");
    }
}
declare module "lib/capture/EyesSimpleScreenshotFactory" {
    export = EyesSimpleScreenshotFactory;
    const EyesSimpleScreenshotFactory_base: typeof import("lib/capture/EyesScreenshotFactory");
    class EyesSimpleScreenshotFactory extends EyesSimpleScreenshotFactory_base {
        constructor(logger: any, eyes: any);
    }
}
declare module "lib/cropping/CutProvider" {
    export = CutProvider;
    class CutProvider {
        cut(image: any): Promise<any>;
        scale(scaleRatio: number): CutProvider;
    }
}
declare module "lib/cropping/UnscaledFixedCutProvider" {
    export = UnscaledFixedCutProvider;
    const UnscaledFixedCutProvider_base: typeof import("lib/cropping/CutProvider");
    class UnscaledFixedCutProvider extends UnscaledFixedCutProvider_base {
        constructor(header: number, footer: number, left: number, right: number);
        _header: number;
        _footer: number;
        _left: number;
        _right: number;
    }
}
declare module "lib/cropping/NullCutProvider" {
    export = NullCutProvider;
    const NullCutProvider_base: typeof import("lib/cropping/UnscaledFixedCutProvider");
    class NullCutProvider extends NullCutProvider_base {
    }
}
declare module "lib/positioning/RegionPositionCompensation" {
    export = RegionPositionCompensation;
    class RegionPositionCompensation {
        compensateRegionPosition(region: any, pixelRatio: number): any;
    }
}
declare module "lib/positioning/NullRegionPositionCompensation" {
    export = NullRegionPositionCompensation;
    const NullRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    class NullRegionPositionCompensation extends NullRegionPositionCompensation_base {
    }
}
declare module "lib/capture/FullPageCaptureAlgorithm" {
    export = FullPageCaptureAlgorithm;
    class FullPageCaptureAlgorithm {
        constructor(logger: any, regionPositionCompensation: any, waitBeforeScreenshots: number, debugScreenshotsProvider: any, screenshotFactory: any, originProvider: any, scaleProviderFactory: any, cutProvider: any, stitchingOverlap: number, imageProvider: any, isDoubleOverlap: boolean);
        _logger: any;
        _waitBeforeScreenshots: number;
        _debugScreenshotsProvider: any;
        _screenshotFactory: any;
        _originProvider: any;
        _scaleProviderFactory: any;
        _cutProvider: any;
        _stitchingOverlap: number;
        _imageProvider: any;
        _isDoubleOverlap: boolean;
        _regionPositionCompensation: any;
        private _saveDebugScreenshotPart;
        getStitchedRegion(region: import("lib/geometry/Region"), fullArea: import("lib/geometry/Region"), positionProvider: any): Promise<import("lib/images/MutableImage")>;
        _getRegionInScreenshot(region: import("lib/geometry/Region"), image: import("lib/images/MutableImage"), pixelRatio: number): Promise<import("lib/geometry/Region")>;
    }
}
declare module "lib/capture/ImageProvider" {
    export = ImageProvider;
    class ImageProvider {
        getImage(): Promise<any>;
    }
}
declare module "lib/capture/TakesScreenshotImageProvider" {
    export = TakesScreenshotImageProvider;
    const TakesScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    class TakesScreenshotImageProvider extends TakesScreenshotImageProvider_base {
        constructor(logger: any, driver: any, rotation: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/FirefoxScreenshotImageProvider" {
    export = FirefoxScreenshotImageProvider;
    const FirefoxScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    class FirefoxScreenshotImageProvider extends FirefoxScreenshotImageProvider_base {
        constructor(logger: any, driver: any, rotation: any, eyes: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        _eyes: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/SafariScreenshotImageProvider" {
    export = SafariScreenshotImageProvider;
    const SafariScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    class SafariScreenshotImageProvider extends SafariScreenshotImageProvider_base {
        constructor(logger: any, driver: any, rotation: any, eyes: any, userAgent: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        _eyes: any;
        _userAgent: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/ImageProviderFactory" {
    export = ImageProviderFactory;
    class ImageProviderFactory {
        static getImageProvider(logger: any, driver: any, rotation: any, eyes: any, userAgent: any): any;
    }
}
declare module "lib/capture/CorsIframeHandles" {
    export var CorsIframeHandles: Readonly<{
        BLANK: string;
        KEEP: string;
        SNAPSHOT: string;
    }>;
    export type CorsIframeHandle = string;
}
declare module "lib/capture/CorsIframeHandler" {
    export = CorsIframeHandler;
    class CorsIframeHandler {
        static blankCorsIframeSrc(json: object, origin: string): void;
        static blankCorsIframeSrcOfCdt(cdt: object[], frames: object[]): object[];
    }
}
declare module "lib/cropping/FixedCutProvider" {
    export = FixedCutProvider;
    const FixedCutProvider_base: typeof import("lib/cropping/CutProvider");
    class FixedCutProvider extends FixedCutProvider_base {
        constructor(header: number, footer: number, left: number, right: number);
        _header: number;
        _footer: number;
        _left: number;
        _right: number;
    }
}
declare module "lib/events/SessionEventHandler" {
    export = SessionEventHandler;
    class SessionEventHandler {
        initStarted(): Promise<any>;
        initEnded(): Promise<any>;
        setSizeWillStart(sizeToSet: any): Promise<any>;
        setSizeEnded(): Promise<any>;
        testStarted(autSessionId: string): Promise<any>;
        testEnded(autSessionId: string, testResults: any): Promise<any>;
        validationWillStart(autSessionId: string, validationInfo: any): Promise<any>;
        validationEnded(autSessionId: string, validationId: number, validationResult: any): Promise<any>;
    }
}
declare module "lib/events/RemoteSessionEventHandler" {
    export = RemoteSessionEventHandler;
    const RemoteSessionEventHandler_base: typeof import("lib/events/SessionEventHandler");
    class RemoteSessionEventHandler extends RemoteSessionEventHandler_base {
        constructor(serverUrl: any, accessKey: any);
        _autSessionId: any;
        _serverUrl: any;
        _httpOptions: {
            strictSSL: boolean;
            baseUrl: string;
            json: boolean;
            params: {
                accessKey: any;
            };
            timeout: number;
        };
        setTimeout(value: number): void;
        getTimeout(): number;
        setServerUrl(value: string): void;
        getServerUrl(): string;
        setAccessKey(value: string): void;
        getAccessKey(): string;
    }
}
declare module "lib/events/ValidationInfo" {
    export = ValidationInfo;
    class ValidationInfo {
        constructor(validationId?: number | undefined, tag?: string | undefined);
        _validationId: number | undefined;
        _tag: string | undefined;
        setValidationId(value: number): void;
        getValidationId(): number;
        setTag(value: string): void;
        getTag(): string;
        toJSON(): object;
    }
}
declare module "lib/events/ValidationResult" {
    export = ValidationResult;
    class ValidationResult {
        constructor(asExpected?: boolean | undefined);
        _asExpected: boolean | undefined;
        setAsExpected(value: boolean): void;
        getAsExpected(): boolean;
    }
}
declare module "lib/fluent/GetSelector" {
    export = GetSelector;
    class GetSelector {
        constructor(selector?: string | undefined);
        _selector: string | undefined;
        getSelector(eyes: any): Promise<string>;
    }
}
declare module "lib/fluent/GetRegion" {
    export = GetRegion;
    const GetRegion_base: typeof import("lib/fluent/GetSelector");
    class GetRegion extends GetRegion_base {
        getRegion(eyesBase: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/IgnoreRegionByRectangle" {
    export = IgnoreRegionByRectangle;
    const IgnoreRegionByRectangle_base: typeof import("lib/fluent/GetRegion");
    class IgnoreRegionByRectangle extends IgnoreRegionByRectangle_base {
        constructor(region: any);
        _region: any;
        toPersistedRegions(_driver: any): Promise<any[]>;
    }
}
declare module "lib/fluent/GetFloatingRegion" {
    export = GetFloatingRegion;
    class GetFloatingRegion {
        getRegion(driver: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/FloatingRegionByRectangle" {
    export = FloatingRegionByRectangle;
    const FloatingRegionByRectangle_base: typeof import("lib/fluent/GetFloatingRegion");
    class FloatingRegionByRectangle extends FloatingRegionByRectangle_base {
        constructor(rect: any, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _rect: any;
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        toPersistedRegions(_driver: any): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
            maxUpOffset: number;
            maxDownOffset: number;
            maxLeftOffset: number;
            maxRightOffset: number;
        }[]>;
    }
}
declare module "lib/fluent/GetAccessibilityRegion" {
    export = GetAccessibilityRegion;
    class GetAccessibilityRegion {
        getRegion(eyesBase: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/AccessibilityRegionByRectangle" {
    export = AccessibilityRegionByRectangle;
    const AccessibilityRegionByRectangle_base: typeof import("lib/fluent/GetAccessibilityRegion");
    class AccessibilityRegionByRectangle extends AccessibilityRegionByRectangle_base {
        constructor(rect: any, type?: string | undefined);
        _rect: any;
        _type: string | undefined;
        toPersistedRegions(): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
            accessibilityType: string | undefined;
        }[]>;
    }
    namespace AccessibilityRegionByRectangle {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/fluent/CheckSettings" {
    export = CheckSettings;
    class CheckSettings {
        constructor(timeout?: number | null | undefined, region?: import("lib/geometry/Region") | any);
        _sendDom: boolean;
        _matchLevel: any;
        _accessibilityLevel: any;
        _useDom: boolean;
        _enablePatterns: boolean;
        _ignoreDisplacements: boolean;
        _ignoreCaret: boolean;
        _stitchContent: boolean;
        _renderId: string;
        _timeout: number | null;
        _targetRegion: import("lib/geometry/Region") | undefined;
        _ignoreRegions: any[];
        _layoutRegions: any[];
        _strictRegions: any[];
        _contentRegions: any[];
        _floatingRegions: any[];
        _accessibilityRegions: any[];
        withName(name: string): this;
        _name: string | undefined;
        getName(): string;
        sendDom(sendDom?: boolean | undefined): this;
        getSendDom(): boolean;
        renderId(renderId: string): this;
        getRenderId(): string;
        layout(): this;
        exact(): this;
        strict(): this;
        content(): this;
        matchLevel(matchLevel: any): this;
        getMatchLevel(): any;
        ignoreCaret(ignoreCaret?: boolean | undefined): this;
        getIgnoreCaret(): boolean;
        fully(fully?: boolean | undefined): this;
        stitchContent(stitchContent?: boolean | undefined): this;
        getStitchContent(): boolean;
        useDom(useDom?: boolean | undefined): this;
        getUseDom(): boolean;
        enablePatterns(enablePatterns?: boolean | undefined): this;
        getEnablePatterns(): boolean;
        ignoreDisplacements(ignoreDisplacements?: boolean | undefined): this;
        getIgnoreDisplacements(): boolean;
        timeout(timeoutMilliseconds?: number): this;
        getTimeout(): number;
        protected updateTargetRegion(region: import("lib/geometry/Region") | any): void;
        getTargetRegion(): import("lib/geometry/Region");
        protected _regionToRegionProvider(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any): import("lib/fluent/GetRegion");
        _getTargetType(): "window" | "region";
        ignore(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any | string | any | Object): CheckSettings;
        ignoreRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any | string | any | Object): CheckSettings;
        ignores(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        ignoreRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        layoutRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        layoutRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        strictRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        strictRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        contentRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        contentRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        floating(region: import("lib/fluent/GetFloatingRegion") | import("lib/geometry/Region") | import("lib/config/FloatingMatchSettings"), maxUpOffset?: number | undefined, maxDownOffset?: number | undefined, maxLeftOffset?: number | undefined, maxRightOffset?: number | undefined): this;
        floatingRegion(region: import("lib/fluent/GetFloatingRegion") | import("lib/geometry/Region") | import("lib/config/FloatingMatchSettings"), maxUpOffset?: number | undefined, maxDownOffset?: number | undefined, maxLeftOffset?: number | undefined, maxRightOffset?: number | undefined): this;
        floatings(maxOffset: number, ...regions: any[]): this;
        floatingRegions(maxOffset: number, ...regions: any[]): this;
        accessibilityRegion(region: import("lib/fluent/GetAccessibilityRegion") | import("lib/geometry/Region") | import("lib/config/AccessibilityMatchSettings"), regionType: any): this;
        accessibility(region: any, regionType: any): CheckSettings;
        getIgnoreRegions(): import("lib/fluent/GetRegion")[];
        getStrictRegions(): import("lib/fluent/GetRegion")[];
        getLayoutRegions(): import("lib/fluent/GetRegion")[];
        getContentRegions(): import("lib/fluent/GetRegion")[];
        getFloatingRegions(): import("lib/fluent/GetFloatingRegion")[];
        getAccessibilityRegions(): import("lib/fluent/GetAccessibilityRegion")[];
        toString(): string;
        toCheckWindowConfiguration(eyesWebDriver: any): Promise<{
            target: string;
            fully: boolean;
            tag: string;
            scriptHooks: any;
            sendDom: boolean;
            matchLevel: any;
            ignore: never[];
            floating: never[];
            strict: never[];
            layout: never[];
            content: never[];
            accessibility: never[];
        }>;
        _getPersistedRegions(eyesWebDriver: any): Promise<{
            ignore: never[];
            floating: never[];
            strict: never[];
            layout: never[];
            content: never[];
            accessibility: never[];
        }>;
    }
}
declare module "lib/fluent/TargetRegionByElement" {
    export = TargetRegionByElement;
    const TargetRegionByElement_base: typeof import("lib/fluent/GetSelector");
    class TargetRegionByElement extends TargetRegionByElement_base {
        constructor(element: EyesWrappedElement);
        _element: import("lib/wrappers/EyesWrappedElement");
        toPersistedRegions(driver: EyesWrappedDriver): Promise<any[]>;
    }
    namespace TargetRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
}
declare module "lib/FailureReports" {
    export type FailureReports = number;
    export namespace FailureReports {
        export const IMMEDIATE: string;
        export const ON_CLOSE: string;
    }
}
declare module "lib/match/MatchResult" {
    export = MatchResult;
    class MatchResult {
        constructor({ asExpected, windowId }?: {
            asExpected: boolean;
            windowId: number;
        });
        _asExpected: boolean;
        _windowId: number;
        getAsExpected(): boolean;
        setAsExpected(value: boolean): void;
        getWindowId(): number;
        setWindowId(value: number): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/positioning/RegionProvider" {
    export = RegionProvider;
    class RegionProvider {
        constructor(region?: any);
        _region: any;
        getRegion(): Promise<any>;
    }
}
declare module "lib/positioning/NullRegionProvider" {
    export = NullRegionProvider;
    const NullRegionProvider_base: typeof import("lib/positioning/RegionProvider");
    class NullRegionProvider extends NullRegionProvider_base {
    }
}
declare module "lib/scaling/ScaleProvider" {
    export = ScaleProvider;
    class ScaleProvider {
        getScaleRatio(): number;
    }
}
declare module "lib/scaling/FixedScaleProvider" {
    export = FixedScaleProvider;
    const FixedScaleProvider_base: typeof import("lib/scaling/ScaleProvider");
    class FixedScaleProvider extends FixedScaleProvider_base {
        constructor(scaleRatio: number);
        _scaleRatio: number;
    }
}
declare module "lib/scaling/NullScaleProvider" {
    export = NullScaleProvider;
    const NullScaleProvider_base: typeof import("lib/scaling/FixedScaleProvider");
    class NullScaleProvider extends NullScaleProvider_base {
    }
}
declare module "lib/scaling/ScaleProviderFactory" {
    export = ScaleProviderFactory;
    class ScaleProviderFactory {
        constructor(scaleProviderHandler: any);
        _scaleProviderHandler: any;
        getScaleProvider(imageToScaleWidth: number): any;
        getScaleProviderImpl(_imageToScaleWidth: any): any;
    }
}
declare module "lib/scaling/ScaleProviderIdentityFactory" {
    export = ScaleProviderIdentityFactory;
    const ScaleProviderIdentityFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    class ScaleProviderIdentityFactory extends ScaleProviderIdentityFactory_base {
        constructor(scaleProvider: any, scaleProviderHandler: any);
        _scaleProvider: any;
    }
}
declare module "lib/scaling/ContextBasedScaleProvider" {
    export = ContextBasedScaleProvider;
    const ContextBasedScaleProvider_base: typeof import("lib/scaling/ScaleProvider");
    class ContextBasedScaleProvider extends ContextBasedScaleProvider_base {
        constructor(logger: any, topLevelContextEntireSize: any, viewportSize: any, devicePixelRatio: number, isMobileDevice: boolean);
        _logger: any;
        _topLevelContextEntireSize: any;
        _viewportSize: any;
        _devicePixelRatio: number;
        _isMobileDevice: boolean;
        _scaleRatio: number;
        updateScaleRatio(imageToScaleWidth: number): void;
    }
}
declare module "lib/scaling/ContextBasedScaleProviderFactory" {
    export = ContextBasedScaleProviderFactory;
    const ContextBasedScaleProviderFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    class ContextBasedScaleProviderFactory extends ContextBasedScaleProviderFactory_base {
        constructor(logger: any, topLevelContextEntireSize: any, viewportSize: any, devicePixelRatio: number, isMobileDevice: boolean, scaleProviderHandler: any);
        _logger: any;
        _topLevelContextEntireSize: any;
        _viewportSize: any;
        _devicePixelRatio: number;
        _isMobileDevice: boolean;
    }
}
declare module "lib/scaling/FixedScaleProviderFactory" {
    export = FixedScaleProviderFactory;
    const FixedScaleProviderFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    class FixedScaleProviderFactory extends FixedScaleProviderFactory_base {
        constructor(scaleRatio: number, scaleProviderHandler: any);
        _fixedScaleProvider: import("lib/scaling/FixedScaleProvider");
    }
}
declare module "lib/positioning/FirefoxRegionPositionCompensation" {
    export = FirefoxRegionPositionCompensation;
    const FirefoxRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    class FirefoxRegionPositionCompensation extends FirefoxRegionPositionCompensation_base {
        constructor(eyes: any, logger: any);
        _eyes: any;
        _logger: any;
    }
}
declare module "lib/positioning/SafariRegionPositionCompensation" {
    export = SafariRegionPositionCompensation;
    const SafariRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    class SafariRegionPositionCompensation extends SafariRegionPositionCompensation_base {
    }
}
declare module "lib/positioning/RegionPositionCompensationFactory" {
    export = RegionPositionCompensationFactory;
    class RegionPositionCompensationFactory {
        static getRegionPositionCompensation(userAgent: any, eyes: any, logger: any): any;
    }
}
declare module "lib/positioning/PositionMemento" {
    export = PositionMemento;
    class PositionMemento {
        constructor({ transforms, position }?: {
            transforms: Object;
            position: Location;
        });
        _transforms: Object;
        _position: import("lib/geometry/Location");
        get transforms(): Object;
        get position(): Location;
    }
    const Location_2: typeof import("lib/geometry/Location");
}
declare module "lib/positioning/CssTranslatePositionProvider" {
    export = CssTranslatePositionProvider;
    const CssTranslatePositionProvider_base: typeof import("lib/positioning/PositionProvider");
    class CssTranslatePositionProvider extends CssTranslatePositionProvider_base {
        constructor(logger: any, executor: EyesJsExecutor, scrollRootElement?: import("lib/wrappers/EyesWrappedElement") | undefined);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement") | undefined;
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        markScrollRootElement(): Promise<void>;
    }
    namespace CssTranslatePositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type RectangleSize = any;
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
}
declare module "lib/positioning/ScrollPositionProvider" {
    export = ScrollPositionProvider;
    const ScrollPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    class ScrollPositionProvider extends ScrollPositionProvider_base {
        constructor(logger: any, executor: any, scrollRootElement?: any);
        _logger: any;
        _executor: any;
        _scrollRootElement: any;
        get scrollRootElement(): any;
        markScrollRootElement(): Promise<void>;
    }
}
declare module "lib/positioning/CssTranslateElementPositionProvider" {
    export = CssTranslateElementPositionProvider;
    const CssTranslateElementPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    class CssTranslateElementPositionProvider extends CssTranslateElementPositionProvider_base {
        constructor(logger: any, executor: EyesJsExecutor, element: EyesWrappedElement);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _element: import("lib/wrappers/EyesWrappedElement");
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        markScrollRootElement(): Promise<void>;
    }
    namespace CssTranslateElementPositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type RectangleSize = any;
}
declare module "lib/positioning/ScrollElementPositionProvider" {
    export = ScrollElementPositionProvider;
    const ScrollElementPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    class ScrollElementPositionProvider extends ScrollElementPositionProvider_base {
        constructor(logger: any, executor: EyesJsExecutor, element: EyesWrappedElement);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _element: import("lib/wrappers/EyesWrappedElement");
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        markScrollRootElement(): Promise<void>;
    }
    namespace ScrollElementPositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type RectangleSize = any;
}
declare module "lib/TestResultsStatus" {
    export = TestResultsStatuses;
    const TestResultsStatuses: Readonly<{
        Passed: string;
        Unresolved: string;
        Failed: string;
    }>;
    namespace TestResultsStatuses {
        export { TestResultsStatus };
    }
    type TestResultsStatus = string;
}
declare module "lib/runner/TestResultContainer" {
    export = TestResultContainer;
    class TestResultContainer {
        constructor(testResults?: any, exception?: Error | undefined);
        _testResults: any;
        _exception: Error | undefined;
        getTestResults(): any;
        getException(): Error;
        toString(): string;
    }
}
declare module "lib/runner/TestResultsSummary" {
    export = TestResultsSummary;
    class TestResultsSummary implements Iterable<import("lib/runner/TestResultContainer")> {
        constructor(allResults: (any | Error | import("lib/runner/TestResultContainer"))[]);
        _passed: number;
        _unresolved: number;
        _failed: number;
        _exceptions: number;
        _mismatches: number;
        _missing: number;
        _matches: number;
        _allResults: any[];
        [Symbol.iterator](): IterableIterator<import("lib/runner/TestResultContainer")>;
        getAllResults(): import("lib/runner/TestResultContainer")[];
        toString(): string;
    }
}
declare module "lib/runner/EyesRunner" {
    export = EyesRunner;
    class EyesRunner {
        _eyesInstances: any[];
        _allTestResult: any[];
        _getBatchInfo: ((...args: any[]) => any) | undefined;
        attachEyes(eyes: any, serverConnector: any): void;
        getBatchInfoWithCache(batchId: any): Promise<any>;
        getAllTestResults(throwEx?: boolean | undefined): Promise<import("lib/runner/TestResultsSummary")>;
        _awaitAllClosePromises(): Promise<void>;
        protected _closeAllBatches(): Promise<void>;
    }
}
declare module "lib/runner/ClassicRunner" {
    export = ClassicRunner;
    const ClassicRunner_base: typeof import("lib/runner/EyesRunner");
    class ClassicRunner extends ClassicRunner_base {
        _getRenderingInfo: ((...args: any[]) => any) | undefined;
        getRenderingInfoWithCache(): Promise<any>;
    }
}
declare module "lib/positioning/ImageRotation" {
    export = ImageRotation;
    class ImageRotation {
        constructor(rotation: any);
        _rotation: any;
        getRotation(): any;
    }
}
declare module "lib/match/AppOutput" {
    export = AppOutput;
    class AppOutput {
        constructor({ title, screenshot, screenshotUrl, domUrl, imageLocation }?: {
            title: string;
            screenshot: Buffer;
            screenshotUrl: string;
            domUrl: string;
            imageLocation: Location;
        }, ...args: any[]);
        _title: string;
        _screenshot64: Buffer;
        _screenshotUrl: string;
        _domUrl: string;
        _imageLocation: Location;
        getTitle(): string;
        setTitle(value: string): void;
        getScreenshot64(): Buffer;
        setScreenshot64(value: Buffer): void;
        getScreenshotUrl(): string;
        setScreenshotUrl(value: string): void;
        getDomUrl(): string;
        setDomUrl(value: string): void;
        getImageLocation(): Location;
        setImageLocation(value: Location): void;
        toJSON(): {
            title: string;
        };
        toString(): string;
    }
}
declare module "lib/positioning/InvalidPositionProvider" {
    export = InvalidPositionProvider;
    const InvalidPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    class InvalidPositionProvider extends InvalidPositionProvider_base {
    }
}
declare module "lib/triggers/Trigger" {
    export = Trigger;
    class Trigger {
        getTriggerType(): Trigger.TriggerType;
    }
    namespace Trigger {
        export namespace TriggerType {
            export const Unknown: string;
            export const Mouse: string;
            export const Text: string;
            export const Keyboard: string;
        }
        export type TriggerType = string;
    }
}
declare module "lib/triggers/TextTrigger" {
    export = TextTrigger;
    const TextTrigger_base: typeof import("lib/triggers/Trigger");
    class TextTrigger extends TextTrigger_base {
        constructor(control: any, text: string);
        _text: string;
        _control: any;
        getText(): string;
        getControl(): any;
    }
}
declare module "lib/triggers/MouseTrigger" {
    export = MouseTrigger;
    const MouseTrigger_base: typeof import("lib/triggers/Trigger");
    class MouseTrigger extends MouseTrigger_base {
        constructor(mouseAction: MouseTrigger.MouseAction, control: any, location: Location);
        _mouseAction: string;
        _control: any;
        _location: Location;
        getMouseAction(): MouseTrigger.MouseAction;
        getControl(): any;
        getLocation(): Location;
    }
    namespace MouseTrigger {
        export namespace MouseAction {
            export const None: string;
            export const Click: string;
            export const RightClick: string;
            export const DoubleClick: string;
            export const Move: string;
            export const Down: string;
            export const Up: string;
        }
        export type MouseAction = string;
    }
}
declare module "lib/match/MatchWindowData" {
    export = MatchWindowData;
    class MatchWindowData {
        constructor({ userInputs, appOutput, tag, ignoreMismatch, options }?: {
            userInputs: any;
            appOutput: any;
            tag: any;
            ignoreMismatch: any;
            options: any;
        }, ...args: any[]);
        _userInputs: any;
        _appOutput: any;
        _tag: any;
        _ignoreMismatch: any;
        _options: any;
        getUserInputs(): any[];
        getAppOutput(): any;
        getTag(): string;
        getIgnoreMismatch(): boolean | null;
        getOptions(): any | null;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/events/SessionEventHandlers" {
    export = SessionEventHandlers;
    const SessionEventHandlers_base: typeof import("lib/events/SessionEventHandler");
    class SessionEventHandlers extends SessionEventHandlers_base {
        _eventHandlers: import("lib/events/SessionEventHandler")[];
        addEventHandler(handler: import("lib/events/SessionEventHandler")): void;
        removeEventHandler(handler: import("lib/events/SessionEventHandler")): void;
        clearEventHandlers(): void;
    }
}
declare module "lib/renderer/RenderStatus" {
    export = RenderStatus;
    namespace RenderStatus {
        export { RenderStatus };
    }
    type RenderStatus = string;
}
declare module "lib/RenderWindowTask" {
    export = RenderWindowTask;
    class RenderWindowTask {
        constructor(logger: any, serverConnector: any);
        _logger: any;
        _serverConnector: any;
        renderWindow(renderRequest: any): Promise<string>;
        postRender(renderRequest: any): Promise<any>;
        postRenderBatch(renderRequests: any[]): Promise<any>;
        checkAndPutResources(renderRequest: any): Promise<any>;
        getRenderStatus(runningRender: any, delayBeforeRequest?: boolean | undefined): Promise<any>;
        getRenderStatusBatch(renderIds: string[], delayBeforeRequest?: boolean | undefined): Promise<any[]>;
        putResources(rGridDom: any, runningRender: any, concurrency?: number | undefined): Promise<any>;
    }
}
declare module "lib/TestResults" {
    export = TestResults;
    class TestResults {
        constructor({ id, name, secretToken, status, appName, batchName, batchId, branchName, hostOS, hostApp, hostDisplaySize, startedAt, duration, isNew, isDifferent, isAborted, appUrls, apiUrls, stepsInfo, steps, matches, mismatches, missing, exactMatches, strictMatches, contentMatches, layoutMatches, noneMatches, url, accessibilityStatus, }?: {
            id: any;
            name: any;
            secretToken: any;
            status: any;
            appName: any;
            batchName: any;
            batchId: any;
            branchName: any;
            hostOS: any;
            hostApp: any;
            hostDisplaySize: any;
            startedAt: any;
            duration: any;
            isNew: any;
            isDifferent: any;
            isAborted: any;
            appUrls: any;
            apiUrls: any;
            stepsInfo: any;
            steps: any;
            matches: any;
            mismatches: any;
            missing: any;
            exactMatches: any;
            strictMatches: any;
            contentMatches: any;
            layoutMatches: any;
            noneMatches: any;
            url: any;
            accessibilityStatus: any;
        });
        _id: any;
        _name: any;
        _secretToken: any;
        _status: any;
        _appName: any;
        _batchName: any;
        _batchId: any;
        _branchName: any;
        _hostOS: any;
        _hostApp: any;
        _hostDisplaySize: any;
        _startedAt: any;
        _duration: any;
        _isNew: any;
        _isDifferent: any;
        _isAborted: any;
        _appUrls: any;
        _apiUrls: any;
        _stepsInfo: any;
        _steps: any;
        _matches: any;
        _mismatches: any;
        _missing: any;
        _exactMatches: any;
        _strictMatches: any;
        _contentMatches: any;
        _layoutMatches: any;
        _noneMatches: any;
        _url: any;
        _accessibilityStatus: any;
        _serverConnector: any;
        getId(): string;
        setId(value: string): void;
        getName(): string;
        setName(value: string): void;
        getSecretToken(): string;
        setSecretToken(value: string): void;
        getStatus(): TestResultsStatus;
        setStatus(value: TestResultsStatus): void;
        getAppName(): string;
        setAppName(value: string): void;
        getBatchName(): string;
        setBatchName(value: string): void;
        getBatchId(): string;
        setBatchId(value: string): void;
        getBranchName(): string;
        setBranchName(value: string): void;
        getHostOS(): string;
        setHostOS(value: string): void;
        getHostApp(): string;
        setHostApp(value: string): void;
        getHostDisplaySize(): import("lib/geometry/RectangleSize");
        setHostDisplaySize(value: import("lib/geometry/RectangleSize")): void;
        getAccessibilityStatus(): SessionAccessibilityStatus;
        setAccessibilityStatus(value: SessionAccessibilityStatus): void;
        getStartedAt(): Date;
        setStartedAt(value: Date): void;
        getDuration(): number;
        setDuration(value: number): void;
        getIsNew(): boolean;
        setIsNew(value: boolean): void;
        getIsDifferent(): boolean;
        setIsDifferent(value: boolean): void;
        getIsAborted(): boolean;
        setIsAborted(value: boolean): void;
        getAppUrls(): SessionUrls;
        setAppUrls(value: SessionUrls): void;
        getApiUrls(): SessionUrls;
        setApiUrls(value: SessionUrls): void;
        getStepsInfo(): StepInfo[];
        setStepsInfo(value: StepInfo[]): void;
        getSteps(): number;
        setSteps(value: number): void;
        getMatches(): number;
        setMatches(value: number): void;
        getMismatches(): number;
        setMismatches(value: number): void;
        getMissing(): number;
        setMissing(value: number): void;
        getExactMatches(): number;
        setExactMatches(value: number): void;
        getStrictMatches(): number;
        setStrictMatches(value: number): void;
        getContentMatches(): number;
        setContentMatches(value: number): void;
        getLayoutMatches(): number;
        setLayoutMatches(value: number): void;
        getNoneMatches(): number;
        setNoneMatches(value: number): void;
        getUrl(): string;
        setUrl(value: string): void;
        isPassed(): boolean;
        setServerConnector(serverConnector: any): void;
        deleteSession(): Promise<any>;
        toJSON(): object;
        toString(): string;
    }
    namespace TestResults {
        export { TestResultsStatus, SessionAccessibilityStatus };
    }
    type TestResultsStatus = string;
    type SessionAccessibilityStatus = {
        level: any;
        version: any;
        status: any;
    };
    class SessionUrls {
        constructor({ batch, session }?: {
            batch: any;
            session: any;
        });
        _batch: any;
        _session: any;
        getBatch(): string;
        setBatch(value: string): void;
        getSession(): string;
        setSession(value: string): void;
        toJSON(): object;
    }
    class StepInfo {
        constructor({ name, isDifferent, hasBaselineImage, hasCurrentImage, appUrls, apiUrls, renderId, }?: {
            name: any;
            isDifferent: any;
            hasBaselineImage: any;
            hasCurrentImage: any;
            appUrls: any;
            apiUrls: any;
            renderId: any;
        });
        _name: any;
        _isDifferent: any;
        _hasBaselineImage: any;
        _hasCurrentImage: any;
        _appUrls: any;
        _apiUrls: any;
        _renderId: any;
        getName(): string;
        setName(value: string): void;
        getIsDifferent(): boolean;
        setIsDifferent(value: boolean): void;
        getHasBaselineImage(): boolean;
        setHasBaselineImage(value: boolean): void;
        getHasCurrentImage(): boolean;
        setHasCurrentImage(value: boolean): void;
        getAppUrls(): AppUrls;
        setAppUrls(value: AppUrls): void;
        getApiUrls(): ApiUrls;
        setApiUrls(value: ApiUrls): void;
        getRenderId(): string;
        setRenderId(value: string): void;
        toJSON(): object;
    }
    class AppUrls {
        constructor({ step, stepEditor }?: {
            step: any;
            stepEditor: any;
        });
        _step: any;
        _stepEditor: any;
        getStep(): string;
        setStep(value: string): void;
        getStepEditor(): string;
        setStepEditor(value: string): void;
        toJSON(): object;
    }
    class ApiUrls {
        constructor({ baselineImage, currentImage, checkpointImage, checkpointImageThumbnail, diffImage, }?: {
            baselineImage: any;
            currentImage: any;
            checkpointImage: any;
            checkpointImageThumbnail: any;
            diffImage: any;
        });
        _baselineImage: any;
        _currentImage: any;
        _checkpointImage: any;
        _checkpointImageThumbnail: any;
        _diffImage: any;
        getBaselineImage(): string;
        setBaselineImage(value: string): void;
        getCurrentImage(): string;
        setCurrentImage(value: string): void;
        getCheckpointImage(): string;
        setCheckpointImage(value: string): void;
        getCheckpointImageThumbnail(): string;
        setCheckpointImageThumbnail(value: string): void;
        getDiffImage(): string;
        setDiffImage(value: string): void;
        toJSON(): object;
    }
}
declare module "lib/server/RenderingInfo" {
    export = RenderingInfo;
    class RenderingInfo {
        constructor({ serviceUrl, accessToken, resultsUrl, stitchingServiceUrl }?: {
            serviceUrl: any;
            accessToken: any;
            resultsUrl: any;
            stitchingServiceUrl: any;
        });
        _serviceUrl: any;
        _accessToken: any;
        _resultsUrl: any;
        _stitchingServiceUrl: any;
        getServiceUrl(): string;
        setServiceUrl(value: string): void;
        getAccessToken(): string;
        setAccessToken(value: string): void;
        getResultsUrl(): string;
        setResultsUrl(value: string): void;
        getDecodedAccessToken(): {
            sub: string;
            exp: number;
            iss: string;
        };
        _payload: object | undefined;
        getStitchingServiceUrl(): string;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/server/RunningSession" {
    export = RunningSession;
    class RunningSession {
        constructor({ id, sessionId, batchId, baselineId, url, renderingInfo, isNew }?: {
            id: any;
            sessionId: any;
            batchId: any;
            baselineId: any;
            url: any;
            renderingInfo: any;
            isNew: any;
        });
        _id: any;
        _sessionId: any;
        _batchId: any;
        _baselineId: any;
        _url: any;
        _renderingInfo: any;
        _isNew: any;
        getId(): string;
        setId(value: string): void;
        getSessionId(): string;
        setSessionId(value: string): void;
        getBatchId(): string;
        setBatchId(value: string): void;
        getBaselineId(): string;
        setBaselineId(value: string): void;
        getUrl(): string;
        setUrl(value: string): void;
        getRenderingInfo(): any;
        setRenderingInfo(value: any): void;
        getIsNew(): boolean;
        setIsNew(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/server/requestHelpers" {
    export function configAxiosProxy({ axiosConfig, proxy, logger }: {
        axiosConfig: any;
        proxy: any;
        logger: any;
    }): any;
    export function configureAxios({ axiosConfig, configuration, agentId, logger }: {
        axiosConfig: any;
        configuration: any;
        agentId: any;
        logger: any;
    }): void;
    export function delayRequest({ axiosConfig, logger }: {
        axiosConfig: any;
        logger: any;
    }): Promise<void>;
    export function handleRequestResponse({ response, axios, logger }: {
        response: any;
        axios: any;
        logger: any;
    }): Promise<any>;
    export function handleRequestError({ err, axios, logger }: {
        err: any;
        axios: any;
        logger: any;
    }): Promise<any>;
}
declare module "lib/renderer/RunningRender" {
    export = RunningRender;
    class RunningRender {
        constructor({ renderId, jobId, renderStatus, needMoreResources, needMoreDom }?: {
            renderId: any;
            jobId: any;
            renderStatus: any;
            needMoreResources: any;
            needMoreDom: any;
        });
        _renderId: any;
        _jobId: any;
        _renderStatus: any;
        _needMoreResources: any;
        _needMoreDom: any;
        getRenderId(): string;
        setRenderId(value: string): void;
        getJobId(): string;
        setJobId(value: string): void;
        getRenderStatus(): any;
        setRenderStatus(value: any): void;
        getNeedMoreResources(): string[];
        setNeedMoreResources(value: string[]): void;
        getNeedMoreDom(): boolean;
        setNeedMoreDom(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/renderer/RenderStatusResults" {
    export = RenderStatusResults;
    class RenderStatusResults {
        constructor({ status, imageLocation, domLocation, error, os, userAgent, deviceSize, selectorRegions, }?: any);
        _status: any;
        _imageLocation: any;
        _domLocation: any;
        _error: any;
        _os: any;
        _userAgent: any;
        _deviceSize: any;
        _selectorRegions: any;
        isEmpty(): boolean;
        getStatus(): any;
        setStatus(value: any): void;
        getImageLocation(): string;
        setImageLocation(value: string): void;
        getDomLocation(): string;
        setDomLocation(value: string): void;
        getError(): string;
        setError(value: string): void;
        getOS(): string;
        setOS(value: string): void;
        getUserAgent(): string;
        setUserAgent(value: string): void;
        getDeviceSize(): import("lib/geometry/RectangleSize");
        setDeviceSize(value: import("lib/geometry/RectangleSize")): void;
        getSelectorRegions(): import("lib/geometry/Region")[];
        setSelectorRegions(value: import("lib/geometry/Region")[]): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/server/ServerConnector" {
    export = ServerConnector;
    class ServerConnector {
        constructor({ logger, configuration, getAgentId }: any);
        _logger: any;
        _configuration: any;
        _renderingInfo: import("lib/server/RenderingInfo");
        _axios: any;
        getRenderingInfo(): import("lib/server/RenderingInfo");
        setRenderingInfo(renderingInfo: import("lib/server/RenderingInfo")): void;
        startSession(sessionStartInfo: any): Promise<import("lib/server/RunningSession")>;
        stopSession(runningSession: import("lib/server/RunningSession"), isAborted: boolean, save: boolean): Promise<any>;
        deleteBatchSessions(batchId: string): Promise<void>;
        deleteSession(testResults: any): Promise<any>;
        uploadScreenshot(id: any, screenshot: any): Promise<string>;
        matchWindow(runningSession: import("lib/server/RunningSession"), matchWindowData: any): Promise<import("lib/match/MatchResult")>;
        matchSingleWindow(matchSingleWindowData: any): Promise<any>;
        replaceWindow(runningSession: import("lib/server/RunningSession"), stepIndex: number, matchWindowData: any): Promise<import("lib/match/MatchResult")>;
        renderInfo(): Promise<import("lib/server/RenderingInfo")>;
        batchInfo(batchId: any): Promise<any>;
        render(renderRequest: any[] | any): Promise<import("lib/renderer/RunningRender")[] | import("lib/renderer/RunningRender")>;
        renderCheckResource(runningRender: import("lib/renderer/RunningRender"), resource: any): Promise<boolean>;
        renderPutResource(runningRender: import("lib/renderer/RunningRender"), resource: any): Promise<boolean>;
        renderStatus(runningRender: import("lib/renderer/RunningRender"), delayBeforeRequest?: boolean | undefined): Promise<import("lib/renderer/RenderStatusResults")>;
        renderStatusById(renderId: string[] | string, delayBeforeRequest?: boolean | undefined): Promise<import("lib/renderer/RenderStatusResults")[] | import("lib/renderer/RenderStatusResults")>;
        postDomSnapshot(id: any, domJson: string): Promise<string>;
        getUserAgents(): Promise<any>;
    }
}
declare module "lib/AppEnvironment" {
    export = AppEnvironment;
    class AppEnvironment {
        static fromInferred(inferred: string): AppEnvironment;
        constructor({ os, hostingApp, displaySize, deviceInfo, osInfo, hostingAppInfo }?: {
            os: any;
            hostingApp: any;
            displaySize: any;
            deviceInfo: any;
            osInfo: any;
            hostingAppInfo: any;
        });
        _os: any;
        _hostingApp: any;
        _displaySize: any;
        _deviceInfo: any;
        _osInfo: any;
        _hostingAppInfo: any;
        _inferred: string;
        geInferred(): string;
        setInferred(value: string): void;
        getOs(): string;
        setOs(value: string): void;
        getHostingApp(): string;
        setHostingApp(value: string): void;
        getDisplaySize(): import("lib/geometry/RectangleSize");
        setDisplaySize(value: import("lib/geometry/RectangleSize")): void;
        getOsInfo(): string;
        setOsInfo(value: string): void;
        getHostingAppInfo(): string;
        setHostingAppInfo(value: string): void;
        getDeviceInfo(): string;
        setDeviceInfo(value: string): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/match/ImageMatchOptions" {
    export = ImageMatchOptions;
    class ImageMatchOptions {
        constructor({ name, renderId, userInputs, ignoreMismatch, ignoreMatch, forceMismatch, forceMatch, imageMatchSettings, source, }?: {
            name: any;
            renderId: any;
            userInputs: any;
            ignoreMismatch: any;
            ignoreMatch: any;
            forceMismatch: any;
            forceMatch: any;
            imageMatchSettings: any;
            source: any;
        }, ...args: any[]);
        _name: any;
        _renderId: any;
        _userInputs: any;
        _ignoreMismatch: any;
        _ignoreMatch: any;
        _forceMismatch: any;
        _forceMatch: any;
        _imageMatchSettings: any;
        _source: any;
        getName(): string;
        getRenderId(): string;
        getUserInputs(): any[];
        getIgnoreMismatch(): boolean;
        getIgnoreMatch(): boolean;
        getForceMismatch(): boolean;
        getForceMatch(): boolean;
        getImageMatchSettings(): any;
        getSource(): string;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/MatchWindowTask" {
    export = MatchWindowTask;
    class MatchWindowTask {
        constructor(logger: any, serverConnector: any, runningSession: any, retryTimeout: number, eyes: any, appOutputProvider?: any);
        _logger: any;
        _serverConnector: any;
        _runningSession: any;
        _defaultRetryTimeout: number;
        _eyes: any;
        _appOutputProvider: any;
        _matchResult: any;
        _lastScreenshot: any;
        _lastScreenshotBounds: import("lib/geometry/Region");
        performMatch(userInputs: any[], appOutput: any, name: string, renderId: string, ignoreMismatch: boolean, imageMatchSettings: import("lib/config/ImageMatchSettings"), source: string): Promise<any>;
        _getTotalRegions(regionProviders: any[] | any[] | any[], screenshot: any): Promise<import("lib/geometry/Region")[] | any[] | any[]>;
        _collectRegions(checkSettings: any, imageMatchSettings: import("lib/config/ImageMatchSettings"), screenshot: any): Promise<any>;
        createImageMatchSettings(checkSettings: any, screenshot: any): import("lib/config/ImageMatchSettings");
        matchWindow(userInputs: any[], region: import("lib/geometry/Region"), tag: string, shouldRunOnceOnTimeout: boolean, ignoreMismatch: boolean, checkSettings: any, retryTimeout?: number | undefined, source?: string | undefined): Promise<any>;
        private _takeScreenshot;
        protected _retryTakingScreenshot(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, retryTimeout: number, source: string): Promise<any>;
        protected _takingScreenshotLoop(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, retryTimeout: number, retry: number, start: number, screenshot?: any, source?: string | undefined): Promise<any>;
        protected _tryTakeScreenshot(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, source: string): Promise<any>;
        private _updateLastScreenshot;
        private _updateBounds;
        getLastScreenshot(): any;
        getLastScreenshotBounds(): import("lib/geometry/Region");
    }
    namespace MatchWindowTask {
        export { MATCH_INTERVAL };
    }
    const MATCH_INTERVAL: 500;
}
declare module "lib/match/MatchSingleWindowData" {
    export = MatchSingleWindowData;
    const MatchSingleWindowData_base: typeof import("lib/match/MatchWindowData");
    class MatchSingleWindowData extends MatchSingleWindowData_base {
        constructor({ startInfo, userInputs, appOutput, tag, ignoreMismatch, options }?: any, ...args: any[]);
        _startInfo: any;
        _updateBaseline: boolean;
        _updateBaselineIfDifferent: boolean;
        _updateBaselineIfNew: boolean;
        _removeSession: boolean;
        _removeSessionIfMatching: boolean;
        _agentId: string;
        getStartInfo(): any;
        setStartInfo(startInfo: any): void;
        getUpdateBaseline(): boolean;
        setUpdateBaseline(updateBaseline: boolean): void;
        getUpdateBaselineIfDifferent(): boolean;
        setUpdateBaselineIfDifferent(updateBaselineIfDifferent: boolean): void;
        getUpdateBaselineIfNew(): boolean;
        setUpdateBaselineIfNew(updateBaselineIfNew: boolean): void;
        getRemoveSession(): boolean;
        setRemoveSession(removeSession: boolean): void;
        getRemoveSessionIfMatching(): boolean;
        setRemoveSessionIfMatching(removeSessionIfMatching: boolean): void;
        getAgentId(): string;
        setAgentId(agentId: string): void;
    }
}
declare module "lib/MatchSingleWindowTask" {
    export = MatchSingleWindowTask;
    const MatchSingleWindowTask_base: typeof import("lib/MatchWindowTask");
    class MatchSingleWindowTask extends MatchSingleWindowTask_base {
        constructor(logger: any, serverConnector: any, retryTimeout: number, eyes: any, appOutputProvider: any, startInfo: any, saveNewTests: boolean);
        _startInfo: any;
        _saveNewTests: boolean;
    }
}
declare module "lib/getScmInfo" {
    const _exports: (...args: any[]) => any;
    export = _exports;
}
declare module "lib/EyesBase" {
    export = EyesBase;
    class EyesBase {
        private static matchWindow;
        constructor(serverUrl?: string | null | undefined, isDisabled?: boolean | null | undefined, configuration?: import("lib/config/Configuration") | undefined);
        _logger: import("lib/logging/Logger");
        _configuration: import("lib/config/Configuration");
        _serverConnector: import("lib/server/ServerConnector");
        _userInputs: any[];
        _failureReports: typeof import("lib/FailureReports");
        _validationId: number;
        _sessionEventHandlers: import("lib/events/SessionEventHandlers");
        _renderWindowTask: import("lib/RenderWindowTask");
        _matchWindowTask: import("lib/MatchWindowTask");
        _runningSession: any;
        _sessionStartInfo: import("lib/server/SessionStartInfo");
        _shouldMatchWindowRunOnceOnTimeout: boolean;
        _isViewportSizeSet: boolean;
        _isOpen: boolean;
        _isVisualGrid: boolean;
        _useImageDeltaCompression: boolean;
        _render: boolean;
        _currentAppName: string;
        _autSessionId: string;
        getLogger(): import("lib/logging/Logger");
        setLogHandler(logHandler: any): void;
        getLogHandler(): any;
        log(...args: string[]): void;
        getConfiguration(): import("lib/config/Configuration");
        setConfiguration(configuration: import("lib/config/Configuration") | object): void;
        setAgentId(agentId: string): void;
        getAgentId(): string;
        setApiKey(apiKey: string): void;
        getApiKey(): string;
        setServerUrl(serverUrl: string): void;
        getServerUrl(): string;
        setProxy(varArg: (any | boolean | string) | null, username?: string | undefined, password?: string | undefined): void;
        getProxy(): any;
        getConnectionTimeout(): number;
        setConnectionTimeout(connectionTimeout: number): void;
        setRemoveSession(removeSession: boolean): void;
        getRemoveSession(): boolean;
        setIsDisabled(isDisabled: boolean): void;
        getIsDisabled(): boolean;
        getHostApp(): string;
        setHostApp(value: string): void;
        getHostOS(): string;
        setHostOS(value: string): void;
        getHostAppInfo(): string;
        setHostAppInfo(value: string): void;
        getHostOSInfo(): string;
        setHostOSInfo(value: string): void;
        getDeviceInfo(): string;
        setDeviceInfo(value: string): void;
        setAppName(appName: string): void;
        getAppName(): string;
        getAppName(): string;
        setBranchName(branchName: string): void;
        getBranchName(): string;
        setParentBranchName(parentBranchName: string): void;
        getParentBranchName(): string;
        setBaselineBranchName(baselineBranchName: string): void;
        getBaselineBranchName(): string;
        setMatchTimeout(ms: number): void;
        getMatchTimeout(): number;
        setSaveNewTests(saveNewTests: boolean): void;
        getSaveNewTests(): boolean;
        setSaveFailedTests(saveFailedTests: boolean): void;
        getSaveFailedTests(): boolean;
        setBatch(batchOrName: any | any | string, batchId?: string | undefined, startedAt?: string | undefined, ...args: any[]): void;
        getBatch(): any;
        addProperty(name: string, value: string): this;
        clearProperties(): void;
        setSaveDiffs(saveDiffs: boolean): void;
        getSaveDiffs(): boolean;
        setSendDom(sendDom: boolean): void;
        getSendDom(): boolean;
        setCompareWithParentBranch(compareWithParentBranch: boolean): void;
        isCompareWithParentBranch(): boolean;
        getCompareWithParentBranch(): boolean;
        setIgnoreBaseline(ignoreBaseline: boolean): void;
        isIgnoreBaseline(): boolean;
        getIgnoreBaseline(): boolean;
        setBaselineName(baselineName: string): void;
        getBaselineName(): string;
        setBaselineEnvName(baselineEnvName: string): void;
        getBaselineEnvName(): string;
        setEnvName(envName: string): void;
        setEnvironmentName(envName: string): void;
        getEnvName(): string;
        setTestName(testName: string): void;
        getTestName(): string | null;
        setDisplayName(displayName: string): void;
        getDisplayName(): string | null;
        getDefaultMatchSettings(): any;
        setDefaultMatchSettings(defaultMatchSettings: any): void;
        setMatchLevel(matchLevel: any): void;
        getMatchLevel(): any;
        setUseDom(useDom: boolean): void;
        getUseDom(): boolean;
        setEnablePatterns(enablePatterns: boolean): void;
        getEnablePatterns(): boolean;
        setIgnoreDisplacements(ignoreDisplacements: boolean): void;
        getIgnoreDisplacements(): boolean;
        setIgnoreCaret(value: boolean): void;
        getIgnoreCaret(): boolean;
        private _initProviders;
        _scaleProviderHandler: any;
        _cutProviderHandler: any;
        _positionProviderHandler: any;
        _viewportSizeHandler: any;
        _debugScreenshotsProvider: any;
        getAndSaveRenderingInfo(): void;
        _getAndSaveBatchInfoFromServer(_batchId: any): void;
        _getScmMergeBaseTime(branchName: any, parentBranchName: any): Promise<any>;
        handleScmMergeBaseTime(): Promise<any>;
        setRenderingInfo(renderingInfo: any): void;
        protected clearUserInputs(): void;
        protected getUserInputs(): any[];
        setFailureReports(failureReports: typeof import("lib/FailureReports")): void;
        getFailureReports(): typeof import("lib/FailureReports");
        getFullAgentId(): string;
        getIsOpen(): boolean;
        setCutProvider(cutProvider?: any): void;
        setImageCut(cutProvider?: any): void;
        getIsCutProviderExplicitlySet(): boolean;
        setScaleRatio(scaleRatio?: number | undefined): void;
        getScaleRatio(): number;
        setRender(value: boolean): void;
        getRender(): boolean;
        setSaveDebugScreenshots(saveDebugScreenshots: boolean): void;
        getSaveDebugScreenshots(): boolean;
        setDebugScreenshotsPath(pathToSave: string): void;
        getDebugScreenshotsPath(): string;
        setDebugScreenshotsPrefix(prefix: string): void;
        getDebugScreenshotsPrefix(): string;
        setDebugScreenshotsProvider(debugScreenshotsProvider: any): void;
        getDebugScreenshotsProvider(): any;
        close(throwEx?: boolean | undefined): Promise<import("lib/TestResults")>;
        _lastScreenshot: any;
        abortIfNotClosed(): Promise<import("lib/TestResults") | null>;
        abort(): Promise<import("lib/TestResults") | null>;
        getPositionProvider(): any;
        setPositionProvider(positionProvider: any): void;
        protected checkWindowBase(regionProvider: any, tag?: string | undefined, ignoreMismatch?: boolean | undefined, checkSettings?: import("lib/fluent/CheckSettings") | undefined, source?: string | undefined): Promise<import("lib/match/MatchResult")>;
        protected checkSingleWindowBase(regionProvider: any, tag?: string | undefined, ignoreMismatch?: boolean | undefined, checkSettings?: import("lib/fluent/CheckSettings") | undefined): Promise<import("lib/TestResults")>;
        protected beforeMatchWindow(): Promise<any>;
        protected afterMatchWindow(): Promise<any>;
        protected tryCaptureDom(): Promise<string | null>;
        protected getOrigin(): Promise<string | null>;
        replaceWindow(stepIndex: number, screenshot: Buffer, tag?: string | undefined, title?: string | undefined, userInputs?: any[] | undefined): Promise<import("lib/match/MatchResult")>;
        private _tryPostDomSnapshot;
        private _validateResult;
        protected openBase(appName: string, testName: string, viewportSize?: import("lib/geometry/RectangleSize") | any, sessionType?: any, skipStartingSession?: any): Promise<any>;
        _renderingInfoPromise: void | undefined;
        _scmMergeBaseTimePromise: Promise<any> | undefined;
        protected beforeOpen(): Promise<any>;
        protected afterOpen(): Promise<any>;
        private _ensureRunningSession;
        private _validateApiKey;
        private _logOpenBase;
        private _validateSessionOpen;
        setExplicitViewportSize(explicitViewportSize: import("lib/geometry/RectangleSize")): void;
        protected addUserInput(trigger: any): void;
        protected addTextTriggerBase(control: import("lib/geometry/Region"), text: string): void;
        protected addMouseTriggerBase(action: string, control: import("lib/geometry/Region"), cursor: Location): void;
        setAppEnvironment(hostOS: any, hostApp: any): void;
        protected getAppEnvironment(): Promise<import("lib/AppEnvironment")>;
        protected startSession(): Promise<any>;
        closeBatch(): Promise<any>;
        getUserSetBatchId(): any;
        _getSetBatchId(): any;
        private _ensureViewportSize;
        private _getAppOutputWithScreenshot;
        getSessionEventHandlers(): import("lib/events/SessionEventHandlers");
        addSessionEventHandler(eventHandler: any): void;
        removeSessionEventHandler(eventHandler: any): void;
        clearSessionEventHandlers(): void;
        getRunningSession(): any;
        protected getBaseAgentId(): string;
        protected getAUTSessionId(): Promise<string | null>;
        protected getViewportSize(): Promise<import("lib/geometry/RectangleSize")>;
        protected setViewportSize(_size: any): Promise<any>;
        protected getInferredEnvironment(): Promise<string>;
        protected getScreenshot(): Promise<any>;
        protected getScreenshotUrl(): Promise<string | null>;
        protected getTitle(): Promise<string>;
        protected getDomUrl(): Promise<string | null>;
        protected getImageLocation(): Promise<Location | null>;
        isVisualGrid(): boolean;
        setIsVisualGrid(isVisualGrid: boolean): void;
    }
}
declare module "lib/EyesCore" {
    export = EyesCore;
    const EyesCore_base: typeof import("lib/EyesBase");
    class EyesCore extends EyesCore_base {
        constructor(serverUrl?: string | null | undefined, isDisabled?: boolean | null | undefined, configuration?: import("lib/config/Configuration") | undefined);
        checkWindow(tag?: string | undefined, matchTimeout?: number | undefined, stitchContent?: boolean | undefined): Promise<any>;
        checkFrame(element: FrameReference, matchTimeout?: number | undefined, tag?: string | undefined): Promise<any>;
        checkElement(element: EyesWrappedElement | SupportedElement, matchTimeout?: number | null | undefined, tag?: string | undefined): Promise<any>;
        checkElementBy(locator: SupportedSelector, matchTimeout?: number | null | undefined, tag?: string | undefined): Promise<any>;
        checkRegion(region: import("lib/geometry/Region"), tag?: string | undefined, matchTimeout?: number | undefined): Promise<any>;
        checkRegionByElement(element: EyesWrappedElement | SupportedElement, tag?: string | undefined, matchTimeout?: number | undefined): Promise<any>;
        checkRegionBy(by: SupportedSelector, tag?: string | undefined, matchTimeout?: number | undefined, stitchContent?: boolean | undefined): Promise<any>;
        checkRegionInFrame(frameReference: FrameReference, locator: SupportedSelector, matchTimeout?: number | null | undefined, tag?: string | undefined, stitchContent?: boolean | undefined): Promise<any>;
        closeAsync(): Promise<any>;
        abortAsync(): Promise<any>;
        addMouseTrigger(action: any, control: import("lib/geometry/Region"), cursor: Location): Promise<void>;
        addMouseTriggerForElement(action: any, element: EyesWrappedElement): Promise<any>;
        addTextTrigger(control: import("lib/geometry/Region"), text: string): Promise<void>;
        addTextTriggerForElement(element: EyesWrappedElement, text: string): Promise<any>;
        _dontGetTitle: boolean | undefined;
        getDriver(): EyesWrappedDriver | null;
        getRemoteWebDriver(): any;
        get jsExecutor(): any;
        getRunner(): any;
        getDevicePixelRatio(): number;
        getRegionToCheck(): import("lib/geometry/Region");
        setRegionToCheck(regionToCheck: import("lib/geometry/Region")): void;
        _regionToCheck: import("lib/geometry/Region") | undefined;
        shouldStitchContent(): boolean;
        setScrollRootElement(scrollRootElement: any): void;
        _scrollRootElement: any;
        getScrollRootElement(): Promise<EyesWrappedElement>;
        setRotation(rotation: import("lib/positioning/ImageRotation")): void;
        _rotation: import("lib/positioning/ImageRotation") | undefined;
        getRotation(): import("lib/positioning/ImageRotation");
        setForcedImageRotation(degrees: number): void;
        getForcedImageRotation(): number;
        setDomUrl(domUrl: string): void;
        _domUrl: string | undefined;
        setCorsIframeHandle(corsIframeHandle: any): void;
        _corsIframeHandle: any;
        getCorsIframeHandle(): any;
        getHideCaret(): boolean;
        setHideCaret(hideCaret: boolean): void;
        setForceFullPageScreenshot(shouldForce: boolean): void;
        getForceFullPageScreenshot(): boolean;
        setWaitBeforeScreenshots(waitBeforeScreenshots: number): void;
        getWaitBeforeScreenshots(): number;
        setHideScrollbars(shouldHide: boolean): void;
        getHideScrollbars(): boolean;
        setStitchMode(mode: any): void;
        getStitchMode(): any;
        setStitchOverlap(stitchOverlap: number): void;
        getStitchOverlap(): number;
    }
    namespace EyesCore {
        export { EyesWrappedDriver, EyesWrappedElement, SupportedElement, SupportedSelector, FrameReference };
    }
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type SupportedElement = {
        "": any;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
}
declare module "lib/EyesClassic" {
    export = EyesClassic;
    const EyesClassic_base: typeof import("lib/EyesCore");
    class EyesClassic extends EyesClassic_base {
        static specialize({ agentId, WrappedDriver, WrappedElement, CheckSettings }: {
            agentId: string;
            WrappedDriver: EyesWrappedDriver;
            WrappedElement: EyesWrappedElement;
            CheckSettings: DriverCheckSettings;
        }): typeof EyesClassic;
        constructor(serverUrl?: string | boolean | any, isDisabled?: boolean | undefined, runner?: import("lib/runner/ClassicRunner") | undefined);
        _runner: import("lib/runner/ClassicRunner");
        _driver: EyesWrappedDriver;
        _executor: EyesJsExecutor;
        _finder: EyesElementFinder;
        _context: EyesBrowsingContext;
        _controller: EyesDriverController;
        _imageRotationDegrees: number;
        _automaticRotation: boolean;
        _isLandscape: boolean;
        _checkFullFrameOrElement: boolean;
        _originalDefaultContentOverflow: string;
        _originalFrameOverflow: string;
        _originalOverflow: string;
        _imageProvider: any;
        _regionPositionCompensation: any;
        _devicePixelRatio: number;
        _targetPositionProvider: any;
        _effectiveViewport: import("lib/geometry/Region");
        _screenshotFactory: import("lib/capture/EyesScreenshotFactory");
        _closePromise: Promise<void>;
        open(driver: Object, appName?: string | undefined, testName?: string | undefined, viewportSize?: import("lib/geometry/RectangleSize") | {
            width: number;
            height: number;
        } | undefined, sessionType?: any): Promise<EyesWrappedDriver>;
        _userAgent: import("lib/useragent/UserAgent") | undefined;
        check(name: any, checkSettings: DriverCheckSettings): Promise<import("lib/match/MatchResult")>;
        _checkSettings: import("lib/fluent/DriverCheckSettings") | undefined;
        private _checkPrepare;
        _stitchContent: boolean | undefined;
        private _checkRegion;
        _checkFullRegion(checkSettings: DriverCheckSettings, targetRegion: import("lib/geometry/Region")): Promise<import("lib/match/MatchResult")>;
        _shouldCheckFullRegion: boolean | undefined;
        _regionFullArea: import("lib/geometry/Region") | null | undefined;
        private _checkElement;
        private _checkFullElement;
        private _checkFrame;
        private _checkFullFrame;
        private _createPositionProvider;
        _getFullRegionScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        _getFullPageScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        _getViewportScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        private _updateScalingParams;
        private _getScaleProviderFactory;
        setFailureReport(mode: typeof import("lib/FailureReports")): void;
        _failureReportOverridden: boolean | undefined;
        getRegionByLocator(locator: any): import("lib/geometry/Region");
    }
    namespace EyesClassic {
        export { EyesWrappedDriver, EyesWrappedElement, EyesBrowsingContext, EyesElementFinder, EyesDriverController, EyesJsExecutor, DriverCheckSettings };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesElementFinder = import("lib/wrappers/EyesElementFinder");
    type EyesBrowsingContext = import("lib/wrappers/EyesBrowsingContext");
    type EyesDriverController = import("lib/wrappers/EyesDriverController");
    type DriverCheckSettings = import("lib/fluent/DriverCheckSettings");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
}
declare module "lib/fluent/IgnoreRegionBySelector" {
    export = IgnoreRegionBySelector;
    const IgnoreRegionBySelector_base: typeof import("lib/fluent/GetRegion");
    class IgnoreRegionBySelector extends IgnoreRegionBySelector_base {
        constructor(selector: SupportedSelector);
        toPersistedRegions(driver: EyesWrappedDriver): Promise<PersistedRegions[]>;
    }
    namespace IgnoreRegionBySelector {
        export { SupportedSelector, EyesWrappedDriver, EyesClassic, PersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type PersistedRegions = {
        type: string;
        selector: string;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/IgnoreRegionByElement" {
    export = IgnoreRegionByElement;
    const IgnoreRegionByElement_base: typeof import("lib/fluent/GetRegion");
    class IgnoreRegionByElement extends IgnoreRegionByElement_base {
        constructor(element: EyesWrappedElement);
        _element: import("lib/wrappers/EyesWrappedElement");
        toPersistedRegions(driver: EyesWrappedDriver): Promise<PersistedRegions[]>;
    }
    namespace IgnoreRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver, EyesClassic, PersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type PersistedRegions = {
        type: string;
        selector: string;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/FloatingRegionBySelector" {
    export = FloatingRegionBySelector;
    const FloatingRegionBySelector_base: typeof import("lib/fluent/GetFloatingRegion");
    class FloatingRegionBySelector extends FloatingRegionBySelector_base {
        constructor(regionSelector: SupportedSelector, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        toPersistedRegions(driver: EyesWrappedDriver): Promise<FloatingPersistedRegions[]>;
    }
    namespace FloatingRegionBySelector {
        export { SupportedSelector, EyesWrappedDriver, EyesClassic, FloatingPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type FloatingPersistedRegions = {
        type: string;
        selector: string;
        maxUpOffset: number;
        maxDownOffset: number;
        maxLeftOffset: number;
        maxRightOffset: number;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/FloatingRegionByElement" {
    export = FloatingRegionByElement;
    const FloatingRegionByElement_base: typeof import("lib/fluent/GetFloatingRegion");
    class FloatingRegionByElement extends FloatingRegionByElement_base {
        constructor(element: EyesWrappedElement, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _element: import("lib/wrappers/EyesWrappedElement");
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        toPersistedRegions(driver: EyesWrappedDriver): Promise<FloatingPersistedRegions[]>;
    }
    namespace FloatingRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver, EyesClassic, FloatingPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type FloatingPersistedRegions = {
        type: string;
        selector: string;
        maxUpOffset: number;
        maxDownOffset: number;
        maxLeftOffset: number;
        maxRightOffset: number;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/AccessibilityRegionBySelector" {
    export = AccessibilityRegionBySelector;
    const AccessibilityRegionBySelector_base: typeof import("lib/fluent/GetAccessibilityRegion");
    class AccessibilityRegionBySelector extends AccessibilityRegionBySelector_base {
        constructor(selector: SupportedSelector, regionType: AccessibilityRegionType);
        _selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        _regionType: string;
        toPersistedRegions(driver: EyesWrappedDriver): Promise<AccessibilityPersistedRegions[]>;
    }
    namespace AccessibilityRegionBySelector {
        export { AccessibilityRegionType, SupportedSelector, EyesWrappedDriver, EyesClassic, AccessibilityPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type AccessibilityPersistedRegions = {
        type: string;
        selector: string;
        accessibilityType: AccessibilityRegionType;
    };
    type SupportedSelector = {
        "": any;
    };
    type AccessibilityRegionType = string;
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/AccessibilityRegionByElement" {
    export = AccessibilityRegionByElement;
    const AccessibilityRegionByElement_base: typeof import("lib/fluent/GetAccessibilityRegion");
    class AccessibilityRegionByElement extends AccessibilityRegionByElement_base {
        constructor(element: EyesWrappedElement, regionType: AccessibilityRegionType);
        _element: import("lib/wrappers/EyesWrappedElement");
        _regionType: string;
        toPersistedRegions(driver: EyesWrappedDriver): Promise<AccessibilityPersistedRegions[]>;
    }
    namespace AccessibilityRegionByElement {
        export { AccessibilityRegionType, EyesWrappedElement, EyesWrappedDriver, EyesClassic, AccessibilityPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type AccessibilityPersistedRegions = {
        type: string;
        selector: string;
        accessibilityType: AccessibilityRegionType;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type AccessibilityRegionType = string;
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/DriverCheckSettings" {
    export = DriverCheckSettings;
    const DriverCheckSettings_base: typeof import("lib/fluent/CheckSettings");
    class DriverCheckSettings extends DriverCheckSettings_base {
        static specialize(SpecsCheckSettings: SpecsCheckSettings): DriverCheckSettings;
        static get specs(): SpecsCheckSettings;
        static window(): DriverCheckSettings;
        static region(region: RegionReference, frame?: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame") | undefined): DriverCheckSettings;
        static frame(frame: FrameReference): DriverCheckSettings;
        constructor(region?: import("lib/geometry/Region") | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | undefined, frame?: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame") | undefined);
        get specs(): SpecsCheckSettings;
        _targetElement: EyesWrappedElement;
        _frameChain: Frame[];
        _scriptHooks: {
            [x: string]: string;
        };
        region(region: RegionReference): this;
        frame(frameReference: any): this;
        scrollRootElement(element: SupportedSelector | SupportedElement | EyesWrappedElement): this;
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement") | undefined;
        getScrollRootElement(): Promise<EyesWrappedElement>;
        getTargetProvider(): import("lib/fluent/TargetRegionByElement") | null;
        get targetElement(): import("lib/wrappers/EyesWrappedElement");
        getFrameChain(): Frame[];
        get frameChain(): import("lib/frames/Frame")[];
        webHook(hook: string): this;
        beforeRenderScreenshotHook(hook: string): this;
        getScriptHooks(): Map<string, string>;
    }
    namespace DriverCheckSettings {
        export { EyesWrappedElement, SupportedElement, SupportedSelector, Frame, FrameReference, RegionReference, SpecsCheckSettings };
    }
    type SpecsCheckSettings = {
        isSelector: (selector: any) => boolean;
        isCompatibleElement: (element: any) => boolean;
        createElementFromSelector: (selector: SupportedSelector) => EyesWrappedElement;
        createElementFromElement: (element: SupportedElement) => EyesWrappedElement;
        isFrameReference: (reference: any) => boolean;
        createFrameReference: (reference: FrameReference) => Frame;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Frame = import("lib/frames/Frame");
    type RegionReference = import("lib/geometry/Region") | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement");
    type SupportedSelector = {
        "": any;
    };
    type SupportedElement = {
        "": any;
    };
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
}
declare module "lib/EyesJsBrowserUtils" {
    export = EyesJsBrowserUtils;
    class EyesJsBrowserUtils {
        static setOverflow(executor: any, value: string | null, rootElement?: any): Promise<string>;
        static hideScrollbars(executor: any, stabilizationTimeout: number, scrollbarsRoot?: any): Promise<string>;
        static getCurrentScrollPosition(executor: any): Promise<Location>;
        static getElementXpath(executor: any, element: any): Promise<any>;
        static setCurrentScrollPosition(executor: any, location: Location): Promise<any>;
        static scrollToBottomRight(executor: any): Promise<any>;
        static getCurrentFrameContentEntireSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        static getOverflowAwareContentEntireSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        static getViewportSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        static getDevicePixelRatio(executor: any): Promise<number>;
        static getCurrentTransform(executor: any): Promise<Map<string, string>>;
        static setTransforms(executor: any, transforms: Map<string, string>): Promise<any>;
        static setTransform(executor: any, transform: string): Promise<any>;
        static translateTo(executor: any, position: Location): Promise<any>;
        static scrollPage(executor: any, scrollAmmount?: number | undefined, timeInterval?: number | undefined): Promise<any>;
    }
}
declare module "lib/fluent/locatorToPersistedRegions" {
    export = locatorToPersistedRegions;
    function locatorToPersistedRegions(locator: any, driver: any): Promise<{
        type: string;
        selector: any;
    }[]>;
}
declare module "lib/match/MatchWindowDataWithScreenshot" {
    export = MatchWindowDataWithScreenshot;
    class MatchWindowDataWithScreenshot {
        constructor({ matchWindowData, screenshot }?: any, ...args: any[]);
        _matchWindowData: any;
        _screenshot: any;
        getMatchWindowData(): any;
        getScreenshot(): any;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/ImageMatchSettings" {
    export = ImageMatchSettings;
    class ImageMatchSettings {
        constructor({ matchLevel, ignore, strict, content, layout, floating, splitTopHeight, splitBottomHeight, ignoreCaret, scale, remainder, }?: any | string);
        _matchLevel: any;
        _ignore: any;
        _strict: any;
        _content: any;
        _layout: any;
        _floating: any;
        _splitTopHeight: any;
        _splitBottomHeight: any;
        _ignoreCaret: any;
        _scale: any;
        _remainder: any;
        getMatchLevel(): any;
        setMatchLevel(value: any): void;
        getIgnore(): import("lib/geometry/Region")[];
        setIgnore(value: import("lib/geometry/Region")[]): void;
        getStrict(): import("lib/geometry/Region")[];
        setStrict(value: import("lib/geometry/Region")[]): void;
        getContent(): import("lib/geometry/Region")[];
        setContent(value: import("lib/geometry/Region")[]): void;
        getLayout(): import("lib/geometry/Region")[];
        setLayout(value: import("lib/geometry/Region")[]): void;
        getFloating(): import("lib/config/FloatingMatchSettings")[];
        setFloating(value: import("lib/config/FloatingMatchSettings")[]): void;
        getSplitTopHeight(): number;
        setSplitTopHeight(value: number): void;
        getSplitBottomHeight(): number;
        setSplitBottomHeight(value: number): void;
        getIgnoreCaret(): boolean;
        setIgnoreCaret(value: boolean): void;
        getScale(): number;
        setScale(value: number): void;
        getRemainder(): number;
        setRemainder(value: number): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/Image" {
    export = Image;
    class Image {
        constructor({ id, size, hasDom }?: {
            id: any;
            size: any;
            hasDom: any;
        });
        _id: any;
        _size: any;
        _hasDom: any;
        getId(): string;
        setId(value: string): void;
        getSize(): import("lib/geometry/RectangleSize");
        setSize(value: import("lib/geometry/RectangleSize")): void;
        getHasDom(): boolean;
        setHasDom(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/ActualAppOutput" {
    export = ActualAppOutput;
    class ActualAppOutput {
        constructor({ image, thumbprint, imageMatchSettings, ignoreExpectedOutputSettings, isMatching, areImagesMatching, occurredAt, userInputs, windowTitle, tag, isPrimary, }?: {
            image: any;
            thumbprint: any;
            imageMatchSettings: any;
            ignoreExpectedOutputSettings: any;
            isMatching: any;
            areImagesMatching: any;
            occurredAt: any;
            userInputs: any;
            windowTitle: any;
            tag: any;
            isPrimary: any;
        });
        _image: any;
        _thumbprint: any;
        _imageMatchSettings: any;
        _ignoreExpectedOutputSettings: any;
        _isMatching: any;
        _areImagesMatching: any;
        _occurredAt: any;
        _userInputs: any;
        _windowTitle: any;
        _tag: any;
        _isPrimary: any;
        getImage(): import("lib/metadata/Image");
        setImage(value: import("lib/metadata/Image")): void;
        getThumbprint(): import("lib/metadata/Image");
        setThumbprint(value: import("lib/metadata/Image")): void;
        getImageMatchSettings(): import("lib/metadata/ImageMatchSettings");
        setImageMatchSettings(value: import("lib/metadata/ImageMatchSettings")): void;
        getIgnoreExpectedOutputSettings(): boolean;
        setIgnoreExpectedOutputSettings(value: boolean): void;
        getIsMatching(): boolean;
        setIsMatching(value: boolean): void;
        getAreImagesMatching(): boolean;
        setAreImagesMatching(value: boolean): void;
        getOccurredAt(): Date;
        setOccurredAt(value: Date): void;
        getUserInputs(): object[];
        setUserInputs(value: object[]): void;
        getWindowTitle(): string;
        setWindowTitle(value: string): void;
        getTag(): string;
        setTag(value: string): void;
        getIsPrimary(): boolean;
        setIsPrimary(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/Annotations" {
    export = Annotations;
    class Annotations {
        constructor({ floating, ignore, strict, content, layout }?: {
            floating: any;
            ignore: any;
            strict: any;
            content: any;
            layout: any;
        });
        _floating: any;
        _ignore: any;
        _strict: any;
        _content: any;
        _layout: any;
        getFloating(): import("lib/config/FloatingMatchSettings")[];
        setFloating(value: import("lib/config/FloatingMatchSettings")[]): void;
        getIgnore(): import("lib/geometry/Region")[];
        setIgnore(value: import("lib/geometry/Region")[]): void;
        getStrict(): import("lib/geometry/Region")[];
        setStrict(value: import("lib/geometry/Region")[]): void;
        getContent(): import("lib/geometry/Region")[];
        setContent(value: import("lib/geometry/Region")[]): void;
        getLayout(): import("lib/geometry/Region")[];
        setLayout(value: import("lib/geometry/Region")[]): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/BatchInfo" {
    export = BatchInfo;
    class BatchInfo {
        constructor({ id, name, startedAt }?: {
            id: any;
            name: any;
            startedAt: any;
        });
        _id: any;
        _name: any;
        _startedAt: any;
        getId(): string;
        setId(value: string): void;
        getName(): string;
        setName(value: string): void;
        getStartedAt(): Date;
        setStartedAt(value: Date): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/Branch" {
    export = Branch;
    class Branch {
        constructor({ id, name, isDeleted, updateInfo }?: {
            id: any;
            name: any;
            isDeleted: any;
            updateInfo: any;
        });
        _id: any;
        _name: any;
        _isDeleted: any;
        _updateInfo: any;
        getId(): string;
        setId(value: string): void;
        getName(): string;
        setName(value: string): void;
        getIsDeleted(): boolean;
        setIsDeleted(value: boolean): void;
        getUpdateInfo(): object;
        setUpdateInfo(value: object): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/ExpectedAppOutput" {
    export = ExpectedAppOutput;
    class ExpectedAppOutput {
        constructor({ tag, image, thumbprint, occurredAt, annotations }?: {
            tag: any;
            image: any;
            thumbprint: any;
            occurredAt: any;
            annotations: any;
        });
        _tag: any;
        _image: any;
        _thumbprint: any;
        _occurredAt: any;
        _annotations: any;
        getTag(): string;
        setTag(value: string): void;
        getImage(): import("lib/metadata/Image");
        setImage(value: import("lib/metadata/Image")): void;
        getThumbprint(): import("lib/metadata/Image");
        setThumbprint(value: import("lib/metadata/Image")): void;
        getOccurredAt(): Date;
        setOccurredAt(value: Date): void;
        getAnnotations(): import("lib/metadata/Annotations");
        setAnnotations(value: import("lib/metadata/Annotations")): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/StartInfo" {
    export = StartInfo;
    class StartInfo {
        constructor({ sessionType, isTransient, ignoreBaseline, appIdOrName, compareWithParentBranch, scenarioIdOrName, displayName, batchInfo, environment, matchLevel, defaultMatchSettings, agentId, properties, render, }?: {
            sessionType: any;
            isTransient: any;
            ignoreBaseline: any;
            appIdOrName: any;
            compareWithParentBranch: any;
            scenarioIdOrName: any;
            displayName: any;
            batchInfo: any;
            environment: any;
            matchLevel: any;
            defaultMatchSettings: any;
            agentId: any;
            properties: any;
            render: any;
        });
        _sessionType: any;
        _isTransient: any;
        _ignoreBaseline: any;
        _appIdOrName: any;
        _compareWithParentBranch: any;
        _scenarioIdOrName: any;
        _displayName: any;
        _batchInfo: any;
        _environment: any;
        _matchLevel: any;
        _defaultMatchSettings: any;
        _agentId: any;
        _properties: any;
        _render: any;
        getSessionType(): string;
        setSessionType(value: string): void;
        getIsTransient(): boolean;
        setIsTransient(value: boolean): void;
        getIgnoreBaseline(): boolean;
        setIgnoreBaseline(value: boolean): void;
        getAppIdOrName(): string;
        setAppIdOrName(value: string): void;
        getCompareWithParentBranch(): boolean;
        setCompareWithParentBranch(value: boolean): void;
        getScenarioIdOrName(): string;
        setScenarioIdOrName(value: string): void;
        getDisplayName(): string;
        setDisplayName(value: string): void;
        getBatchInfo(): import("lib/metadata/BatchInfo");
        setBatchInfo(value: import("lib/metadata/BatchInfo")): void;
        getEnvironment(): import("lib/AppEnvironment");
        setEnvironment(value: import("lib/AppEnvironment")): void;
        getMatchLevel(): string;
        setMatchLevel(value: string): void;
        getDefaultMatchSettings(): import("lib/metadata/ImageMatchSettings");
        setDefaultMatchSettings(value: import("lib/metadata/ImageMatchSettings")): void;
        getAgentId(): string;
        setAgentId(value: string): void;
        getProperties(): object[];
        setProperties(value: object[]): void;
        getRender(): boolean;
        setRender(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/metadata/SessionResults" {
    export = SessionResults;
    class SessionResults {
        constructor({ id, revision, runningSessionId, isAborted, isStarred, startInfo, batchId, secretToken, state, status, isDefaultStatus, startedAt, duration, isDifferent, env, branch, expectedAppOutput, actualAppOutput, baselineId, baselineRevId, scenarioId, scenarioName, appId, baselineModelId, baselineEnvId, baselineEnv, appName, baselineBranchName, isNew, }?: {
            id: any;
            revision: any;
            runningSessionId: any;
            isAborted: any;
            isStarred: any;
            startInfo: any;
            batchId: any;
            secretToken: any;
            state: any;
            status: any;
            isDefaultStatus: any;
            startedAt: any;
            duration: any;
            isDifferent: any;
            env: any;
            branch: any;
            expectedAppOutput: any;
            actualAppOutput: any;
            baselineId: any;
            baselineRevId: any;
            scenarioId: any;
            scenarioName: any;
            appId: any;
            baselineModelId: any;
            baselineEnvId: any;
            baselineEnv: any;
            appName: any;
            baselineBranchName: any;
            isNew: any;
        });
        _id: any;
        _revision: any;
        _runningSessionId: any;
        _isAborted: any;
        _isStarred: any;
        _startInfo: any;
        _batchId: any;
        _secretToken: any;
        _state: any;
        _status: any;
        _isDefaultStatus: any;
        _startedAt: any;
        _duration: any;
        _isDifferent: any;
        _env: any;
        _branch: any;
        _expectedAppOutput: any;
        _actualAppOutput: any;
        _baselineId: any;
        _baselineRevId: any;
        _scenarioId: any;
        _scenarioName: any;
        _appId: any;
        _baselineModelId: any;
        _baselineEnvId: any;
        _baselineEnv: any;
        _appName: any;
        _baselineBranchName: any;
        _isNew: any;
        getId(): string;
        setId(value: string): void;
        getRevision(): number;
        setRevision(value: number): void;
        getRunningSessionId(): string;
        setRunningSessionId(value: string): void;
        getIsAborted(): boolean;
        setIsAborted(value: boolean): void;
        getIsStarred(): boolean;
        setIsStarred(value: boolean): void;
        getStartInfo(): import("lib/metadata/StartInfo");
        setStartInfo(value: import("lib/metadata/StartInfo")): void;
        getBatchId(): string;
        setBatchId(value: string): void;
        getSecretToken(): string;
        setSecretToken(value: string): void;
        getState(): string;
        setState(value: string): void;
        getStatus(): string;
        setStatus(value: string): void;
        getIsDefaultStatus(): boolean;
        setIsDefaultStatus(value: boolean): void;
        getStartedAt(): string;
        setStartedAt(value: string): void;
        getDuration(): number;
        setDuration(value: number): void;
        getIsDifferent(): boolean;
        setIsDifferent(value: boolean): void;
        getEnv(): import("lib/AppEnvironment");
        setEnv(value: import("lib/AppEnvironment")): void;
        getBranch(): import("lib/metadata/Branch");
        setBranch(value: import("lib/metadata/Branch")): void;
        getExpectedAppOutput(): import("lib/metadata/ExpectedAppOutput")[];
        setExpectedAppOutput(value: import("lib/metadata/ExpectedAppOutput")[]): void;
        getActualAppOutput(): import("lib/metadata/ActualAppOutput")[];
        setActualAppOutput(value: import("lib/metadata/ActualAppOutput")[]): void;
        getBaselineId(): string;
        setBaselineId(value: string): void;
        getBaselineRevId(): string;
        setBaselineRevId(value: string): void;
        getScenarioId(): string;
        setScenarioId(value: string): void;
        getScenarioName(): string;
        setScenarioName(value: string): void;
        getAppId(): string;
        setAppId(value: string): void;
        getBaselineModelId(): string;
        setBaselineModelId(value: string): void;
        getBaselineEnvId(): string;
        setBaselineEnvId(value: string): void;
        getBaselineEnv(): import("lib/AppEnvironment");
        setBaselineEnv(value: import("lib/AppEnvironment")): void;
        getAppName(): string;
        setAppName(value: string): void;
        getBaselineBranchName(): string;
        setBaselineBranchName(value: string): void;
        getIsNew(): boolean;
        setIsNew(value: boolean): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/renderer/EmulationDevice" {
    export = EmulationDevice;
    class EmulationDevice {
        constructor({ width, height, deviceScaleFactor, mobile }?: {
            width: any;
            height: any;
            deviceScaleFactor: any;
            mobile: any;
        });
        _width: any;
        _height: any;
        _deviceScaleFactor: any;
        _mobile: any;
        getWidth(): number;
        setWidth(value: number): void;
        getHeight(): number;
        setHeight(value: number): void;
        getDeviceScaleFactor(): string;
        setDeviceScaleFactor(value: string): void;
        getMobile(): string;
        setMobile(value: string): void;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/renderer/EmulationInfo" {
    export = EmulationInfo;
    class EmulationInfo {
        constructor({ device, deviceName, screenOrientation }?: {
            device: any;
            deviceName: any;
            screenOrientation: any;
        });
        _device: any;
        _deviceName: any;
        _screenOrientation: any;
        getDevice(): import("lib/renderer/EmulationDevice");
        setDevice(value: import("lib/renderer/EmulationDevice")): void;
        getDeviceName(): string;
        setDeviceName(value: string): void;
        getScreenOrientation(): ScreenOrientation;
        setScreenOrientation(value: ScreenOrientation): void;
        toJSON(): any;
        toString(): string;
    }
}
declare module "lib/renderer/RenderInfo" {
    export = RenderInfo;
    class RenderInfo {
        static fromRectangleSize(size: any, sizeMode?: string | undefined): RenderInfo;
        constructor({ width, height, sizeMode, selector, region, emulationInfo, iosDeviceInfo }?: {
            width: any;
            height: any;
            sizeMode: any;
            selector: any;
            region: any;
            emulationInfo: any;
            iosDeviceInfo: any;
        });
        _width: any;
        _height: any;
        _sizeMode: any;
        _selector: any;
        _region: any;
        _emulationInfo: any;
        _iosDeviceInfo: any;
        getWidth(): number;
        setWidth(value: number): void;
        getHeight(): number;
        setHeight(value: number): void;
        getSizeMode(): string;
        setSizeMode(value: string): void;
        getSelector(): string;
        setSelector(value: string): void;
        getRegion(): import("lib/geometry/Region");
        setRegion(value: import("lib/geometry/Region")): void;
        getEmulationInfo(): import("lib/renderer/EmulationInfo");
        setEmulationInfo(value: import("lib/renderer/EmulationInfo")): void;
        getIosDeviceInfo(): any;
        toJSON(): object;
        toString(): string;
    }
    namespace RenderInfo {
        export { IosDeviceInfo };
    }
    type IosDeviceInfo = {
        name: any;
        version: any;
        screenOrientation: any;
    };
}
declare module "lib/renderer/RenderRequest" {
    export = RenderRequest;
    class RenderRequest {
        constructor({ webhook, stitchingService, url, dom, resources, renderInfo, platform, browserName, scriptHooks, selectorsToFindRegionsFor, sendDom, renderId, agentId, }?: {
            webhook: any;
            stitchingService: any;
            url: any;
            dom: any;
            resources: any;
            renderInfo: any;
            platform: any;
            browserName: any;
            scriptHooks: any;
            selectorsToFindRegionsFor: any;
            sendDom: any;
            renderId: any;
            agentId: any;
        });
        _webhook: any;
        _stitchingService: any;
        _url: any;
        _dom: any;
        _resources: any;
        _renderInfo: any;
        _platform: any;
        _browserName: any;
        _renderId: any;
        _scriptHooks: any;
        _selectorsToFindRegionsFor: any;
        _sendDom: any;
        _agentId: any;
        getWebhook(): string;
        getStitchingService(): string;
        getUrl(): string;
        getDom(): any;
        getResources(): any[];
        getRenderInfo(): any;
        getPlatform(): string;
        getBrowserName(): string;
        getRenderId(): string;
        getAgentId(): string;
        setAgentId(value: string): void;
        setRenderId(value: string): void;
        getScriptHooks(): string;
        setScriptHooks(value: string): void;
        getSelectorsToFindRegionsFor(): string[];
        setSelectorsToFindRegionsFor(value: string[]): void;
        getSendDom(): boolean;
        setSendDom(value: boolean): void;
        toJSON(): {
            webhook: any;
            stitchingService: any;
            url: any;
            dom: any;
            resources: {};
        };
        toString(): string;
    }
}
declare module "lib/renderer/RGridResource" {
    export = RGridResource;
    class RGridResource {
        constructor({ url, contentType, content }?: {
            url: any;
            contentType: any;
            content: any;
        });
        _url: any;
        _contentType: any;
        _content: any;
        _sha256hash: string;
        getUrl(): string;
        setUrl(value: string): void;
        getContentType(): string;
        setContentType(value: string): void;
        getContent(): Buffer;
        setContent(value: Buffer): void;
        getSha256Hash(): string;
        getHashAsObject(): {
            hashFormat: string;
            hash: string;
            contentType: string;
        };
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/renderer/RGridDom" {
    export = RGridDom;
    class RGridDom {
        constructor({ domNodes, resources }?: {
            domNodes: any;
            resources: any;
        });
        _domNodes: any;
        _resources: any;
        _sha256hash: string;
        _contentAsCdt: string;
        getDomNodes(): object;
        setDomNodes(value: object): void;
        getResources(): import("lib/renderer/RGridResource")[];
        setResources(value: import("lib/renderer/RGridResource")[]): void;
        asResource(): import("lib/renderer/RGridResource");
        getSha256Hash(): string;
        getHashAsObject(): {
            hashFormat: string;
            hash: string;
        };
        _getContentAsCdt(): string;
        toJSON(): object;
        toString(): string;
    }
}
declare module "lib/TestResultsFormatter" {
    export = TestResultsFormatter;
    class TestResultsFormatter {
        constructor(resultsList?: any[]);
        _resultsList: any[];
        addTestResults(results: any): TestResultsFormatter;
        addResults(results: any): TestResultsFormatter;
        getResultsList(): any[];
        clearResultsList(): void;
        asFormatterString(includeSubTests?: boolean | undefined, markNewAsPassed?: boolean | undefined): string;
        asHierarchicTAPString(includeSubTests?: boolean | undefined, markNewAsPassed?: boolean | undefined): string;
        asFlattenedTAPString(markNewAsPassed?: boolean | undefined): string;
        toXmlOutput({ totalTime }?: {
            totalTime: any;
        }): string;
    }
}
declare module "lib/runner/VisualGridRunner" {
    export = VisualGridRunner;
    const VisualGridRunner_base: typeof import("lib/runner/EyesRunner");
    class VisualGridRunner extends VisualGridRunner_base {
        constructor(concurrentSessions?: number | undefined);
        _concurrentSessions: number | undefined;
        getConcurrentSessions(): number;
        makeGetVisualGridClient(makeVisualGridClient: any): void;
        _getVisualGridClient: ((...args: any[]) => any) | undefined;
        getVisualGridClientWithCache(config: any): Promise<any>;
    }
}
declare module "lib/EyesVisualGrid" {
    export = EyesVisualGrid;
    const EyesVisualGrid_base: typeof import("lib/EyesCore");
    class EyesVisualGrid extends EyesVisualGrid_base {
        static specialize({ agentId, WrappedDriver, WrappedElement, CheckSettings, VisualGridClient }: {
            agentId: string;
            WrappedDriver: any;
            WrappedElement: any;
            CheckSettings: any;
            VisualGridClient: any;
        }): typeof EyesVisualGrid;
        constructor(serverUrl?: string | undefined, isDisabled?: boolean | undefined, runner?: any);
        _runner: any;
        _jsExecutor: any;
        _checkWindowCommand: any;
        _closeCommand: any;
        _abortCommand: any;
        _closePromise: Promise<void>;
        open(driver: object, optArg1: import("lib/config/Configuration") | string, optArg2?: string | undefined, optArg3?: object | import("lib/geometry/RectangleSize") | undefined, optArg4?: import("lib/config/Configuration") | undefined): Promise<any>;
        _driver: any;
        _executor: any;
        _finder: any;
        _context: any;
        _controller: any;
        check(name: string, checkSettings: any): Promise<any>;
        _checkPrepare(checkSettings: any, operation: any): Promise<any>;
        _getTargetConfiguration(checkSettings: any): Promise<{
            region: any;
            selector: any;
        }>;
        closeAndPrintResults(throwEx?: boolean | undefined): Promise<void>;
    }
    namespace EyesVisualGrid {
        export { CorsIframeHandle };
    }
    type CorsIframeHandle = string;
}
declare module "lib/EyesFactory" {
    export = EyesFactory;
    class EyesFactory {
        static specialize({ EyesClassic, EyesVisualGrid }: {
            EyesClassic: EyesClassic;
            EyesVisualGrid: EyesVisualGrid;
        }): EyesFactory;
        private static fromBrowserInfo;
        constructor(serverUrl?: string | boolean | import("lib/runner/VisualGridRunner") | undefined, isDisabled?: boolean | undefined, runner?: import("lib/runner/EyesRunner") | undefined);
    }
    namespace EyesFactory {
        export { EyesClassic, EyesVisualGrid };
    }
    type EyesClassic = import("lib/EyesClassic");
    type EyesVisualGrid = import("lib/EyesVisualGrid");
}
declare module "lib/AccessibilityStatus" {
    export type AccessibilityStatus = string;
    export var AccessibilityStatus: Readonly<{
        Passed: string;
        Failed: string;
    }>;
}
declare module "index" {
    export var AccessibilityLevel: Readonly<{
        AA: string;
        AAA: string;
    }>;
    export var AccessibilityGuidelinesVersion: Readonly<{
        WCAG_2_0: string;
        WCAG_2_1: string;
    }>;
    export var AccessibilityMatchSettings: typeof import("lib/config/AccessibilityMatchSettings");
    export var AccessibilityRegionType: Readonly<{
        IgnoreContrast: string;
        RegularText: string;
        LargeText: string;
        BoldText: string;
        GraphicalObject: string;
    }>;
    export var BatchInfo: typeof import("lib/config/BatchInfo");
    export var BrowserType: Readonly<{
        CHROME: string;
        FIREFOX: string;
        IE_11: string;
        IE_10: string;
        EDGE: string;
        EDGE_CHROMIUM: string;
        EDGE_LEGACY: string;
        SAFARI: string;
        CHROME_ONE_VERSION_BACK: string;
        CHROME_TWO_VERSIONS_BACK: string;
        FIREFOX_ONE_VERSION_BACK: string;
        FIREFOX_TWO_VERSIONS_BACK: string;
        SAFARI_ONE_VERSION_BACK: string;
        SAFARI_TWO_VERSIONS_BACK: string;
        EDGE_CHROMIUM_ONE_VERSION_BACK: string;
    }>;
    export var Configuration: typeof import("lib/config/Configuration");
    export var DeviceName: Readonly<{
        Blackberry_PlayBook: string;
        BlackBerry_Z30: string;
        Galaxy_A5: string;
        Galaxy_Note_10: string;
        Galaxy_Note_10_Plus: string;
        Galaxy_Note_2: string;
        Galaxy_Note_3: string;
        Galaxy_Note_4: string;
        Galaxy_Note_8: string;
        Galaxy_Note_9: string;
        Galaxy_S10: string;
        Galaxy_S10_Plus: string;
        Galaxy_S3: string;
        Galaxy_S5: string;
        Galaxy_S8: string;
        Galaxy_S8_Plus: string;
        Galaxy_S9: string;
        Galaxy_S9_Plus: string;
        iPad: string;
        iPad_6th_Gen: string;
        iPad_7th_Gen: string;
        iPad_Air_2: string;
        iPad_Mini: string;
        iPad_Pro: string;
        iPhone_11: string;
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_4: string;
        iPhone_5SE: string;
        iPhone_6_7_8: string;
        iPhone_6_7_8_Plus: string;
        iPhone_X: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_XS_Max: string;
        Kindle_Fire_HDX: string;
        Laptop_with_HiDPI_screen: string;
        Laptop_with_MDPI_screen: string;
        Laptop_with_touch: string;
        LG_G6: string;
        LG_Optimus_L70: string;
        Microsoft_Lumia_550: string;
        Microsoft_Lumia_950: string;
        Nexus_10: string;
        Nexus_4: string;
        Nexus_5: string;
        Nexus_5X: string;
        Nexus_6: string;
        Nexus_6P: string;
        Nexus_7: string;
        Nokia_Lumia_520: string;
        Nokia_N9: string;
        OnePlus_7T: string;
        OnePlus_7T_Pro: string;
        Pixel_2: string;
        Pixel_2_XL: string;
        Pixel_3: string;
        Pixel_3_XL: string;
        Pixel_4: string;
        Pixel_4_XL: string;
    }>;
    export var ExactMatchSettings: typeof import("lib/config/ExactMatchSettings");
    export var FloatingMatchSettings: typeof import("lib/config/FloatingMatchSettings");
    export var ImageMatchSettings: typeof import("lib/config/ImageMatchSettings");
    export var MatchLevel: Readonly<{
        None: string;
        LegacyLayout: string;
        Layout: string;
        Layout2: string;
        Content: string;
        Strict: string;
        Exact: string;
    }>;
    export var PropertyData: typeof import("lib/config/PropertyData");
    export var ProxySettings: typeof import("lib/config/ProxySettings");
    export var ScreenOrientation: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
    export var SessionType: Readonly<{
        SEQUENTIAL: string;
        PROGRESSION: string;
    }>;
    export var StitchMode: Readonly<{
        SCROLL: string;
        CSS: string;
    }>;
    export var IosDeviceName: Readonly<{
        iPhone_11_Pro: string;
    }>;
    export var IosScreenOrientation: Readonly<{
        PORTRAIT: string;
        UPSIDE_DOWN: string;
        LANDSCAPE_LEFT: string;
        LANDSCAPE_RIGHT: string;
    }>;
    export var IosVersion: Readonly<{
        Latest: string;
    }>;
    export var DebugScreenshotsProvider: typeof import("lib/debug/DebugScreenshotsProvider");
    export var FileDebugScreenshotsProvider: typeof import("lib/debug/FileDebugScreenshotsProvider");
    export var NullDebugScreenshotProvider: typeof import("lib/debug/NullDebugScreenshotProvider");
    export var EyesError: typeof import("lib/errors/EyesError");
    export var CoordinatesTypeConversionError: typeof import("lib/errors/CoordinatesTypeConversionError");
    export var DiffsFoundError: typeof import("lib/errors/DiffsFoundError");
    export var NewTestError: typeof import("lib/errors/NewTestError");
    export var OutOfBoundsError: typeof import("lib/errors/OutOfBoundsError");
    export var TestFailedError: typeof import("lib/errors/TestFailedError");
    export var EyesDriverOperationError: typeof import("lib/errors/EyesDriverOperationError");
    export var ElementNotFoundError: typeof import("lib/errors/ElementNotFoundError");
    export var CoordinatesType: Readonly<{
        SCREENSHOT_AS_IS: string;
        CONTEXT_AS_IS: string;
        CONTEXT_RELATIVE: string;
    }>;
    export var Location: typeof import("lib/geometry/Location");
    export var RectangleSize: typeof import("lib/geometry/RectangleSize");
    export var Region: typeof import("lib/geometry/Region");
    export var PropertyHandler: typeof import("lib/handler/PropertyHandler");
    export var ReadOnlyPropertyHandler: typeof import("lib/handler/ReadOnlyPropertyHandler");
    export var SimplePropertyHandler: typeof import("lib/handler/SimplePropertyHandler");
    export var ImageDeltaCompressor: typeof import("lib/images/ImageDeltaCompressor");
    export var MutableImage: typeof import("lib/images/MutableImage");
    export var ConsoleLogHandler: typeof import("lib/logging/ConsoleLogHandler");
    export var DebugLogHandler: typeof import("lib/logging/DebugLogHandler");
    export var FileLogHandler: typeof import("lib/logging/FileLogHandler");
    export var Logger: typeof import("lib/logging/Logger");
    export var LogHandler: typeof import("lib/logging/LogHandler");
    export var NullLogHandler: typeof import("lib/logging/NullLogHandler");
    export var BrowserNames: Readonly<{
        Edge: string;
        IE: string;
        Firefox: string;
        Chrome: string;
        Safari: string;
        Chromium: string;
    }>;
    export var OSNames: Readonly<{
        Android: string;
        ChromeOS: string;
        IOS: string;
        Linux: string;
        Macintosh: string;
        MacOSX: string;
        Unknown: string;
        Windows: string;
    }>;
    export var UserAgent: typeof import("lib/useragent/UserAgent");
    export var ArgumentGuard: {
        notEqual: (param: object, value: object, paramName: string) => void;
        alphanumeric: (param: object, paramName: string) => void;
        notNull: (param: object, paramName: string) => void;
        isNull: (param: object, paramName: string) => void;
        notNullOrEmpty: (param: object, paramName: string) => void;
        greaterThanOrEqualToZero: (param: number, paramName: string, shouldBeInteger?: boolean) => void;
        greaterThanZero: (param: number, paramName: string, isInteger?: boolean) => void;
        notZero: (param: number, paramName: string, isInteger?: boolean) => void;
        isInteger: (param: number, paramName: string, strict?: boolean | undefined) => void;
        isString: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isNumber: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isBoolean: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isArray: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isPlainObject: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isBuffer: (param: object, paramName: string, strict?: boolean | undefined) => void;
        isBase64: (param: object) => void;
        isValidState: (isValid: boolean, errMsg: string) => void;
        isValidType: (param: object, type: object, strict?: boolean | undefined) => void;
        isValidEnumValue: (value: any, enumObject: object, strict?: boolean | undefined) => void;
        hasProperties: (object: object, properties: string | string[], paramName: string) => void;
    };
    export var ConfigUtils: {
        getConfig: ({ configParams, configPath, logger, }?: {
            configParams?: any[] | undefined;
            configPath: any;
            logger?: import("lib/logging/Logger") | undefined;
        }) => {};
        toEnvVarName: (camelCaseStr: string) => string;
    };
    export var DateTimeUtils: {
        toISO8601DateTime: (date?: Date | undefined) => string;
        toRfc1123DateTime: (date?: Date | undefined) => string;
        toLogFileDateTime: (date?: Date | undefined, utc?: boolean | undefined) => string;
        fromISO8601DateTime: (dateTime: string) => Date;
    };
    export var FileUtils: {
        writeFromBuffer: (imageBuffer: Buffer, filename: string) => Promise<any>;
        readToBuffer: (path: string) => Promise<Buffer>;
    };
    export var GeneralUtils: {
        urlConcat: (url: string, ...suffixes: string[]) => string;
        stripTrailingSlash: (url: string) => string;
        isAbsoluteUrl: (url: string) => boolean;
        stringify: (...args: any[]) => string;
        stringifySingle: (arg: any) => string;
        toString: (object: object, exclude?: string[] | undefined) => string;
        toPlain: (object: object, exclude?: string[] | undefined, rename?: object | undefined) => object;
        mergeDeep: <TFirst, TSecond>(target: TFirst, source: TSecond) => TFirst | TSecond;
        guid: () => string;
        randomAlphanumeric: (length?: number) => string;
        sleep: (ms: number) => Promise<any>;
        toISO8601DateTime: (date?: Date | undefined) => string;
        toRfc1123DateTime: (date?: Date | undefined) => string;
        toLogFileDateTime: (date?: Date | undefined) => string;
        fromISO8601DateTime: (dateTime: string) => Date;
        jwtDecode: (token: string) => object;
        cartesianProduct: (...arrays: (Object | [])[]) => [][][];
        getPropertyByPath: (object: object, path: string) => any;
        getEnvValue: (propName: string, isBoolean?: boolean) => any;
        backwardCompatible: (...args: any[]) => {};
        cleanStringForJSON: (str: string) => string;
        isFeatureFlagOn: (featureName: any) => boolean;
        isFeatureFlagOff: (featureName: any) => boolean;
        presult: <T>(promise: PromiseLike<T>) => PromiseLike<[any, T | undefined]>;
        pexec: (...args: any[]) => import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: Buffer;
            stderr: Buffer;
        }> & import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: string | Buffer;
            stderr: string | Buffer;
        }>;
        cachify: (getterFunction: any, cacheRegardlessOfArgs?: boolean) => (...args: any[]) => any;
    };
    export var ImageUtils: {
        parseImage: (buffer: Buffer) => Promise<(new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image>;
        packImage: (image: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image) => Promise<Buffer>;
        createImage: (width: number, height: number) => (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image;
        scaleImage: (image: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, scaleRatio: number) => Promise<(new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image>;
        resizeImage: (image: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, targetWidth: number, targetHeight: number) => Promise<(new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image>;
        cropImage: (image: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, region: any) => Promise<(new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image>;
        rotateImage: (image: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, degrees: number) => Promise<(new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image>;
        copyPixels: (dstImage: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, dstPosition: {
            x: number;
            y: number;
        }, srcImage: (new (width?: number | undefined, height?: number | undefined) => HTMLImageElement) | import("png-async").Image, srcPosition: {
            x: number;
            y: number;
        }, size: {
            width: number;
            height: number;
        }) => void;
        getImageSizeFromBuffer: (imageBuffer: Buffer) => {
            width: number;
            height: number;
        };
    };
    export var PerformanceUtils: {
        start: (name?: string | undefined, storeResults?: boolean | undefined) => object;
        end: (name: string, deleteResults?: boolean | undefined) => {
            name: string;
            time: number;
            summary: string;
        };
        result: (name: string) => {
            name: string;
            time: number;
            summary: string;
        };
        elapsedString: (milliseconds: number) => string;
    };
    export var StreamUtils: {
        ReadableBufferStream: any;
        WritableBufferStream: any;
    };
    export var TypeUtils: {
        isNull: (value: any) => boolean;
        isNotNull: (value: any) => boolean;
        isString: (value: any) => boolean;
        isNumber: (value: any) => boolean;
        isInteger: (value: any) => boolean;
        isBoolean: (value: any) => boolean;
        isObject: (value: any) => boolean;
        isPlainObject: (value: any) => boolean;
        isArray: (value: any) => boolean;
        isBuffer: (value: any) => boolean;
        isBase64: (value: any) => boolean;
        isUrl: (value: any) => boolean;
        has: (object: object, keys: string | string[]) => boolean;
        hasMethod: (object: object, methods: string | string[]) => boolean;
        getOrDefault: (value: any, defaultValue: any) => any;
        isFunction: (value: any) => boolean;
        isIterator: (value: any) => boolean;
    };
    export var deserializeDomSnapshotResult: typeof import("lib/utils/deserializeDomSnapshotResult");
    export var DomCapture: typeof import("lib/DomCapture");
    export var AppOutputProvider: typeof import("lib/capture/AppOutputProvider");
    export var AppOutputWithScreenshot: typeof import("lib/capture/AppOutputWithScreenshot");
    export var EyesScreenshot: typeof import("lib/capture/EyesScreenshot");
    export var EyesScreenshotNew: typeof import("lib/capture/EyesScreenshotNew");
    export var EyesScreenshotFactory: typeof import("lib/capture/EyesScreenshotFactory");
    export var EyesSimpleScreenshot: typeof import("lib/capture/EyesSimpleScreenshot");
    export var EyesSimpleScreenshotFactory: typeof import("lib/capture/EyesSimpleScreenshotFactory");
    export var FullPageCaptureAlgorithm: typeof import("lib/capture/FullPageCaptureAlgorithm");
    export var ImageProvider: typeof import("lib/capture/ImageProvider");
    export var ImageProviderFactory: typeof import("lib/capture/ImageProviderFactory");
    export var CorsIframeHandle: typeof import("lib/capture/CorsIframeHandles");
    export var CorsIframeHandler: typeof import("lib/capture/CorsIframeHandler");
    export var CutProvider: typeof import("lib/cropping/CutProvider");
    export var FixedCutProvider: typeof import("lib/cropping/FixedCutProvider");
    export var NullCutProvider: typeof import("lib/cropping/NullCutProvider");
    export var UnscaledFixedCutProvider: typeof import("lib/cropping/UnscaledFixedCutProvider");
    export var RemoteSessionEventHandler: typeof import("lib/events/RemoteSessionEventHandler");
    export var SessionEventHandler: typeof import("lib/events/SessionEventHandler");
    export var ValidationInfo: typeof import("lib/events/ValidationInfo");
    export var ValidationResult: typeof import("lib/events/ValidationResult");
    export var CheckSettings: typeof import("lib/fluent/CheckSettings");
    export var DriverCheckSettings: typeof import("lib/fluent/DriverCheckSettings");
    export var locatorToPersistedRegions: typeof import("lib/fluent/locatorToPersistedRegions");
    export var GetRegion: typeof import("lib/fluent/GetRegion");
    export var GetSelector: typeof import("lib/fluent/GetSelector");
    export var IgnoreRegionByRectangle: typeof import("lib/fluent/IgnoreRegionByRectangle");
    export var IgnoreRegionBySelector: typeof import("lib/fluent/IgnoreRegionBySelector");
    export var IgnoreRegionByElement: typeof import("lib/fluent/IgnoreRegionByElement");
    export var GetFloatingRegion: typeof import("lib/fluent/GetFloatingRegion");
    export var FloatingRegionByRectangle: typeof import("lib/fluent/FloatingRegionByRectangle");
    export var FloatingRegionBySelector: typeof import("lib/fluent/FloatingRegionBySelector");
    export var FloatingRegionByElement: typeof import("lib/fluent/FloatingRegionByElement");
    export var GetAccessibilityRegion: typeof import("lib/fluent/GetAccessibilityRegion");
    export var AccessibilityRegionByRectangle: typeof import("lib/fluent/AccessibilityRegionByRectangle");
    export var AccessibilityRegionBySelector: typeof import("lib/fluent/AccessibilityRegionBySelector");
    export var AccessibilityRegionByElement: typeof import("lib/fluent/AccessibilityRegionByElement");
    export var TargetRegionByElement: typeof import("lib/fluent/TargetRegionByElement");
    export var AppOutput: typeof import("lib/match/AppOutput");
    export var MatchResult: typeof import("lib/match/MatchResult");
    export var MatchSingleWindowData: typeof import("lib/match/MatchSingleWindowData");
    export var MatchWindowData: typeof import("lib/match/MatchWindowData");
    export var ImageMatchOptions: typeof import("lib/match/ImageMatchOptions");
    export var MatchWindowDataWithScreenshot: typeof import("lib/match/MatchWindowDataWithScreenshot");
    export namespace metadata {
        export const ActualAppOutput: typeof import("lib/metadata/ActualAppOutput");
        export const Annotations: typeof import("lib/metadata/Annotations");
        const BatchInfo_1: typeof import("lib/metadata/BatchInfo");
        export { BatchInfo_1 as BatchInfo };
        export const Branch: typeof import("lib/metadata/Branch");
        export const ExpectedAppOutput: typeof import("lib/metadata/ExpectedAppOutput");
        const Image_1: typeof import("lib/metadata/Image");
        export { Image_1 as Image };
        const ImageMatchSettings_1: typeof import("lib/metadata/ImageMatchSettings");
        export { ImageMatchSettings_1 as ImageMatchSettings };
        export const SessionResults: typeof import("lib/metadata/SessionResults");
        export const StartInfo: typeof import("lib/metadata/StartInfo");
    }
    export var ImageRotation: typeof import("lib/positioning/ImageRotation");
    export var RegionProvider: typeof import("lib/positioning/RegionProvider");
    export var NullRegionProvider: typeof import("lib/positioning/NullRegionProvider");
    export var RegionPositionCompensation: typeof import("lib/positioning/RegionPositionCompensation");
    export var NullRegionPositionCompensation: typeof import("lib/positioning/NullRegionPositionCompensation");
    export var FirefoxRegionPositionCompensation: typeof import("lib/positioning/FirefoxRegionPositionCompensation");
    export var SafariRegionPositionCompensation: typeof import("lib/positioning/SafariRegionPositionCompensation");
    export var RegionPositionCompensationFactory: typeof import("lib/positioning/RegionPositionCompensationFactory");
    export var PositionProvider: typeof import("lib/positioning/PositionProvider");
    export var InvalidPositionProvider: typeof import("lib/positioning/InvalidPositionProvider");
    export var ScrollPositionProvider: typeof import("lib/positioning/ScrollPositionProvider");
    export var CssTranslatePositionProvider: typeof import("lib/positioning/CssTranslatePositionProvider");
    export var ScrollElementPositionProvider: typeof import("lib/positioning/ScrollElementPositionProvider");
    export var CssTranslateElementPositionProvider: typeof import("lib/positioning/CssTranslateElementPositionProvider");
    export var PositionMemento: typeof import("lib/positioning/PositionMemento");
    export var RenderInfo: typeof import("lib/renderer/RenderInfo");
    export var RenderRequest: typeof import("lib/renderer/RenderRequest");
    export var RenderStatus: {
        NEED_MORE_RESOURCES: string;
        RENDERING: string;
        RENDERED: string;
        ERROR: string;
    };
    export var RenderStatusResults: typeof import("lib/renderer/RenderStatusResults");
    export var RGridDom: typeof import("lib/renderer/RGridDom");
    export var RGridResource: typeof import("lib/renderer/RGridResource");
    export var RunningRender: typeof import("lib/renderer/RunningRender");
    export var EmulationInfo: typeof import("lib/renderer/EmulationInfo");
    export var EmulationDevice: typeof import("lib/renderer/EmulationDevice");
    export var ContextBasedScaleProvider: typeof import("lib/scaling/ContextBasedScaleProvider");
    export var ContextBasedScaleProviderFactory: typeof import("lib/scaling/ContextBasedScaleProviderFactory");
    export var FixedScaleProvider: typeof import("lib/scaling/FixedScaleProvider");
    export var FixedScaleProviderFactory: typeof import("lib/scaling/FixedScaleProviderFactory");
    export var NullScaleProvider: typeof import("lib/scaling/NullScaleProvider");
    export var ScaleProvider: typeof import("lib/scaling/ScaleProvider");
    export var ScaleProviderFactory: typeof import("lib/scaling/ScaleProviderFactory");
    export var ScaleProviderIdentityFactory: typeof import("lib/scaling/ScaleProviderIdentityFactory");
    export var RenderingInfo: typeof import("lib/server/RenderingInfo");
    export var RunningSession: typeof import("lib/server/RunningSession");
    export var ServerConnector: typeof import("lib/server/ServerConnector");
    export var SessionStartInfo: typeof import("lib/server/SessionStartInfo");
    export var MouseTrigger: typeof import("lib/triggers/MouseTrigger");
    export var TextTrigger: typeof import("lib/triggers/TextTrigger");
    export var Trigger: typeof import("lib/triggers/Trigger");
    export var AppEnvironment: typeof import("lib/AppEnvironment");
    export var EyesBase: typeof import("lib/EyesBase");
    export var EyesClassic: typeof import("lib/EyesClassic");
    export var EyesVisualGrid: typeof import("lib/EyesVisualGrid");
    export var EyesFactory: typeof import("lib/EyesFactory");
    export var EyesJsBrowserUtils: typeof import("lib/EyesJsBrowserUtils");
    export var EyesUtils: {
        getViewportSize: (_logger: import("lib/logging/Logger"), { executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
        }) => import("lib/geometry/RectangleSize");
        setViewportSize: (logger: import("lib/logging/Logger"), { controller, executor, context }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }, requiredViewportSize: import("lib/geometry/RectangleSize")) => Promise<any>;
        getTopContextViewportRect: (logger: import("lib/logging/Logger"), { controller, executor, context }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => import("lib/geometry/Region");
        getTopContextViewportSize: (logger: import("lib/logging/Logger"), { controller, context, executor }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => import("lib/geometry/Region");
        getCurrentFrameContentEntireSize: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => import("lib/geometry/Region");
        getElementEntireSize: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementClientRect: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementRect: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementProperties: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), properties: string[], element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => any[];
        getElementCssProperties: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), properties: string[], element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => string[];
        getDevicePixelRatio: (_logger: import("lib/logging/Logger"), { executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
        }) => Promise<number>;
        getMobilePixelRatio: (_logger: import("lib/logging/Logger"), { controller }: {
            controller: import("lib/wrappers/EyesDriverController");
        }, viewportSize: any) => Promise<number>;
        getTopContextScrollLocation: (logger: import("lib/logging/Logger"), { context, executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => Promise<Location>;
        getScrollLocation: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<Location>;
        scrollTo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<Location>;
        getTransforms: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<Object>;
        setTransforms: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), transforms: Object, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<any>;
        getTranslateLocation: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<Location>;
        translateTo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<Location>;
        isScrollable: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<boolean>;
        getScrollRootElement: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => Promise<import("lib/wrappers/EyesWrappedElement").UnwrappedElement>;
        markScrollRootElement: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<any>;
        getOverflow: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string | null>;
        setOverflow: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), overflow: any, element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string | null>;
        blurElement: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement") | undefined) => Promise<import("lib/wrappers/EyesWrappedElement").UnwrappedElement | null>;
        focusElement: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<any>;
        getElementXpath: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        getElementAbsoluteXpath: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        locatorToPersistedRegions: (logger: import("lib/logging/Logger"), { finder, executor }: {
            finder: import("lib/wrappers/EyesElementFinder");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => Promise<{
            type: string;
            selector: string;
        }[]>;
        ensureRegionVisible: (logger: import("lib/logging/Logger"), { controller, context, executor }: {
            controller: import("lib/wrappers/EyesDriverController");
            context: import("lib/wrappers/EyesBrowsingContext");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, positionProvider: import("lib/positioning/PositionProvider"), region: Promise<import("lib/geometry/Region")>) => Promise<Location | import("lib/geometry/Location") | undefined>;
        ensureFrameVisible: (_logger: import("lib/logging/Logger"), context: import("lib/wrappers/EyesBrowsingContext"), positionProvider: import("lib/positioning/PositionProvider"), offset?: Location | undefined) => Promise<Location>;
        getCurrentContextInfo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => Promise<import("lib/EyesUtils").ContextInfo>;
        getFrameByNameOrId: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), nameOrId: string) => import("lib/wrappers/EyesWrappedElement").UnwrappedElement;
        findFrameByContext: (_logger: import("lib/logging/Logger"), { executor, context }: {
            context: import("lib/wrappers/EyesBrowsingContext");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, contextInfo: import("lib/EyesUtils").ContextInfo, comparator: (left: import("lib/wrappers/EyesWrappedElement").UnwrappedElement, right: import("lib/wrappers/EyesWrappedElement").UnwrappedElement) => Promise<boolean>) => Promise<any>;
    };
    export var FailureReports: typeof import("lib/FailureReports");
    export var MatchSingleWindowTask: typeof import("lib/MatchSingleWindowTask");
    export var MatchWindowTask: typeof import("lib/MatchWindowTask");
    export var RenderWindowTask: typeof import("lib/RenderWindowTask");
    export var TestResults: typeof import("lib/TestResults");
    export var AccessibilityStatus: typeof import("lib/AccessibilityStatus");
    export var TestResultsFormatter: typeof import("lib/TestResultsFormatter");
    export var TestResultsStatus: Readonly<{
        Passed: string;
        Unresolved: string;
        Failed: string;
    }>;
    export var FrameChain: typeof import("lib/frames/FrameChain");
    export var Frame: typeof import("lib/frames/Frame");
    export var EyesWrappedDriver: typeof import("lib/wrappers/EyesWrappedDriver");
    export var EyesWrappedElement: typeof import("lib/wrappers/EyesWrappedElement");
    export var EyesJsExecutor: typeof import("lib/wrappers/EyesJsExecutor");
    export var EyesElementFinder: typeof import("lib/wrappers/EyesElementFinder");
    export var EyesBrowsingContext: typeof import("lib/wrappers/EyesBrowsingContext");
    export var EyesRunner: typeof import("lib/runner/EyesRunner");
    export var ClassicRunner: typeof import("lib/runner/ClassicRunner");
    export var VisualGridRunner: typeof import("lib/runner/VisualGridRunner");
    export var TestResultContainer: typeof import("lib/runner/TestResultContainer");
    export var TestResultsSummary: typeof import("lib/runner/TestResultsSummary");
}
