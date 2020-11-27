const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
import {makeSDK} from '@applitools/eyes-sdk-core'
import * as API from '@applitools/eyes-api'
import type {Page, ElementHandle} from 'playwright'

const sdk = makeSDK({
  name: 'eyes.playwright',
  version,
  spec,
  VisualGridClient,
})

export * from '@applitools/eyes-api'

export class Eyes extends API.Eyes<Page, ElementHandle, string> {
  protected readonly _spec = {...sdk, ...spec}
}

export class CheckSettings extends API.CheckSettings<ElementHandle, string> {
  protected readonly _spec = spec
}
