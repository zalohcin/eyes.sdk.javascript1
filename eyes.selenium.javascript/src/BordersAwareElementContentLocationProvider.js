'use strict';

const {ArgumentGuard, Location} = require('eyes.sdk');

const EyesWebElement = require('./wrappers/EyesWebElement');

/**
 * Encapsulates an algorithm to find an element's content location, based on the element's location.
 */
class BordersAwareElementContentLocationProvider {

    /**
     * Returns a location based on the given location.
     *
     * @param {Logger} logger The logger to use.
     * @param {EyesWebElement} element The element for which we want to find the content's location.
     * @param {Location} location The location of the element.
     * @return {Promise.<Location>} The location of the content of the element.
     */
    getLocation(logger, element, location) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(element, "element");
        ArgumentGuard.notNull(location, "location");

        logger.verbose(`BordersAdditionFrameLocationProvider(logger, element, ${location})`);

        // Frame borders also have effect on the frame's location.
        return _getBorderWidth(logger, 'left', element).then(leftBorderWidth => {
            return _getBorderWidth(logger, 'top', element).then(topBorderWidth => {
                const contentLocation = new Location(location).offset(leftBorderWidth, topBorderWidth);
                logger.verbose("Done!");
                return contentLocation;
            });
        });
    };
}

/**
 * Return width of left border
 *
 * @private
 * @param {Logger} logger
 * @param {String} border
 * @param {WebElement|EyesWebElement} element
 * @return {Promise.<Number>}
 */
function _getBorderWidth(logger, border, element) {
    logger.verbose(`Get element border ${border} width...`);
    const borderStyle = `border-${border}-width`;

    let promise;
    if (element instanceof EyesWebElement) {
        logger.verbose("Element is an EyesWebElement, using 'getComputedStyle'.");
        promise = element.getComputedStyle(borderStyle).catch(err => {
            logger.verbose(`Using getComputedStyle failed: ${err}`);
            logger.verbose("Using getCssValue...");
            return element.getCssValue(borderStyle);
        }).then(result => {
            logger.verbose("Done!");
            return result;
        });
    } else {
        // OK, this is weird, we got an element which is not EyesWebElement?? Log it and try to move on.
        logger.verbose(`Element is not an EyesWebElement! (when trying to get ${borderStyle}) Element's class: ${element.constructor.name}`);
        logger.verbose("Using getCssValue...");
        promise = element.getCssValue(borderStyle).then(result => {
            logger.verbose("Done!");
            return result;
        });
    }

    return promise.catch(err => {
        logger.verbose(`Couldn't get the element's ${borderStyle}: ${err}.  Falling back to default`);
        return 0;
    }).then(result => {
        // Convert border value from the format "2px" to int.
        const borderWidth = Math.round(parseFloat(result.trim().replace("px", "")));
        logger.verbose(`${borderStyle}: ${borderWidth}`);
        return borderWidth;
    });
}

module.exports = BordersAwareElementContentLocationProvider;
