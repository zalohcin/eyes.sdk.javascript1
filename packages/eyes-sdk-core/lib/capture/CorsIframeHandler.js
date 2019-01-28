'use strict';

const {URL} = require('url');

/**
 * @readonly
 * @enum {number}
 */
const CorsIframeHandle = {
  /**
   * We should REMOVE the SRC attribute of the iframe
   */
  BLANK: 'BLANK',

  /**
   * Not to do anything
   */
  KEEP: 'KEEP',

  /**
   *
   */
  SNAPSHOT: 'SNAPSHOT',
};


class CorsIframeHandler {


  static blankCorsIframeSrc(json, origin) {
    if (json.tagName === 'IFRAME') {
      if (json.attributes.src) {
        const frameUrl = new URL(json.attributes.src, origin);
        if (origin !== frameUrl.origin) {
          json.attributes.src = '';
        }
      }
    }

    if (json.childNodes) {
      for(const child of json.childNodes) {
        CorsIframeHandler.blankCorsIframeSrc(child, origin);
      }
    }
  }
}


Object.freeze(CorsIframeHandle);
exports.CorsIframeHandle = CorsIframeHandle;
exports.CorsIframeHandler = CorsIframeHandler;
