import * as TypeUtils from './TypeUtils'

function f(value: any): value is 'boolean' {
  return value === 'boolean'
}

export function getEnvValue<TType extends string>(
  name: string,
  type: string,
): TType extends 'boolean' ? boolean : string {
  if (process === undefined) return
  const value = process.env[`APPLITOOLS_${name}`]
  if (value === undefined || value === 'null') return
  if (f(type) && type && !TypeUtils.isBoolean(value)) {
    return value === 'true'
  } else if (type === 'number') {
    return Number(value)
  }
  return value
}
