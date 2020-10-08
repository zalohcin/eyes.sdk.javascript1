function cleanupPageMarker() {
  const marker = document.querySelector('[data-applitools-marker]')
  if (marker) document.body.removeChild(marker)
}

module.exports = cleanupPageMarker
