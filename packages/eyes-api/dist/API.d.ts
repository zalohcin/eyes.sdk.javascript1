import Eyes, { EyesSpec } from './Eyes';
import CheckSettings, { CheckSettingsSpec } from './input/CheckSettings';
import Configuration from './input/Configuration';
declare type APISpec<TDriver, TElement, TSelector> = EyesSpec<TDriver, TElement, TSelector> & CheckSettingsSpec<TElement, TSelector>;
export default function API<TDriver, TElement, TSelector>(spec: APISpec<TDriver, TElement, TSelector>): {
    Eyes: new (...args: any[]) => Eyes<TDriver, TElement, TSelector>;
    CheckSettings: new (...args: any[]) => CheckSettings<TElement, TSelector>;
    Configuration: typeof Configuration;
};
export {};
