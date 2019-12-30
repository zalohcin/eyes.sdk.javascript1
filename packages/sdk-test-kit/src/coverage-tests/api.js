/*
 * check command assumptions:
 * - The fluent API is used by default
 * - locators are specified with CSS selectors
 * - When performing a checkWindow, just the viewport is captured unless otherwise specified
 */

/* eslint-disable no-unused-vars */
function abort() {}

// target:
// - string (css selector)
// - Array of css selectors
// options:
// - isClassicApi (boolean)
// - isFully (boolean)
function checkFrame(target, options) {}

// target:
// - string (css selector)
// - Array of css selectors
// - object of coordinates -- e.g., { left: n, top: n, width: n, height: n }
// options:
// - isClassicApi (boolean)
// - isFully (boolean)
// - inFrame (string -- css selector)
// - ignoreRegion (string or object)
//    '#blah'
//    --or--
//    {left: 50, top: 50, width: 100, height: 100}
function checkRegion(target, options) {}

// options:
// - isClassicApi (boolean)
// - isFully (boolean)
// - ignoreRegion (string or object)
//    '#blah'
//    --or--
//    {left: 50, top: 50, width: 100, height: 100}
// - floatingRegion (object - target, maxUp, maxDown, maxLeft, maxRight)
//      {
//        target: {left: 10, top: 10, width: 20, height: 10},
//        maxUp: 3,
//        maxDown: 3,
//        maxLeft: 20,
//        maxRight: 30,
//      }
//      --or--
//      {
//        target: '#blah',
//        maxUp: 3,
//        maxDown: 3,
//        maxLeft: 20,
//        maxRight: 30,
//      }
//      --or--
//      {
//        target: 25,
//        maxUp: 3,
//        maxDown: 3,
//        maxLeft: 20,
//        maxRight: 30,
//      }
// - scrollRootElement (string - css selector)
function checkWindow(options) {}

// options:
// - throwException
function close(options) {}

// options:
// - appName
// - viewportSize
function open(options) {}

// pixels (number)
function scrollDown(pixels) {}

// locator (string -- css selector of a frame)
function switchToFrame(locator) {}

// locator (string - css selector of an element)
function type(locator, inputText) {}

// url - string
function visit(url) {}
/* eslint-enable no-unused-vars */

module.exports = {
  checkFrame,
  checkRegion,
  checkWindow,
  close,
  open,
  scrollDown,
  switchToFrame,
  type,
  visit,
}
