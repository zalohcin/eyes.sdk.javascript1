import * as TypeUtils from './TypeUtils'

export function getEnvValue(name: string, type: 'string'|'number'|'boolean' = 'string') {
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