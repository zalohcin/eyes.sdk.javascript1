'use strict'
const {URL} = require('url')

class CorsIframeHandler {
  /**
   * @param {object} json
   * @param {string} origin
   */
  static blankCorsIframeSrc(json, origin) {
    if (json.tagName === 'IFRAME') {
      if (json.attributes.src) {
        const frameUrl = new URL(json.attributes.src, origin)
        if (origin !== frameUrl.origin) {
          json.attributes.src = ''
        }
      }
    }

    if (json.childNodes) {
      for (const child of json.childNodes) {
        CorsIframeHandler.blankCorsIframeSrc(child, origin)
      }
    }
  }

  /**
   * @param {object[]} cdt
   * @param {object[]} frames
   * @return {object[]}
   */
  static blankCorsIframeSrcOfCdt(cdt, frames) {
    const frameUrls = new Set(frames.map(frame => frame.srcAttr))
    cdt.map(node => {
      if (node.nodeName === 'IFRAME') {
        const srcAttr = node.attributes.find(attr => attr.name === 'src')
        if (srcAttr && !frameUrls.has(srcAttr.value)) {
          srcAttr.value = ''
        }
      }
      return node
    })

    frames.forEach(frame => {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(frame.cdt, frame.frames)
    })

    return cdt
  }
}

module.exports = CorsIframeHandler
