import Eyes from './Eyes'
import CheckSettingsFluent, {CheckSettings} from './input/CheckSettings'
import ConfigurationData, {Configuration} from './input/Configuration'

type SDKSpec<TDriver, TElement, TSelector> = {
  isDriver(value: any) : value is TDriver
  isElement(value: any) : value is TElement
  isSelector(value: any) : value is TSelector
  makeSDK(config?: Configuration) : SDK<TDriver, TElement, TSelector>
}

type SDK<TDriver, TElement, TSelector> = {
  open: (driver: TDriver, config?: Configuration) => SDKEyes<TElement, TSelector>
  close: () => Promise<void>
}

type SDKEyes<TElement, TSelector> = {
  check: (settings?: CheckSettings<TElement, TSelector>) => Promise<void>
  locate: (blabla: any) => Promise<any>
  close: () => Promise<void>
  abort: () => Promise<void>
}

export default function API<TDriver, TContext, TElement, TSelector>(spec: SDKSpec<TDriver, TElement, TSelector>) {
  class SpecializedEyes extends Eyes<TDriver, TContext, TElement, TSelector> {
    isElement = spec.isElement
    isSelector = spec.isSelector
  }

  class SpecializedCheckSettings extends CheckSettingsFluent<TElement, TSelector> {
    isElement = spec.isElement
    isSelector = spec.isSelector
  }

  return {
    Eyes: SpecializedEyes,
    CheckSettings: SpecializedCheckSettings,
    Configuration: ConfigurationData
  }
}
