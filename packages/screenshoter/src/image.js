const utils = require('@applitools/utils')
const sharp = require('sharp')

function makeImage(bufferOrSize) {
  let image, size
  if (utils.types.isString(bufferOrSize)) {
    const buffer = Buffer.from(bufferOrSize, 'base64')
    image = fromBuffer(buffer)
    size = extractPngSize(buffer)
  } else if (Buffer.isBuffer(bufferOrSize)) {
    image = fromBuffer(bufferOrSize)
    size = extractPngSize(bufferOrSize)
  } else {
    image = fromSize(bufferOrSize)
    size = bufferOrSize
  }

  return {
    get width() {
      return image.info ? image.info.width : size.width
    },
    get height() {
      return image.info ? image.info.height : size.height
    },
    async scale(scaleRatio) {
      image = await scale(await image, scaleRatio)
      return this
    },
    async crop(region) {
      image = await crop(await image, region)
      return this
    },
    async rotate(degree) {
      image = await rotate(await image, degree)
      return this
    },
    async copy(image2, offset) {
      image = await copy(await image, image2, offset)
      return this
    },
    async toObject() {
      image = await image
      return image
    },
    async toBuffer() {
      image = await image
      return image.data
    },
    async toPng() {
      return toPng(await image)
    },
  }
}

async function fromBuffer(buffer) {
  return sharp(buffer)
    .raw()
    .toBuffer({resolveWithObject: true})
}

async function fromSize(size) {
  return sharp({
    create: {width: size.width, height: size.height, channels: 4, background: {r: 0, g: 0, b: 0}},
  })
    .raw()
    .toBuffer({resolveWithObject: true})
}

async function toPng(image) {
  return sharp(image.data, {raw: image.info})
    .png()
    .toBuffer()
}

async function scale(image, scaleRatio) {
  const aspectRatio = image.info.height / image.info.width
  const width = Math.ceil(image.info.width * scaleRatio)
  const height = Math.ceil(width * aspectRatio)
  return sharp(image.data, {raw: image.info})
    .resize({width, height})
    .raw()
    .toBuffer({resolveWithObject: true})
}

async function crop(image, region) {
  return sharp(image.data, {raw: image.info})
    .extract({
      left: Math.round(region.x),
      top: Math.round(region.y),
      width: Math.round(region.width),
      height: Math.round(region.height),
    })
    .raw()
    .toBuffer({resolveWithObject: true})
}

async function rotate(image, degree) {
  return sharp(image.data, {raw: image.info})
    .rotate(degree)
    .raw()
    .toBuffer({resolveWithObject: true})
}

async function copy(image1, image2, offset) {
  return sharp(image1.data, {raw: image1.info})
    .composite([{input: image2.data, raw: image2.info, left: offset.x, top: offset.y}])
    .raw()
    .toBuffer({resolveWithObject: true})
}

function extractPngSize(buffer) {
  if (buffer[12] === 0x49 && buffer[13] === 0x48 && buffer[14] === 0x44 && buffer[15] === 0x52) {
    const width =
      buffer[16] * 256 * 256 * 256 + buffer[17] * 256 * 256 + buffer[18] * 256 + buffer[19]

    const height =
      buffer[20] * 256 * 256 * 256 + buffer[21] * 256 * 256 + buffer[22] * 256 + buffer[23]
    return {width, height}
  }
}

module.exports = makeImage
