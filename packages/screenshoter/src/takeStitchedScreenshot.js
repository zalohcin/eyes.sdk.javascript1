const utils = require('@applitools/utils')
const makeImage = require('./image')
const makeTakeScreenshot = require('./takeScreenshot')
const saveScreenshot = require('./saveScreenshot')
const scrollIntoViewport = require('./scrollIntoViewport')

async function takeStitchedImage({
  logger,
  context,
  scroller,
  region,
  rotate,
  crop,
  scale,
  overlap = 50,
  wait,
  debug,
}) {
  logger.verbose('Taking full image of...')

  await scrollIntoViewport({logger, context, scroller, region})

  const driver = context.driver
  const takeScreenshot = makeTakeScreenshot({logger, driver, rotate, crop, scale, debug})

  const scrollerState = await scroller.getState()
  const scrollerSize = await scroller.getSize()
  logger.verbose(`Scroller size: ${scrollerSize}`)

  const actualOffset = await scroller.moveTo(region ? region : {x: 0, y: 0})

  await utils.general.sleep(wait)

  logger.verbose('Getting initial image...')
  let image = await takeScreenshot({name: 'initial'})

  const cropRegion = await context.getRegionInViewport(
    region ? region : await scroller.getClientRect(),
  )

  logger.verbose('cropping...')
  await image.crop(cropRegion)
  await saveScreenshot(image, {path: debug.path, name: 'initial', suffix: 'region'})

  if (!region) {
    // Notice that this might still happen even if we used "getImagePart", since "entirePageSize" might be that of a frame.
    // if (image.width >= entireSize.width && image.height >= entireSize.height) {
    //   await scroller.restoreState(originalPosition)
    //   return image
    // }
    region = {x: 0, y: 0, width: scrollerSize.width, height: scrollerSize.height}
  }

  const partSize = {width: image.width, height: Math.max(image.height - overlap, 10)}
  logger.verbose(`Image part size: ${partSize}`)

  const [_, ...partRegions] = utils.geometry.divide({...region, ...actualOffset}, partSize)
  logger.verbose('Part regions', partRegions)

  logger.verbose('Creating stitched image composition container')
  const composition = makeImage({width: region.width, height: region.height})

  logger.verbose('Adding initial image...')
  await composition.copy(await image.toObject(), {x: 0, y: 0})

  logger.verbose('Getting the rest of the image parts...')

  let stitchedSize = {width: image.width, height: image.height}
  for (const partRegion of partRegions) {
    const partOffset = {x: partRegion.x, y: partRegion.y}
    const partSize = {width: partRegion.width, height: partRegion.height}
    const partName = `${partRegion.x}_${partRegion.y}_${partRegion.width}x${partRegion.height}`

    logger.verbose(`Processing part ${partName}`)

    logger.verbose(`Move to ${partOffset}`)
    const actualOffset = await scroller.moveTo(partOffset)
    const remainingOffset = utils.geometry.offsetNegative(partOffset, actualOffset)
    const cropPartRegion = utils.geometry.intersect(
      cropRegion,
      utils.geometry.offset(
        {x: cropRegion.x, y: cropRegion.y, width: partSize.width, height: partSize.height},
        remainingOffset,
      ),
    )
    logger.verbose(`Actual offset is ${actualOffset}, remaining offset is ${remainingOffset}`)

    await utils.general.sleep(wait)

    if (!utils.geometry.isEmpty(cropPartRegion)) {
      logger.verbose('Getting image...')
      image = await takeScreenshot({name: partName})

      logger.verbose('cropping...')
      await image.crop(cropPartRegion)
      await saveScreenshot(image, {path: debug.path, name: partName, suffix: 'region'})

      await composition.copy(await image.toObject(), partOffset)

      stitchedSize = {width: partOffset.x + image.width, height: partOffset.y + image.height}
    }
  }

  await scroller.restoreState(scrollerState)

  logger.verbose(`Extracted entire size: ${region}`)
  logger.verbose(`Actual stitched size: ${stitchedSize}`)

  if (stitchedSize.width < composition.width || stitchedSize.height < composition.height) {
    logger.verbose('Trimming unnecessary margins...')
    await composition.crop({
      x: 0,
      y: 0,
      width: Math.min(stitchedSize.width, composition.width),
      height: Math.min(stitchedSize.height, composition.height),
    })
  }

  await saveScreenshot(composition, {path: debug.path, name: 'stitched'})
  return composition
}

module.exports = takeStitchedImage
