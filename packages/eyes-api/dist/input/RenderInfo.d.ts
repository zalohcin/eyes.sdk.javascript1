import BrowserName from '../enums/BrowserName';
import DeviceName from '../enums/DeviceName';
import IOSDeviceName from '../enums/IOSDeviceName';
import ScreenOrientation from '../enums/ScreenOrientation';
declare type DesktopBrowserInfo = {
    name?: BrowserName;
    width: number;
    height: number;
};
declare type EmulationInfo<TDeviceName> = {
    deviceName: TDeviceName;
    screenOrientation?: ScreenOrientation;
};
declare type ChromeEmulationInfo = {
    chromeEmulationInfo: EmulationInfo<DeviceName>;
};
declare type IOSEmulationInfo = {
    iosEmulationInfo: EmulationInfo<IOSDeviceName>;
};
export declare type RenderInfo = DesktopBrowserInfo | ChromeEmulationInfo | IOSEmulationInfo | EmulationInfo<DeviceName>;
export {};
