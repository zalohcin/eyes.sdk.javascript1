'use strict'
const {MARK_RIGHT_MARGIN} = require('testcafe/lib/screenshots/constants')

function fixImageMarkScript(transformLeft, transformTop) {
  const isZeroPosition = transformLeft === 0 && transformTop === 0
  const fixTestcafeMark = !isZeroPosition
    ? `
    const pageHeight = document.documentElement.getBoundingClientRect().height
    const ratio = window.devicePixelRatio

    const styleContent = \`img.screenshot-mark-hammerhead-shadow-ui { 
      bottom: calc(\${pageHeight}px - 100vh + ${transformTop}px) !important;
      top: auto !important;
      left: auto !important;
      right: calc((${MARK_RIGHT_MARGIN}px / \${ratio}) + ${transformLeft}px) !important;
    }\`
    let style = document.getElementById('applitools-mark-fix')
    if(!style) {
      style = document.createElement('style')
      style.id = 'applitools-mark-fix'
      document.body.appendChild(style);
    }
    style.innerText = styleContent`
    : `
    const style = document.getElementById('applitools-mark-fix')
    style && style.parentNode.removeChild(style)`
  return fixTestcafeMark
}

module.exports = fixImageMarkScript
