function addPageMarker() {
  const marker = document.createElement('div')
  const contrast = document.createElement('div')
  marker.setAttribute('data-applitools-marker-id', '')
  marker.append(contrast)
  document.body.append(marker)

  marker.style.position = 'fixed'
  marker.style.top = '0'
  marker.style.left = '0'
  marker.style.width = '3px'
  marker.style.height = '9px'
  marker.style.border = '1px solid rgb(127,127,127)'
  marker.style.background = 'rgb(0,0,0)'
  marker.style.zIndex = '999999999'

  contrast.style.width = '3px'
  contrast.style.height = '3px'
  contrast.style.margin = '3px 0'
  contrast.style.background = 'rgb(255,255,255)'
  return {
    offset: 1 * window.devicePixelRatio,
    size: 3 * window.devicePixelRatio,
    mask: [0, 1, 0],
  }
}

module.exports = addPageMarker
