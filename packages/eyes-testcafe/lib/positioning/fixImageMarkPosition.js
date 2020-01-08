'use strict'

function makeFixImageMarkPosition({executor, logger}) {
  return async function(transformLeft, transformTop) {
    const fixTestcafeMark = `
      const pageHeight = document.documentElement.getBoundingClientRect().height
      const styleContent = \`img.screenshot-mark-hammerhead-shadow-ui { 
        bottom: calc(\${pageHeight\}px - 100vh + ${transformTop}px) !important;
        top: auto !important;
        left: auto !important;
        height: 
        right: calc(5px + ${transformLeft}px) !important;
      }\`
      let style = document.getElementById('applitools-mark-fix')
      if(!style) {
        style = document.createElement('style')
        style.id = 'applitools-mark-fix'
        document.body.appendChild(style);
      }
      style.innerText = styleContent
    `
    try {
      logger.verbose('fixImageMarkPosition - fixing testacfe mark')
      await executor.executeScript(fixTestcafeMark)
    } catch (e) {
      logger.verbose('fixImageMarkPosition - failed to fix testcafe mark', e)
    }
  }
}

module.exports = makeFixImageMarkPosition
