import Eyes, {EyesSpec} from './Eyes'
import CheckSettings, {CheckSettingsSpec} from './input/CheckSettings'
import Configuration from './input/Configuration'

type APISpec<TDriver, TElement, TSelector> = EyesSpec<TDriver, TElement, TSelector> &
  CheckSettingsSpec<TElement, TSelector>

export default function API<TDriver, TElement, TSelector>(spec: APISpec<TDriver, TElement, TSelector>) {
  class APIEyes extends Eyes<TDriver, TElement, TSelector> {
    protected readonly _spec = spec
  }

  class APICheckSettings extends CheckSettings<TElement, TSelector> {
    protected readonly _spec = spec
  }

  return {
    Eyes: APIEyes as new (...args: any[]) => Eyes<TDriver, TElement, TSelector>,
    CheckSettings: APICheckSettings as new (...args: any[]) => CheckSettings<TElement, TSelector>,
    Configuration: Configuration,
  }
}
