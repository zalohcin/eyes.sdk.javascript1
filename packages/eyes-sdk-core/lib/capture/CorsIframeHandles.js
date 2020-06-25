const Enum = require('../utils/Enum')

/**
 * @typedef {'BLANK'|'KEEP'|'SNAPSHOT'} CorsIframeHandle
 */

const CorsIframeHandles = Enum('CorsIframeHandle', {
  /** We should REMOVE the SRC attribute of the iframe */
  BLANK: 'BLANK',
  /** Not to do anything */
  KEEP: 'KEEP',
  SNAPSHOT: 'SNAPSHOT',
})

module.exports = CorsIframeHandles
