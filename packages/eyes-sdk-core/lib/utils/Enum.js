'use strict'

/**
 * @template E
 * @param {string} name
 * @param {E} valuesObj
 * @return {Readonly<E>}
 */
function Enum(name, valuesObj) {
  const enumObj = Object.create({_name: name})
  Object.assign(enumObj, valuesObj)
  Object.freeze(enumObj)
  return enumObj
}

module.exports = Enum
