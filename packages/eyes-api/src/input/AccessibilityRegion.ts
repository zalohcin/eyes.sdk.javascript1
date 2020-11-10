import * as TypeUtils from '../utils/TypeUtils'
import * as ArgumentGuard from '../utils/ArgumentGuard'
import {Location} from './Location'
import {RectangleSize} from './RectangleSize'

export type AccessibilityRegion = {}

export default class AccessibilityRegionData implements Required<AccessibilityRegion> {
  private _x: number
  private _y: number
  private _width: number
  private _height: number

  constructor(region: AccessibilityRegion) {}
}
