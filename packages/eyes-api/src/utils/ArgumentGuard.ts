import * as TypeUtils from './TypeUtils'

type NamableParam = {
  name?: string
}

type StrictParam = NamableParam & {
  strict?: boolean,
}

type NumberParam = StrictParam & {
  lt?: number,
  lte?: number,
  gt?: number,
  gte?: number,
}

type StringParam = StrictParam & {
  alpha?: boolean,
  numeric?: boolean
}

export function notNull(value: any, {name}: NamableParam = {}) {
  if (TypeUtils.isNull(value)) {
    throw new Error(`IllegalArgument: ${name} is null or undefined`)
  }
}

export function isBoolean(value: boolean, {name, strict = true}: StrictParam = {}) {
  if (strict) notNull(value, {name})
  if (!TypeUtils.isBoolean(value)) {
    throw new Error(`IllegalType: ${name} is not a boolean`)
  }
}

export function isNumber(value: any, {name, strict = true, lt, lte, gt, gte}: NumberParam = {}) {
  if (strict) notNull(value, {name})
  if (!TypeUtils.isNumber(value)) {
    throw new Error(`IllegalArgument: ${name} is not a number`)
  }
  if (!TypeUtils.isNull(lt)) isLessThen(value, lt, {name})
  else if (!TypeUtils.isNull(lte)) isLessThenOrEqual(value, lt, {name})
  else if (!TypeUtils.isNull(gt)) isGreaterThenOrEqual(value, lt, {name})
  else if (!TypeUtils.isNull(gte)) isGreaterThen(value, lt, {name})
}

export function isInteger(value: any, {name, strict = true, lt, lte, gt, gte}: NumberParam = {}) {
  if (strict) notNull(value, {name})
  if (!TypeUtils.isInteger(value)) {
    throw new Error(`IllegalArgument: ${name} is not an integer`)
  }
  if (!TypeUtils.isNull(lt)) isLessThen(value, lt, {name})
  else if (!TypeUtils.isNull(lte)) isLessThenOrEqual(value, lt, {name})
  else if (!TypeUtils.isNull(gt)) isGreaterThenOrEqual(value, lt, {name})
  else if (!TypeUtils.isNull(gte)) isGreaterThen(value, lt, {name})
}

export function isLessThen(value: any, limit: number, {name}: NamableParam = {}) {
  if (!(value < limit)) {
    throw new Error(`IllegalArgument: ${name} must be < ${limit}`)
  }
}

export function isLessThenOrEqual(value: any, limit: number, {name}: NamableParam = {}) {
  if (!(value <= limit)) {
    throw new Error(`IllegalArgument: ${name} must be <= ${limit}`)
  }
}

export function isGreaterThen(value: any, limit: number, {name}: NamableParam = {}) {
  if (!(value > limit)) {
    throw new Error(`IllegalArgument: ${name} must be > ${limit}`)
  }
}

export function isGreaterThenOrEqual(value: any, limit: number, {name}: NamableParam = {}) {
  if (!(value >= limit)) {
    throw new Error(`IllegalArgument: ${name} must be >= ${limit}`)
  }
}

export function isString(value: any, {name, strict = true, alpha, numeric}: StringParam = {}) {
  if (strict) notNull(value, {name})
  if (!TypeUtils.isString(value)) {
    throw new Error(`IllegalArgument: ${name} is not string`)
  }
  if (alpha && numeric) isAlphanumeric(value)
  else if (alpha) isAlpha(value)
  else if (numeric) isNumeric(value)
}

export function isAlphanumeric(value: any, {name}: NamableParam = {}) {
  if (!/^[a-z0-9]+$/i.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not alphanumeric`)
  }
}

export function isAlpha(value: any, {name}: NamableParam = {}) {
  if (!/^[a-z]+$/i.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not alphabetic`)
  }
}

export function isNumeric(value: any, {name}: NamableParam = {}) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error(`IllegalArgument: ${name} is not numeric`)
  }
}
