function cleanupPageMarker() {
  const marker = document.querySelector('[data-applitools-marker-id]')
  document.body.removeChild(marker)
}

module.exports = cleanupPageMarker
