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
