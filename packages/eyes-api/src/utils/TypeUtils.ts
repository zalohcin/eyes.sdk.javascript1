
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

