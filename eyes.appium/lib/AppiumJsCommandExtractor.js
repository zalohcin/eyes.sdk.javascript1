'use strict';

const { MouseTrigger, Location, Region } = require('@applitools/eyes.sdk.core');

const COMMAND_PREFIX = 'mobile: ';
const TAP_COMMAND = `${COMMAND_PREFIX}tap`;
const APPIUM_COORDINATES_DEFAULT = 0.5;
const APPIUM_TAP_COUNT_DEFAULT = 1;

class AppiumJsCommandExtractor {
  /**
   * Used for identifying if a javascript script is a command to Appium.
   *
   * @param {String} script The script to test whether it's an Appium command.
   * @return {boolean} True if the script is an Appium command, false otherwise.
   */
  static isAppiumJsCommand(script) {
    return script.startsWith(COMMAND_PREFIX);
  }

  /**
   * Given a command and its parameters, returns the equivalent trigger.
   *
   * @param {Map<String, EyesWebElement>} elementsIds A mapping of known elements' IDs to elements.
   * @param {{width: number, height: number}} viewportSize The dimensions of the current viewport
   * @param {PromiseFactory} promiseFactory
   * @param {String} script The Appium command from which the trigger would be extracted
   * @param {Object...} args The trigger's parameters.
   * @return {Promise.<Trigger>} The trigger which represents the given command.
   */
  static extractTrigger(elementsIds, viewportSize, promiseFactory, script, ...args) {
    if (script === TAP_COMMAND) {
      if (args.length !== 1) {
        // We don't know what the rest of the parameters are, so...
        return promiseFactory.resolve(null);
      }

      /** @type {Map<String, String>} */
      let tapObject = new Map();

      /** @type {int} */
      let tapCount;
      /** @type {String} */
      let xObj, yObj, tapCountObj;

      try {
        tapObject = args[0]; // eslint-disable-line prefer-destructuring
        xObj = tapObject.get('x');
        yObj = tapObject.get('y');
        tapCountObj = tapObject.get('tapCount');
      } catch (ignore) {
        // We only know how to handle Map as the arguments container.
        return promiseFactory.resolve(null);
      }

      let x = xObj ? Number(xObj) : APPIUM_COORDINATES_DEFAULT;
      let y = yObj ? Number(yObj) : APPIUM_COORDINATES_DEFAULT;

      // If an element is referenced, then the coordinates are relative to the element.
      /** @type {EyesWebElement} */
      let referencedElement;
      const elementId = tapObject.get('element');
      return promiseFactory.resolve()
        .then(() => {
          if (elementId) {
            referencedElement = elementsIds.get(elementId);

            // If an element was referenced, but we don't have it's ID,
            // we can't create the trigger.
            if (referencedElement === null) {
              return null;
            }

            return referencedElement.getLocation()
              .then(elementPosition => referencedElement.getSize()
                .then(elementSize => {
                  // If coordinates are percentage of the size of the viewport/element.
                  if (x < 1) {
                    x *= elementSize.width;
                  }
                  if (y < 1) {
                    y *= elementSize.height;
                  }

                  return new Region(Math.ceil(elementPosition.x), Math.ceil(elementPosition.y), elementSize.width, elementSize.height);
                }));
          }

          // If coordinates are percentage of the size of the viewport/element.
          if (x < 1) {
            x *= viewportSize.width;
          }
          if (y < 1) {
            y *= viewportSize.height;
          }

          // creating a fake control, for which the tap is at the right bottom corner
          return new Region(0, 0, Math.round(x), Math.round(y));
        })
        .then(control => {
          if (!control) {
            return null;
          }

          const location = new Location(Math.round(x), Math.round(y));

          // Deciding whether this is click/double click.
          tapCount = tapCountObj ? Number(tapCountObj) : APPIUM_TAP_COUNT_DEFAULT;
          const action = (tapCount === 1) ? MouseTrigger.MouseAction.Click : MouseTrigger.MouseAction.DoubleClick;
          return new MouseTrigger(action, control, location);
        });
    }

    // No trigger from the given command.
    return promiseFactory.resolve(null);
  }
}

exports.AppiumJsCommandExtractor = AppiumJsCommandExtractor;
