import {
  Eyes as AbstractEyes,
  CheckSettings as AbstractCheckSettings
} from '@applitools/eyes-api'
import sdk from './sdk'
import * as spec from './spec-driver'

import type {Driver, Element, Selector} from './spec-driver'

export * from '@applitools/eyes-api'

export const Eyes = AbstractEyes.make<Driver, Element, Selector>({...sdk, ...spec})
export const CheckSettings = AbstractCheckSettings.make<Element, Selector>(spec)