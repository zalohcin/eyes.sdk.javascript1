const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
import {makeSDK} from '@applitools/eyes-sdk-core'
import * as API from '@applitools/eyes-api'
import type {WebDriver, WebElement, By, ByHash} from 'selenium-webdriver'

const sdk = makeSDK({
  name: 'eyes.playwright',
  version,
  spec,
  VisualGridClient,
})

type SeleniumDriver = WebDriver
type SeleniumElement = WebElement
type SeleniumSelector = By | ByHash | string

export * from '@applitools/eyes-api'

export class Eyes extends API.Eyes<SeleniumDriver, SeleniumElement, SeleniumSelector> {
  protected readonly _spec = {...sdk, ...spec}
}

export const CheckSettings =  API.CheckSettings.make<SeleniumElement, SeleniumSelector>(spec)
