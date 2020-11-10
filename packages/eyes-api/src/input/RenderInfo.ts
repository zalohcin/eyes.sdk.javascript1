import BrowserName from '../enums/BrowserName'
import DeviceName from '../enums/DeviceName'
import IOSDeviceName from '../enums/IOSDeviceName'
import ScreenOrientation from '../enums/ScreenOrientation'

type DesktopBrowserInfo = {
  name?: BrowserName
  width: number
  height: number
}

type EmulationInfo<TDeviceName> = {
  deviceName: TDeviceName
  screenOrientation?: ScreenOrientation
}

type ChromeEmulationInfo = {
  chromeEmulationInfo: EmulationInfo<DeviceName>
}

type IOSEmulationInfo = {
  iosEmulationInfo: EmulationInfo<IOSDeviceName>
}

export type RenderInfo = DesktopBrowserInfo | ChromeEmulationInfo | IOSEmulationInfo | EmulationInfo<DeviceName>
