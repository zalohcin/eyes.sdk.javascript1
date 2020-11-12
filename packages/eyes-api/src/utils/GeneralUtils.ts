import * as TypeUtils from './TypeUtils'

export function getEnvValue<T extends 'boolean' | 'number' | 'string' = 'string'>(
  name: string,
  type?: T,
): T extends 'boolean' ? boolean : T extends 'number' ? number : string {
  if (!process) return
  const value = process.env[`APPLITOOLS_${name}`]
  if (value === undefined || value === 'null') return
  if (type === 'boolean' && TypeUtils.isBoolean(value)) return (value === 'true') as any
  if (type === 'number') return Number(value) as any
  return value as any
}

export function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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
