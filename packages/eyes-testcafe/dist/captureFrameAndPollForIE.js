
module.exports = () => {
  (function () {
  'use strict';

  require("core-js/stable");

  require("regenerator-runtime/runtime");

  require("url-polyfill");

  require("whatwg-fetch");

  var captureFrame = require('./captureFrame');

  var EYES_NAME_SPACE = '__EYES__APPLITOOLS__';

  function captureFrameAndPoll() {
    if (!window[EYES_NAME_SPACE]) {
      window[EYES_NAME_SPACE] = {};
    }

    if (!window[EYES_NAME_SPACE].captureDomResult) {
      window[EYES_NAME_SPACE].captureDomResult = {
        status: 'WIP',
        value: null,
        error: null
      };
      captureFrame.apply(void 0, arguments).then(function (r) {
        return resultObject.status = 'SUCCESS', resultObject.value = r;
      }).catch(function (e) {
        return resultObject.status = 'ERROR', resultObject.error = e.message;
      });
    }

    var resultObject = window[EYES_NAME_SPACE].captureDomResult;

    if (resultObject.status === 'SUCCESS') {
      window[EYES_NAME_SPACE].captureDomResult = null;
    }

    return JSON.stringify(resultObject);
  }

  module.exports = captureFrameAndPoll;

}());
  return captureFrameAndPoll()
}