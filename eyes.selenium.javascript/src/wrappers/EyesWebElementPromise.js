'use strict';

const {WebElement} = require('selenium-webdriver');
const {CancellableThenable} = require('selenium-webdriver/lib/promise');

const EyesWebElement = require('./EyesWebElement');

/**
 * EyesWebElementPromise is a promise that will be fulfilled with a WebElement.
 * This serves as a forward proxy on WebElement, allowing calls to be scheduled without directly on this instance before the underlying WebElement has been fulfilled.
 * In other words, the following two statements are equivalent:
 *
 *     driver.findElement({id: 'my-button'}).click();
 *     driver.findElement({id: 'my-button'}).then(function(el) {
 *       return el.click();
 *     });
 *
 * @implements {CancellableThenable<!EyesWebElement>}
 * @final
 */
class EyesWebElementPromise extends EyesWebElement {

    /**
     * @param {Logger} logger
     * @param {!EyesWebDriver} driver The parent WebDriver instance for this element.
     * @param {!promise.Thenable<!WebElement>} el A promise that will resolve to the promised element.
     */
    constructor(logger, driver, el) {
        const webElement = new WebElement(driver.getRemoteWebDriver(), 'unused');

        /**
         * Defers returning the element ID until the wrapped WebElement has been resolved.
         * @override
         */
        webElement.getId = function() {
            return el.then(function(el) {
                return el.getId();
            });
        };

        super(logger, driver, webElement);

        /**
         * Cancel operation is only supported if the wrapped thenable is also cancellable.
         * @param {(string|Error)=} opt_reason
         * @override
         */
        this.cancel = function(opt_reason) {
            if (CancellableThenable.isImplementation(el)) {
                /** @type {!CancellableThenable} */(el).cancel(opt_reason);
            }
        };

        /** @override */
        this.then = el.then.bind(el);

        /** @override */
        this.catch = el.catch.bind(el);

        // For Remote web elements, we can keep the IDs, for Id based lookup (mainly used for Javascript related activities).
        driver._elementsIds.put(el, this);
    }
}

CancellableThenable.addImplementation(EyesWebElementPromise);

module.exports = EyesWebElementPromise;