import * as TypeUtils from './TypeUtils'

export function getEnvValue(name: string, type: 'string' | 'number' | 'boolean' = 'string') {
  if (process === undefined) return
  const value = process.env[`APPLITOOLS_${name}`]
  if (value === undefined || value === 'null') return
  if (type === 'boolean' && !TypeUtils.isBoolean(value)) {
    return value === 'true'
  } else if (type === 'number') {
    return Number(value)
  }
  return value
}

export function toPlain(object: Record<any, any>, exclude: Array<string> = [], rename: Record<string, string> = {}): object {
  if (object == null) {
    throw new TypeError('Cannot make null plain.')
  }

  const plainObject: Record<string, string> = {}
  Object.keys(object).forEach((objectKey: string) => {
    let publicKey: string = objectKey.replace('_', '')
    if (rename[publicKey]) {
      publicKey = rename[publicKey]
    }

    if (Object.prototype.hasOwnProperty.call(object, objectKey) && !exclude.includes(objectKey)) {
      if (object[objectKey] instanceof Object && typeof object[objectKey].toJSON === 'function') {
        plainObject[publicKey] = object[objectKey].toJSON()
      } else {
        plainObject[publicKey] = object[objectKey]
      }
    }
  })

  return plainObject;
}

export function toString(object: object, exclude: string[] = []): string {
  if (!TypeUtils.isPlainObject(object)) {
    object = toPlain(object, exclude)
  }

  try {
    return JSON.stringify(object);
  } catch (err) {
    console.warn("Error on converting to string:", err);
    return undefined;
  }
}