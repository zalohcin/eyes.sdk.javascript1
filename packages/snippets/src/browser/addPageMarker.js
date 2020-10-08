function addPageMarker([mask = [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0]] = []) {
  const marker = document.createElement('div')

  marker.style.setProperty('position', 'absolute', 'important')
  marker.style.setProperty('display', 'flex', 'important')
  marker.style.setProperty('box-sizing', 'content-box', 'important')
  marker.style.setProperty('border', '1px solid rgb(127,127,127)', 'important')
  marker.style.setProperty('z-index', '999999999', 'important')
  marker.setAttribute('data-applitools-marker', '')
  mask.forEach(color => {
    const pixel = document.createElement('div')
    pixel.style.setProperty('width', '1px', 'important')
    pixel.style.setProperty('height', '1px', 'important')
    pixel.style.setProperty('background', color ? '#fff' : '#000', 'important')
    marker.appendChild(pixel)
  })
  document.body.appendChild(marker)

  const {top, left} = document.body.getBoundingClientRect()
  marker.style.setProperty('top', `${-top + document.scrollingElement.clientHeight - marker.offsetHeight}px`, 'important')
  marker.style.setProperty('left', `${-left + document.scrollingElement.clientWidth - marker.offsetWidth}px`, 'important')

  let env
  if (CSS && CSS.supports) {
    if (CSS.supports('top: env(safe-area-inset-top)')) env = 'env'
    else if (CSS.supports('top: constant(safe-area-inset-top)')) env = 'constant'
  }

  if (env) {
    marker.style.setProperty('--bottom', `${env}(safe-area-inset-bottom)`)
    marker.style.setProperty('--top', `${env}(safe-area-inset-top)`)
    marker.style.setProperty('--left', `${env}(safe-area-inset-left)`)
    marker.style.setProperty('--right', `${env}(safe-area-inset-right)`)
  }

  const viewport = document.querySelector('meta[name="viewport"]')
  const cs = getComputedStyle(marker)

  return {
    mask,
    offset: 1,
    pixelRation: window.devicePixelRatio,
    orientation: window.screen.orientation ? window.screen.orientation.angle : window.orientation,
    isCover: viewport.content.includes('viewport-fit=cover'),
    safeArea: {
      bottom: Number.parseInt(cs.getPropertyValue('--bottom')) || 0,
      top: Number.parseInt(cs.getPropertyValue('--env-top')) || 0,
      left: Number.parseInt(cs.getPropertyValue('--env-left')) || 0,
      right: Number.parseInt(cs.getPropertyValue('--env-right')) || 0,
    },
  }
}

module.exports = addPageMarker
