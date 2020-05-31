declare module "src/selenium3/SpecWrappedElement" {
    export type ByHash = {
        className: string;
    } | {
        css: string;
    } | {
        id: string;
    } | {
        js: string;
    } | {
        linkText: string;
    } | {
        name: string;
    } | {
        partialLinkText: string;
    } | {
        tagName: string;
    } | {
        xpath: string;
    };
    export type By = import("selenium-webdriver").By;
    /**
     * Supported selector type
     */
    export type SupportedSelector = import("selenium-webdriver").By | {
        className: string;
    } | {
        css: string;
    } | {
        id: string;
    } | {
        js: string;
    } | {
        linkText: string;
    } | {
        name: string;
    } | {
        partialLinkText: string;
    } | {
        tagName: string;
    } | {
        xpath: string;
    };
    /**
     * Compatible element type
     */
    export type SupportedElement = import("selenium-webdriver").WebElement;
    /**
     * Unwrapped element supported by framework
     */
    export type UnwrappedElement = import("selenium-webdriver").WebElement;
    export function isCompatible(element: any): boolean;
    export function isCompatible(element: any): boolean;
    export function isSelector(selector: any): any;
    export function isSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toEyesSelector(selector: any): {
        type: string;
        selector: any;
    } | {
        selector: any;
        type?: undefined;
    };
    export function toEyesSelector(selector: any): {
        type: string;
        selector: any;
    } | {
        selector: any;
        type?: undefined;
    };
    export function extractId(element: any): any;
    export function extractId(element: any): any;
    export function isStaleElementReferenceResult(result: any): boolean;
    export function isStaleElementReferenceResult(result: any): boolean;
}
declare module "src/selenium4/SpecWrappedElement" {
    export type ByHash = {
        className: string;
    } | {
        css: string;
    } | {
        id: string;
    } | {
        js: string;
    } | {
        linkText: string;
    } | {
        name: string;
    } | {
        partialLinkText: string;
    } | {
        tagName: string;
    } | {
        xpath: string;
    };
    export type By = import("selenium-webdriver").By;
    /**
     * Supported selector type
     */
    export type SupportedSelector = import("selenium-webdriver").By | {
        className: string;
    } | {
        css: string;
    } | {
        id: string;
    } | {
        js: string;
    } | {
        linkText: string;
    } | {
        name: string;
    } | {
        partialLinkText: string;
    } | {
        tagName: string;
    } | {
        xpath: string;
    };
    /**
     * Compatible element type
     */
    export type SupportedElement = import("selenium-webdriver").WebElement;
    /**
     * Unwrapped element supported by framework
     */
    export type UnwrappedElement = import("selenium-webdriver").WebElement;
    export function isCompatible(element: any): boolean;
    export function isCompatible(element: any): boolean;
    export function isSelector(selector: any): any;
    export function isSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toEyesSelector(selector: any): {
        type: string;
        selector: any;
    } | {
        selector: any;
        type?: undefined;
    };
    export function toEyesSelector(selector: any): {
        type: string;
        selector: any;
    } | {
        selector: any;
        type?: undefined;
    };
    export function extractId(element: any): any;
    export function extractId(element: any): any;
    export function isStaleElementReferenceResult(result: any): boolean;
    export function isStaleElementReferenceResult(result: any): boolean;
}
declare module "src/SeleniumWrappedElement" {
    export = SeleniumWrappedElement;
    const SeleniumWrappedElement: any;
}
declare module "src/SeleniumFrame" {
    const _exports: any;
    export = _exports;
}
declare module "src/SeleniumCheckSettings" {
    const _exports: any;
    export = _exports;
}
declare module "src/LegacyWrappedDriver" {
    export = LegacyAPIDriver;
    function LegacyAPIDriver(EyesWrappedDriver: any): {
        new (): {
            [x: string]: any;
            getRemoteWebDriver(): any;
            findElementById(id: any): Promise<any>;
            findElementsById(id: any): Promise<any>;
            findElementByName(name: any): Promise<any>;
            findElementsByName(name: any): Promise<any>;
            findElementByCssSelector(cssSelector: any): Promise<any>;
            findElementsByCssSelector(cssSelector: any): Promise<any>;
            findElementByClassName(className: any): Promise<void>;
            findElementsByClassName(className: any): Promise<void>;
            findElementByLinkText(linkText: any): Promise<void>;
            findElementsByLinkText(linkText: any): Promise<void>;
            findElementByPartialLinkText(partialLinkText: any): Promise<void>;
            findElementsByPartialLinkText(partialLinkText: any): Promise<void>;
            findElementByTagName(tagName: any): Promise<any>;
            findElementsByTagName(tagName: any): Promise<any>;
            findElementByXPath(xpath: any): Promise<any>;
            findElementsByXPath(xpath: any): Promise<any>;
            isMobile(): Promise<any>;
            isNotMobile(): Promise<boolean>;
            getUserAgent(): Promise<any>;
            getSessionId(): Promise<any>;
            getFrameChain(): any;
            getBrowserName(): Promise<any>;
            getBrowserVersion(): Promise<any>;
        };
        [x: string]: any;
    };
}
declare module "src/selenium3/SpecWrappedDriver" {
    export function isEqualFrames(leftFrame: any, rightFrame: any): any;
    export function isEqualFrames(leftFrame: any, rightFrame: any): any;
    export function createFrameReference(reference: any): any;
    export function createFrameReference(reference: any): any;
    export function createElement(logger: any, driver: any, element: any, selector: any): any;
    export function createElement(logger: any, driver: any, element: any, selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toEyesSelector(selector: any): any;
    export function toEyesSelector(selector: any): any;
    export function prepareDriver(driver: any): any;
    export function prepareDriver(driver: any): any;
    export function executeScript(driver: any, script: any, ...args: any[]): any;
    export function executeScript(driver: any, script: any, ...args: any[]): any;
    export function sleep(driver: any, ms: any): any;
    export function sleep(driver: any, ms: any): any;
    export function switchToFrame(driver: any, reference: any): any;
    export function switchToFrame(driver: any, reference: any): any;
    export function switchToParentFrame(driver: any): any;
    export function switchToParentFrame(driver: any): any;
    export function findElement(driver: any, selector: any): Promise<any>;
    export function findElement(driver: any, selector: any): Promise<any>;
    export function findElements(driver: any, selector: any): Promise<any>;
    export function findElements(driver: any, selector: any): Promise<any>;
    export function getWindowLocation(driver: any): Promise<{
        x: any;
        y: any;
    }>;
    export function getWindowLocation(driver: any): Promise<{
        x: any;
        y: any;
    }>;
    export function setWindowLocation(driver: any, location: any): Promise<void>;
    export function setWindowLocation(driver: any, location: any): Promise<void>;
    export function getWindowSize(driver: any): Promise<{
        width: any;
        height: any;
    }>;
    export function getWindowSize(driver: any): Promise<{
        width: any;
        height: any;
    }>;
    export function setWindowSize(driver: any, size: any): Promise<void>;
    export function setWindowSize(driver: any, size: any): Promise<void>;
    export function getOrientation(driver: any): Promise<any>;
    export function getOrientation(driver: any): Promise<any>;
    export function isMobile(driver: any): Promise<boolean>;
    export function isMobile(driver: any): Promise<boolean>;
    export function isAndroid(driver: any): Promise<boolean>;
    export function isAndroid(driver: any): Promise<boolean>;
    export function isIOS(driver: any): Promise<boolean>;
    export function isIOS(driver: any): Promise<boolean>;
    export function isNative(driver: any): Promise<boolean>;
    export function isNative(driver: any): Promise<boolean>;
    export function getPlatformVersion(driver: any): Promise<any>;
    export function getPlatformVersion(driver: any): Promise<any>;
    export function getSessionId(driver: any): Promise<any>;
    export function getSessionId(driver: any): Promise<any>;
    export function takeScreenshot(driver: any): Promise<any>;
    export function takeScreenshot(driver: any): Promise<any>;
    export function getTitle(driver: any): Promise<any>;
    export function getTitle(driver: any): Promise<any>;
    export function getUrl(driver: any): Promise<any>;
    export function getUrl(driver: any): Promise<any>;
    export function visit(driver: any, url: any): Promise<any>;
    export function visit(driver: any, url: any): Promise<any>;
}
declare module "src/selenium4/SpecWrappedDriver" {
    export function isEqualFrames(leftFrame: any, rightFrame: any): any;
    export function isEqualFrames(leftFrame: any, rightFrame: any): any;
    export function createFrameReference(reference: any): any;
    export function createFrameReference(reference: any): any;
    export function createElement(logger: any, driver: any, element: any, selector: any): any;
    export function createElement(logger: any, driver: any, element: any, selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toSupportedSelector(selector: any): any;
    export function toEyesSelector(selector: any): any;
    export function toEyesSelector(selector: any): any;
    export function executeScript(driver: any, script: any, ...args: any[]): Promise<any>;
    export function executeScript(driver: any, script: any, ...args: any[]): Promise<any>;
    export function sleep(driver: any, ms: any): any;
    export function sleep(driver: any, ms: any): any;
    export function switchToFrame(driver: any, reference: any): any;
    export function switchToFrame(driver: any, reference: any): any;
    export function switchToParentFrame(driver: any): any;
    export function switchToParentFrame(driver: any): any;
    export function findElement(driver: any, selector: any): Promise<any>;
    export function findElement(driver: any, selector: any): Promise<any>;
    export function findElements(driver: any, selector: any): Promise<any>;
    export function findElements(driver: any, selector: any): Promise<any>;
    export function getWindowLocation(driver: any): Promise<{
        x: any;
        y: any;
    }>;
    export function getWindowLocation(driver: any): Promise<{
        x: any;
        y: any;
    }>;
    export function setWindowLocation(driver: any, location: any): Promise<void>;
    export function setWindowLocation(driver: any, location: any): Promise<void>;
    export function getWindowSize(driver: any): Promise<any>;
    export function getWindowSize(driver: any): Promise<any>;
    export function setWindowSize(driver: any, size: any): Promise<void>;
    export function setWindowSize(driver: any, size: any): Promise<void>;
    export function getOrientation(driver: any): Promise<any>;
    export function getOrientation(driver: any): Promise<any>;
    export function isMobile(driver: any): Promise<boolean>;
    export function isMobile(driver: any): Promise<boolean>;
    export function isAndroid(driver: any): Promise<boolean>;
    export function isAndroid(driver: any): Promise<boolean>;
    export function isIOS(driver: any): Promise<boolean>;
    export function isIOS(driver: any): Promise<boolean>;
    export function isNative(driver: any): Promise<boolean>;
    export function isNative(driver: any): Promise<boolean>;
    export function getPlatformVersion(driver: any): Promise<any>;
    export function getPlatformVersion(driver: any): Promise<any>;
    export function getSessionId(driver: any): Promise<any>;
    export function getSessionId(driver: any): Promise<any>;
    export function takeScreenshot(driver: any): Promise<any>;
    export function takeScreenshot(driver: any): Promise<any>;
    export function getTitle(driver: any): Promise<any>;
    export function getTitle(driver: any): Promise<any>;
    export function getUrl(driver: any): Promise<any>;
    export function getUrl(driver: any): Promise<any>;
    export function visit(driver: any, url: any): Promise<any>;
    export function visit(driver: any, url: any): Promise<any>;
}
declare module "src/SeleniumWrappedDriver" {
    const _exports: {
        new (): {
            [x: string]: any;
            getRemoteWebDriver(): any;
            findElementById(id: any): Promise<any>;
            findElementsById(id: any): Promise<any>;
            findElementByName(name: any): Promise<any>;
            findElementsByName(name: any): Promise<any>;
            findElementByCssSelector(cssSelector: any): Promise<any>;
            findElementsByCssSelector(cssSelector: any): Promise<any>;
            findElementByClassName(className: any): Promise<void>;
            findElementsByClassName(className: any): Promise<void>;
            findElementByLinkText(linkText: any): Promise<void>;
            findElementsByLinkText(linkText: any): Promise<void>;
            findElementByPartialLinkText(partialLinkText: any): Promise<void>;
            findElementsByPartialLinkText(partialLinkText: any): Promise<void>;
            findElementByTagName(tagName: any): Promise<any>;
            findElementsByTagName(tagName: any): Promise<any>;
            findElementByXPath(xpath: any): Promise<any>;
            findElementsByXPath(xpath: any): Promise<any>;
            isMobile(): Promise<any>;
            isNotMobile(): Promise<boolean>;
            getUserAgent(): Promise<any>;
            getSessionId(): Promise<any>;
            getFrameChain(): any;
            getBrowserName(): Promise<any>;
            getBrowserVersion(): Promise<any>;
        };
        [x: string]: any;
    };
    export = _exports;
}
declare module "src/SeleniumSpecializedEyes" {
    type EyesClassic = typeof import('@applitools/eyes-sdk-core')
    export const SeleniumEyesClassic: any;
    export const SeleniumEyesVisualGrid: any;
    export const SeleniumEyesFactory: any;
}
declare module "index" {
    export var Eyes: any;
    export var EyesSelenium: any;
    export var EyesVisualGrid: any;
    export var Target: any;
    export var SeleniumCheckSettings: any;
    export var AccessibilityLevel: any;
    export var AccessibilityGuidelinesVersion: any;
    export var AccessibilityMatchSettings: any;
    export var AccessibilityRegionType: any;
    export var BatchInfo: any;
    export var BrowserType: any;
    export var Configuration: any;
    export var DeviceName: any;
    export var ExactMatchSettings: any;
    export var FloatingMatchSettings: any;
    export var ImageMatchSettings: any;
    export var MatchLevel: any;
    export var PropertyData: any;
    export var ProxySettings: any;
    export var ScreenOrientation: any;
    export var StitchMode: any;
    export var DebugScreenshotsProvider: any;
    export var FileDebugScreenshotsProvider: any;
    export var NullDebugScreenshotProvider: any;
    export var EyesError: any;
    export var CoordinatesType: any;
    export var Location: any;
    export var RectangleSize: any;
    export var Region: any;
    export var PropertyHandler: any;
    export var ReadOnlyPropertyHandler: any;
    export var SimplePropertyHandler: any;
    export var ImageDeltaCompressor: any;
    export var MutableImage: any;
    export var ConsoleLogHandler: any;
    export var DebugLogHandler: any;
    export var FileLogHandler: any;
    export var Logger: any;
    export var LogHandler: any;
    export var NullLogHandler: any;
    export var ImageProvider: any;
    export var FullPageCaptureAlgorithm: any;
    export var EyesSimpleScreenshotFactory: any;
    export var CorsIframeHandle: any;
    export var CutProvider: any;
    export var FixedCutProvider: any;
    export var NullCutProvider: any;
    export var UnscaledFixedCutProvider: any;
    export var ScaleProvider: any;
    export var FixedScaleProvider: any;
    export var FixedScaleProviderFactory: any;
    export var PositionMemento: any;
    export var PositionProvider: any;
    export var RemoteSessionEventHandler: any;
    export var SessionEventHandler: any;
    export var ValidationInfo: any;
    export var ValidationResult: any;
    export var CoordinatesTypeConversionError: any;
    export var DiffsFoundError: any;
    export var NewTestError: any;
    export var OutOfBoundsError: any;
    export var TestFailedError: any;
    export var MatchResult: any;
    export var NullRegionProvider: any;
    export var RegionProvider: any;
    export var RunningSession: any;
    export var SessionType: any;
    export var FailureReports: any;
    export var TestResults: any;
    export var TestResultsFormatter: any;
    export var TestResultsStatus: any;
    export var TestResultContainer: any;
    export var TestResultsSummary: any;
    export var ClassicRunner: any;
    export var VisualGridRunner: any;
}
