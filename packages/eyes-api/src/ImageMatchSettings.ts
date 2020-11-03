import ExactMatchSettings , {PlainExactMatchSettings} from './ExactMatchSettings'
import Region, {PlainRegion} from './Region'
import FloatingRegion, {PlainFloatingRegion} from './FloatingRegion'
import AccessibilityRegion, {PlainAccessibilityRegion} from './AccessibilityRegion'
import MatchLevel from './enums/MatchLevel'
import AccessibilityLevel from './enums/AccessibilityLevel'
import AccessibilityGuidelinesVersion from './enums/AccessibilityGuidelinesVersion'
import * as ArgumentGuard from './utils/ArgumentGuard'

type AccessibilitySettings = {
  level?: AccessibilityLevel,
  version?: AccessibilityGuidelinesVersion
}

export type PlainImageMatchSettings = {
  matchLevel?: MatchLevel,
  exact?: PlainExactMatchSettings,
  ignoreCaret?: boolean,
  useDom?: boolean,
  enablePatterns?: boolean,
  ignoreDisplacements?: boolean,
  accessibilitySettings?: AccessibilitySettings
  ignore?: PlainRegion[],
  layout?: PlainRegion[],
  strict?: PlainRegion[],
  content?: PlainRegion[],
  floating?: PlainFloatingRegion[]
  accessibility?: PlainAccessibilityRegion[],
}

export default class ImageMatchSettings implements PlainImageMatchSettings {
  private _matchLevel: MatchLevel = MatchLevel.Strict
  private _exact: ExactMatchSettings
  private _ignoreCaret: boolean = true
  private _useDom: boolean = false
  private _enablePatterns: boolean = false
  private _ignoreDisplacements: boolean = false
  private _accessibilitySettings: AccessibilitySettings
  private _ignoreRegions: Region[]
  private _layoutRegions: Region[]
  private _strictRegions: Region[]
  private _contentRegions: Region[]
  private _floatingRegions: FloatingRegion[]
  private _accessibilityRegions: AccessibilityRegion[]

  constructor(settings: PlainImageMatchSettings = {}) {
    ArgumentGuard.isBoolean(settings.ignoreCaret, {name: 'ignoreCaret', strict: false})
    ArgumentGuard.isBoolean(settings.useDom, {name: 'useDom', strict: false})
    ArgumentGuard.isBoolean(settings.enablePatterns, {name: 'enablePatterns', strict: false})
    ArgumentGuard.isBoolean(settings.ignoreDisplacements, {name: 'ignoreDisplacements', strict: false})
    
    if (settings.matchLevel) this._matchLevel = settings.matchLevel
    if (settings.matchLevel) this._matchLevel = settings.matchLevel
    if (settings.matchLevel) this._matchLevel = settings.matchLevel
    if (settings.matchLevel) this._matchLevel = settings.matchLevel
  }
}