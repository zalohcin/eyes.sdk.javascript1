'use strict';

const {WebElement} = require('selenium-webdriver');
const {Region, MouseTrigger, ArgumentGuard} = require('eyes.sdk');

const JS_GET_SCROLL_LEFT = "return arguments[0].scrollLeft;";

const JS_GET_SCROLL_TOP = "return arguments[0].scrollTop;";

const JS_GET_SCROLL_WIDTH = "return arguments[0].scrollWidth;";

const JS_GET_SCROLL_HEIGHT = "return arguments[0].scrollHeight;";

const JS_GET_OVERFLOW = "return arguments[0].style.overflow;";

const JS_GET_LOCATION = "var rect = arguments[0].getBoundingClientRect(); return [rect.left, rect.top]";

const JS_GET_CLIENT_WIDTH = "return arguments[0].clientWidth;";
const JS_GET_CLIENT_HEIGHT = "return arguments[0].clientHeight;";

/**
 * @param {String} styleProp
 * @return {String}
 */
const JS_GET_COMPUTED_STYLE_FORMATTED_STR = (styleProp) => {
    return "var elem = arguments[0], styleProp = '"+ styleProp +"'; " +
        "if (window.getComputedStyle) { " +
        "   return window.getComputedStyle(elem, null).getPropertyValue(styleProp);" +
        "} else if (elem.currentStyle) { " +
        "   return elem.currentStyle[styleProp];" +
        "} else { " +
        "   return null;" +
        "}";
};

/**
 * @param {int} scrollLeft
 * @param {int} scrollTop
 * @return {String}
 */
const JS_SCROLL_TO_FORMATTED_STR = (scrollLeft, scrollTop) => {
    return "arguments[0].scrollLeft = " + scrollLeft + "; " +
        "arguments[0].scrollTop = " + scrollTop + ";";
};

/**
 * @param {String} overflow
 * @return {String}
 */
const JS_SET_OVERFLOW_FORMATTED_STR = (overflow) => {
    return "arguments[0].style.overflow = '" + overflow + "'";
};

/**
 * Wraps a Selenium Web Element.
 */
class EyesWebElement extends WebElement {

    /**
     * @param {Logger} logger
     * @param {EyesWebDriver} eyesDriver
     * @param {WebElement} webElement
     *
     **/
    constructor(logger, eyesDriver, webElement) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(eyesDriver, "eyesDriver");
        ArgumentGuard.notNull(webElement, "webElement");

        // noinspection JSCheckFunctionSignatures
        super(eyesDriver.getRemoteWebDriver(), webElement.getId());

        this._logger = logger;
        this._eyesDriver = eyesDriver;
        this._webElement = webElement;
    }

    /**
     * @return {Promise.<Region>}
     */
    getBounds() {
        const that = this;
        return that._webElement.getLocation().then(/** @type {{x: number, y: number}} */ location_ => {
            let left = location_.x;
            let top = location_.y;
            let width = 0;
            let height = 0;

            return that._webElement.getSize().then(/** @type {{width: number, height: number}} */ size_ => {
                width = size_.width;
                height = size_.height;
            }).catch(err => {
                // Not supported on all platforms.
            }).then(() => {
                if (left < 0) {
                    width = Math.max(0, width + left);
                    left = 0;
                }

                if (top < 0) {
                    height = Math.max(0, height + top);
                    top = 0;
                }

                return new Region(left, top, width, height);
            });
        });
    }

    /**
     * Returns the computed value of the style property for the current element.
     *
     * @param {String} propStyle The style property which value we would like to extract.
     * @return {Promise.<String>} The value of the style property of the element, or {@code null}.
     */
    getComputedStyle(propStyle) {
        return this._eyesDriver.executeScript(JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle), this._webElement);
    }

    /**
     * @param {String} propStyle The style property which value we would like to extract.
     * @return {Promise.<int>} The integer value of a computed style.
     */
    getComputedStyleInteger(propStyle) {
        return this.getComputedStyle(propStyle).then(result => Math.round(parseFloat(result.trim().replace("px", ""))));
    }

    /**
     * @return {Promise.<int>} The value of the scrollLeft property of the element.
     */
    getScrollLeft() {
        return this._eyesDriver.executeScript(JS_GET_SCROLL_LEFT, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    /**
     * @return {Promise.<int>} The value of the scrollTop property of the element.
     */
    getScrollTop() {
        return this._eyesDriver.executeScript(JS_GET_SCROLL_TOP, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    /**
     * @return {Promise.<int>} The value of the scrollWidth property of the element.
     */
    getScrollWidth() {
        return this._eyesDriver.executeScript(JS_GET_SCROLL_WIDTH, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    /**
     * @return {Promise.<int>} The value of the scrollHeight property of the element.
     */
    getScrollHeight() {
        return this._eyesDriver.executeScript(JS_GET_SCROLL_HEIGHT, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    /**
     * @return {Promise.<int>}
     */
    getClientWidth() {
        return this._eyesDriver.executeScript(JS_GET_CLIENT_WIDTH, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    /**
     * @return {Promise.<int>}
     */
    getClientHeight() {
        return this._eyesDriver.executeScript(JS_GET_CLIENT_HEIGHT, this._webElement).then(result => Math.ceil(parseFloat(result)));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise.<int>} The width of the left border.
     */
    getBorderLeftWidth() {
        return this.getComputedStyleInteger("border-left-width");
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise.<int>} The width of the right border.
     */
    getBorderRightWidth() {
        return this.getComputedStyleInteger("border-right-width");
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise.<int>} The width of the top border.
     */
    getBorderTopWidth() {
        return this.getComputedStyleInteger("border-top-width");
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise.<int>} The width of the bottom border.
     */
    getBorderBottomWidth() {
        return this.getComputedStyleInteger("border-bottom-width");
    }

    /**
     * Scrolls to the specified location inside the element.
     *
     * @param {Location} location The location to scroll to.
     * @return {Promise}
     */
    scrollTo(location) {
        return this._eyesDriver.executeScript(JS_SCROLL_TO_FORMATTED_STR(location.getX(), location.getY()), this._webElement);
    }

    /**
     * @return {Promise.<String>} The overflow of the element.
     */
    getOverflow() {
        return this._eyesDriver.executeScript(JS_GET_OVERFLOW, this._webElement);
    }

    /**
     * @param {String} overflow The overflow to set
     * @return {Promise} The overflow of the element.
     */
    setOverflow(overflow) {
        return this._eyesDriver.executeScript(JS_SET_OVERFLOW_FORMATTED_STR(overflow), this._webElement);
    }

    /**
     * @Override
     * @inheritDoc
     */
    getDriver() {
        return this._webElement.getDriver();
    }

    /**
     * @Override
     * @return {promise.Thenable.<string>}
     */
    getId() {
        return this._webElement.getId();
    }

    /**
     * @Override
     * @inheritDoc
     */
    findElement(locator) {
        const that = this;
        return this._webElement.findElement(locator).then(element => new EyesWebElement(that._logger, that._eyesDriver, element));
    }

    /**
     * @Override
     * @inheritDoc
     */
    findElements(locator) {
        const that = this;
        return this._webElement.findElements(locator).then(elements => elements.map(element => new EyesWebElement(that._logger, that._eyesDriver, element)));
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * @Override
     * @inheritDoc
     * @return {Promise}
     */
    click() {
        // Letting the driver know about the current action.
        const that = this;
        return that.getBounds().then(currentControl => {
            that._eyesDriver.getEyes().addMouseTrigger(MouseTrigger.MouseAction.Click, this);
            that._logger.verbose(`click(${currentControl})`);

            return that._webElement.click();
        });
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * @Override
     * @inheritDoc
     */
    sendKeys(...keysToSend) {
        const that = this;
        return keysToSend.reduce((promise, keys) => {
            return promise.then(() => that._eyesDriver.getEyes().addTextTriggerForElement(this._webElement, String(keys)));
        }, that._eyesDriver.getPromiseFactory().resolve()).then(() => {
            return that._webElement.sendKeys(...keysToSend);
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getTagName() {
        return this._webElement.getTagName();
    }

    /**
     * @override
     * @inheritDoc
     */
    getCssValue(cssStyleProperty) {
        return this._webElement.getCssValue(cssStyleProperty);
    }

    /**
     * @override
     * @inheritDoc
     */
    getAttribute(attributeName) {
        return this._webElement.getAttribute(attributeName);
    }

    /**
     * @override
     * @inheritDoc
     */
    getText() {
        return this._webElement.getText();
    }

    /**
     * @override
     * @inheritDoc
     */
    getSize() {
        return this._webElement.getSize();
    }

    /**
     * @override
     * @inheritDoc
     */
    getLocation() {
        // The workaround is similar to Java one,
        // https://github.com/applitools/eyes.sdk.java3/blob/master/eyes.selenium.java/src/main/java/com/applitools/eyes/selenium/EyesRemoteWebElement.java#L453
        // but we can't get raw data (including decimal values) from remote Selenium webdriver
        // and therefore we should use our own client-side script for retrieving exact values and rounding up them

        // return this._webElement.getLocation();
        return this._eyesDriver.executeScript(JS_GET_LOCATION, this._webElement).then(value => {
            const x = Math.ceil(value[0]) || 0;
            const y = Math.ceil(value[1]) || 0;
            return {x, y};
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    isEnabled() {
        return this._webElement.isEnabled();
    }

    /**
     * @override
     * @inheritDoc
     */
    isSelected() {
        return this._webElement.isSelected();
    }

    /**
     * @override
     * @inheritDoc
     */
    submit() {
        return this._webElement.submit();
    }

    /**
     * @override
     * @inheritDoc
     */
    clear() {
        return this._webElement.clear();
    }

    /**
     * @override
     * @inheritDoc
     */
    isDisplayed() {
        return this._webElement.isDisplayed();
    }

    /**
     * @override
     * @inheritDoc
     */
    takeScreenshot(opt_scroll) {
        return this._webElement.takeScreenshot(opt_scroll);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {EyesWebDriver}
     */
    getRemoteWebDriver() {
        return this._eyesDriver;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {WebElement} The original element object
     */
    getRemoteWebElement() {
        return this._webElement;
    }
}

module.exports = EyesWebElement;

