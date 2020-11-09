
export function isNull(value: any) : value is null|undefined {
  return value == null
}

export function isBoolean(value: any) : value is boolean {
  return typeof value === 'boolean' || value instanceof Boolean
}

export function isString(value: any) : value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}

export function isNumber(value: any) : value is number {
  return typeof value === 'number' || value instanceof Number
}

export function isInteger(value: any) : value is number {
  return isNumber(value) && Number.isInteger(value)
}

export function isArray(value: any) : value is any[] {
  return Array.isArray(value)
}

export function isObject(value: any) : value is object {
  return typeof value === 'object' && value !== null
}

export function isPlainObject(value: any) : value is {[key: string]: any} {
  if (!isObject(value) || toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.getPrototypeOf({})
}

export function isEnumValue<TEnum extends {[key: string]: any}, TValues extends TEnum[keyof TEnum]>(value: any, enumeration: TEnum) : value is TValues {
  const values = new Set(Object.values(enumeration))
  return values.has(value)
}

export function has<TKey extends PropertyKey>(value: any, keys: TKey|readonly TKey[]) : value is {[key in TKey]: any} {
  if (!isObject(value)) return false

  if (!isArray(keys)) keys = [keys as TKey]

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return true
}

export function instanceOf<TCtor extends new (...args: any) => any>(value: any, ctor: TCtor) : value is InstanceType<TCtor> {
  return value instanceof ctor
}
