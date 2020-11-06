import BrowserType from '../enums/BrowserType'
import DeviceName from '../enums/DeviceName'
import IOSDeviceName from '../enums/IOSDeviceName'
import ScreenOrientation from '../enums/ScreenOrientation'

type DesktopBrowserInfo = {
  name?: BrowserType,
  width: number,
  height: number,
}

type EmulationInfo<TDeviceName> = {
  deviceName: TDeviceName,
  screenOrientation?: ScreenOrientation
}

type ChromeEmulationInfo = {
  chromeEmulationInfo: EmulationInfo<DeviceName>
}

type IOSEmulationInfo = {
  iosEmulationInfo: EmulationInfo<IOSDeviceName>
}

export type RenderInfo = DesktopBrowserInfo|ChromeEmulationInfo|IOSEmulationInfo|EmulationInfo<DeviceName>
