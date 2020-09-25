const setElementStyleProperties = require('./setElementStyleProperties')
function cleanupPageMarker() {
  const marker = document.querySelector('[data-applitools-marker]')
  const transforms = JSON.parse(marker.getAttribute('data-applitools-marker-transforms'))
  setElementStyleProperties([document.documentElement, transforms.html])
  setElementStyleProperties([document.body, transforms.body])
  document.body.removeChild(marker)
}

module.exports = cleanupPageMarker
