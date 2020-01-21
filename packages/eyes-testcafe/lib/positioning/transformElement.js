/* eslint-disable no-undef */
'use strict'

function transformElement() {
  const isZeroPosition = transformLeft === 0 && transformTop === 0

  // Fix Testcafe mark:

  if (!isZeroPosition) {
    const pageHeight = document.documentElement.getBoundingClientRect().height
    const ratio = window.devicePixelRatio
    const styleContent = `img.screenshot-mark-hammerhead-shadow-ui { 
        bottom: calc(${pageHeight}px - 100vh + ${transformTop}px) !important;
        top: auto !important;
        left: auto !important;
        right: calc((${markRightMargin}px / ${ratio}) + ${transformLeft}px) !important;
      }`
    let style = document.getElementById('applitools-mark-fix')
    if (!style) {
      style = document.createElement('style')
      style.id = 'applitools-mark-fix'
      document.body.appendChild(style)
    }
    style.innerText = styleContent
  }

  if (isZeroPosition) {
    const style = document.getElementById('applitools-mark-fix')
    style && style.parentNode.removeChild(style)
  }

  // Set transform:

  const translate = !isZeroPosition ? `translate(${transformLeft}px, ${transformTop}px)` : ''
  const elem = element()
  elem.style.transform = originalTransform || translate
}

module.exports = transformElement
