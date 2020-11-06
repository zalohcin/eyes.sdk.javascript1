import * as TypeUtils from '../utils/TypeUtils'
import * as ArgumentGuard from '../utils/ArgumentGuard'

export type Property = {
  name: string,
  value: string,
}

export default class PropertyData implements Required<Property> {
  private _name: string
  private _value: string

  constructor(prop: Property)
  constructor(name: string, value: string)
  constructor(propOrName: Property|string, value?: string) {
    if (TypeUtils.isString(propOrName)) {
      return new PropertyData({name: propOrName, value})
    }
    const prop = propOrName
    ArgumentGuard.isString(prop.name, {name: 'prop.name'})
    ArgumentGuard.notNull(prop.value, {name: 'prop.value'})

    this._name = prop.name
    this._value = prop.value
  }

  get name() : string {
    return this._name
  }
  getName() : string {
    return this._name
  }
  setName(name: string) {
    this._name = name
  }

  get value() : string {
    return this._value
  }
  getValue(): string {
    return this._value
  }
  setValue(value: string) {
    this._value = value
  }
}