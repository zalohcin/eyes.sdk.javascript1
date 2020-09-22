function charCodeAt(string, index = 0) {
  const code = string.charCodeAt(index)
  if (0xd800 <= code && code < 0xdc00) {
    // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
    const high = code
    const low = string.charCodeAt(index + 1)

    return (high - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000
  }
  if (0xdc00 <= code && code <= 0xdfff) return -1
  return code
}

function chunkify(string, chunkByteLength) {
  const chunks = []
  let currChunkByteLength = 0
  let lastChunkIndex = 0

  for (let index = 0; index < string.length; ++index) {
    const code = charCodeAt(string, index)
    let charByteLength = 0
    if (code > 0) {
      if (code < 128) charByteLength = 1
      else if (code < 2048) charByteLength = 2
      else if (code < 65536) charByteLength = 3
      else if (code < 2097152) charByteLength = 4
      else if (code < 67108864) charByteLength = 5
      else charByteLength = 6
    }

    if (currChunkByteLength + charByteLength > chunkByteLength) {
      chunks.push(string.substring(lastChunkIndex, index))
      lastChunkIndex = index
      currChunkByteLength = charByteLength
    } else {
      currChunkByteLength += charByteLength
    }
  }

  chunks.push(string.substring(lastChunkIndex))

  return chunks
}

module.exports = chunkify
