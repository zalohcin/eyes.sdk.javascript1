interface Selector {
    css: string,
}

interface RegionCoordinates {
    left: number,
    top: number,
    width: number,
    height: number,
}

interface FloatingRegion {
    target: RegionCoordinates | Selector | number,
    maxUp: number,
    maxDown: number,
    maxLeft: number,
    maxRight: number,
}

namespace Commands {
  interface Abort {
      (): Promise<any> 
  }

  interface CheckFrame {
      (target: Selector | Array<Selector>, options: { isClassicApi?: boolean, isFully?: boolean }): Promise<any>
  }

  interface CheckRegion {
      (
          target: Selector | Array<Selector> | RegionCoordinates,
          options: {
              isClassicApi?: boolean,
              isFully?: boolean,
              inFrame: Selector,
              ignoreRegion: Selector | RegionCoordinates
          }
      ): Promise<any>
  }

  interface CheckWindow {
      (options: {
          isClassicApi?: boolean,
          isFully?: boolean,
          ignoreRegion?: Selector | RegionCoordinates
          floatingRegion?: FloatingRegion
          scrollRootElement?: Selector
      }): Promise<any>
  }

  interface Close {
      (options: { throwsException?: boolean }) : Promise<any>
  }

  interface Open {
      (options: {appName: string, viewportSize: string}): Promise<any>
  }

  interface ScrollDown {
      (pixes: number): Promise<any>
  }

  interface SwitchToFrame {
      (selector: Selector): Promise<any>
  }

  interface Type {
      (selector: Selector, inputText: string): Promise<any>
  }

  interface Visit {
      (url: string): Promise<any>
  }
}
