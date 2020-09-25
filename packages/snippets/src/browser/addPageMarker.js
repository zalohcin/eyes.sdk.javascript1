const setElementStyleProperties = require('./setElementStyleProperties')

function addPageMarker() {
  const marker = document.createElement('div')
  const contrast = document.createElement('div')
  marker.append(contrast)
  document.body.append(marker)
  marker.setAttribute('data-applitools-marker', '')

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

  const transform = {value: 'none', important: true}
  const html = setElementStyleProperties([
    document.documentElement,
    {transform, '-webkit-transform': transform},
  ])
  const body = setElementStyleProperties([
    document.body,
    {transform, '-webkit-transform': transform},
  ])

  marker.setAttribute('data-applitools-marker-transforms', JSON.stringify({html, body}))

  return {
    offset: 1 * window.devicePixelRatio,
    size: 3 * window.devicePixelRatio,
    mask: [0, 1, 0],
  }
}

module.exports = addPageMarker
