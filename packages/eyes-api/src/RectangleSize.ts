import * as TypeUtils from './utils/TypeUtils'
import * as ArgumentGuard from './utils/TypeUtils'

export type PlainRectangleSize = {
  width: number,
  height: number,
}

export default class RectangleSize implements PlainRectangleSize {
  private _width: number
  private _height: number

  constructor(size: PlainRectangleSize)
  constructor(width: number, height: number)
  constructor(sizeOrWidth: PlainRectangleSize|number, height?: number) {
    if (TypeUtils.isNumber(sizeOrWidth)) {
      return new RectangleSize({width: sizeOrWidth, height})
    }
    const size = sizeOrWidth
    ArgumentGuard.isNumber(size.width, {name: 'size.width', gte: 0})
    ArgumentGuard.isNumber(size.height, {name: 'size.height', gte: 0})

    this._width = size.width
    this._height = size.height
  }

  get width() : number {
    return this._width
  }
  getWidth() {
    return this._width
  }
  get height() : number {
    return this._width
  }
  getHeight() : number {
    return this._height
  }
}