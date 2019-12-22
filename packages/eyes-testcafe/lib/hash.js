'use strict'

function hash(str) {
  let hash = 0
  let i, chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

module.exports = hash
