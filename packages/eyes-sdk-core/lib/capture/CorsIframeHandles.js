const Enum = require('../utils/Enum')

/**
 * @typedef {string} CorsIframeHandle
 */

const CorsIframeHandles = Enum('CorsIframeHandle', {
  /** We should REMOVE the SRC attribute of the iframe */
  BLANK: 'BLANK',
  /** Not to do anything */
  KEEP: 'KEEP',
  SNAPSHOT: 'SNAPSHOT',
})

exports.CorsIframeHandles = CorsIframeHandles
