/* eslint-disable */
const viewportSize = {width: 700, height: 460}
const throwException = true

var pages = {
  Default: 'https://applitools.github.io/demo/TestPages/FramesTestPage/',
  Acme: 'https://afternoon-savannah-68940.herokuapp.com/#',
  StickyHeader: 'https://applitools.github.io/demo/TestPages/PageWithHeader/index.html',
  Wix: 'https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html',
  ScrollableBody: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html',
  Simple: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html',
  FixedRegion: 'http://applitools.github.io/demo/TestPages/fixed-position',
  Modals: 'https://applitools.github.io/demo/TestPages/ModalsPage/index.html',
  HorizontalScroll: 'https://applitools.github.io/demo/TestPages/horizontal-scroll.html',
  FractionalMetric: 'https://applitools.github.io/demo/TestPages/FractionalMetrics',
  FrameLargerThenViewport: 'https://applitools.github.io/demo/TestPages/OutOfViewport/',
}

var tests = {
  // #region CHECK WINDOW

  CheckWindow: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
      ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckWindow_VG'}},
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindow_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check()
      eyes.close(throwException)
    },
  },
  CheckWindow_ManualScroll: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowAfterScroll'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowAfterScroll_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowAfterScroll_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      driver.executeScript('window.scrollBy(0, 350)')
      eyes.check()
      eyes.close(throwException)
    },
  },
  CheckWindowFully: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowFully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowFully_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowFully_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_Body: {
    page: 'ScrollableBody',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow_Body'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Body_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindow_Body_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'body', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_Html: {
    page: 'ScrollableBody',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow_Html'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Html_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindow_Html_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'html', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_Simple_Html: {
    page: 'Simple',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow_Simple_Html'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Simple_Html_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindow_Simple_Html_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'html', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindow_Double: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestDoubleCheckWindow'}},
      ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestDoubleCheckWindow_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestDoubleCheckWindow_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({name: 'first'})
      eyes.check({name: 'second'})
      eyes.close(throwException)
    },
  },
  CheckWindow_StickyHeaderPage: {
    page: 'StickyHeader',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Window'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Window_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckPageWithHeader_Window_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check()
      eyes.close(throwException)
    },
  },
  CheckWindowFully_StickyHeaderPage: {
    page: 'StickyHeader',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Window_Fully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Window_Fully_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckPageWithHeader_Window_Fully_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_ModalsPage: {
    page: 'Modals',
    config: {baselineName: 'TestScrollableContentInModal_Fully'},
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_scrollable_modal')
      eyes.check({scrollRootElement: '#scrollable_modal', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_HorizontalScrollPage: {
    page: 'HorizontalScroll',
    env: {browser: 'firefox'},
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestHorizonalScroll'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestHorizonalScroll_Scroll'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 400}})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },

  // #endregion

  // #region CHECK FRAME

  CheckFrame: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckFrame'}},
      ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckFrame_VG'}},
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrame'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFrame_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({frames: ['[name="frame1"]']})
      eyes.close(throwException)
    },
  },
  CheckFrameFully: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameFully_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameFully_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFrameFully_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({frames: ['[name="frame1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  CheckFrameInFrameFully: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameInFrame_Fully_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameInFrame_Fully_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFrameInFrame_Fully_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  CheckFrameInFrameFully_Double: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameInFrame_Fully_Fluent2'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameInFrame_Fully_Fluent2_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFrameInFrame_Fully_Fluent2_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({isFully: true})
      eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
      eyes.close(throwException)
    },
  },

  // #endregion

  // #region CHECK REGION

  CheckRegionBySelector: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckRegion'}},
      ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestCheckRegion_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckRegion_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({region: '#overflowing-div'})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_Image: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckRegion2'}},
      ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestCheckRegion2_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckRegion2_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({region: '#overflowing-div-image'})
      eyes.close(throwException)
    },
  },
  CheckRegion_FractionalMetrics: {
    page: 'FractionalMetric',
    config: {baselineName: 'CheckRegionWithFractionalMetrics'},
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
      eyes.check({region: '#target'})
      eyes.close()
    },
  },
  CheckRegionBySelector_ManualScroll: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.executeScript('window.scrollBy(0, 250)')
      eyes.check({region: '#centered'})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementFully_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementFully_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckElementFully_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckRegionByCoordinates: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinates_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinates_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionByCoordinates_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: {left: 50, top: 70, width: 90, height: 110}})
      eyes.close(throwException)
    },
  },
  CheckRegionByCoordinates_Overflowing: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: {left: 50, top: 110, width: 90, height: 550}})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_StickyHeaderPage: {
    page: 'StickyHeader',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Region'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Region_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckPageWithHeader_Region_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({region: 'div.page', isFully: false})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully_StickyHeaderPage: {
    page: 'StickyHeader',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Region_Fully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Region_Fully_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckPageWithHeader_Region_Fully_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({region: 'div.page', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_Fixed: {
    page: 'FixedRegion',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFixedRegion'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFixedRegion_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFixedRegion_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#fixed'})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_Modal: {
    page: 'Modals',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestSimpleModal'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestSimpleModal_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestSimpleModal_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_simple_modal')
      eyes.check({region: '#simple_modal > .modal-content'})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully_Fixed: {
    page: 'FixedRegion',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFixedRegion_Fully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFixedRegion_Fully_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFixedRegion_Fully_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#fixed', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully_ScrollableModal: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckScrollableModal'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckScrollableModal_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckScrollableModal_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click(driver.findElement('#centered').ref('element'))
      eyes.check({region: '#modal-content', scrollRootElement: '#modal1', isFully: true})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully_ScrollableModal_ModalsPage: {
    page: 'Modals',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestScrollableModal_Fully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestScrollableModal_Fully_Scroll'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_scrollable_modal')
      eyes.check({
        region: '#scrollable_modal > .modal-content',
        scrollRootElement: '#scrollable_modal',
        isFully: true,
      })
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorFully_ScrollableContentModal: {
    page: 'Modals',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestScrollableContentInModal_Fully'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestScrollableContentInModal_Fully_Scroll'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_scrollable_content_modal')
      eyes.check({
        region: '#scrollable_content_modal > .modal-content',
        scrollRootElement: '#scrollable_content_modal',
        isFully: true,
      })
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_Native: {
    features: ['native-selectors'],
    env: {
      device: 'Samsung Galaxy S8',
      app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk',
    },
    config: {baselineName: 'AppiumAndroidCheckRegion'},
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK'})
      eyes.check({region: 'android.widget.Button'})
      eyes.close(throwException)
    },
  },
  CheckRegionByCoordinatesInFrame: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        region: {left: 30, top: 40, width: 400, height: 1200},
        frames: ['[name="frame1"]'],
      })
      eyes.close(throwException)
    },
  },
  CheckRegionByCoordinatesInFrameFully: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        region: {left: 30, top: 40, width: 400, height: 1200},
        frames: ['[name="frame1"]'],
        isFully: true,
      })
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorInFrameFully: {
    page: 'Default',
    variants: {
      ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame'}},
      ClassicScroll: {config: {stitchMode: 'Scroll', check: 'classic', baselineName: 'TestCheckRegionInFrame_Scroll'}},
      ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckRegionInFrame_VG'}},
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionInFrame_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorInFrame_Overflowing: {
    page: 'Wix',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInAVeryBigFrame'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInAVeryBigFrame_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionInAVeryBigFrame_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      eyes.check({region: 'img', frames: ['[name="frame1"]']})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorInFrame_Overflowing_ManualSwitchToFrame: {
    features: ['webdriver'],
    page: 'Wix',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      driver.switchToFrame(driver.findElement('[name="frame1"]'))
      eyes.check({region: 'img'})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelectorInFrameFully_Overflowing: {
    page: 'FrameLargerThenViewport',
    config: {baselineName: 'CheckRegionInFrameLargerThenViewport'},
    variants: {
      CSS: {config: {stitchMode: 'CSS'}},
      Scroll: {config: {stitchMode: 'Scroll'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 800, height: 600}})
      eyes.check({
        region: '#list',
        scrollRootElement: 'body',
        frames: [{frame: 'frame-list', scrollRootElement: 'body'}],
        isFully: true,
      })
      eyes.close()
    },
  },

  // #endregion

  // #region CODED REGIONS

  CheckWindowFully_MultipleIgnoreRegionsBySelector: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['.ignore'], isFully: true})
      eyes.close(throwException)
    },
  },
  CheckWindow_FloatingRegionByCoordinates: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        floatingRegions: [
          {
            region: {left: 10, top: 10, width: 20, height: 10},
            maxUpOffset: 3,
            maxDownOffset: 3,
            maxLeftOffset: 20,
            maxRightOffset: 30,
          },
        ],
      })
      eyes.close(throwException)
    },
  },
  CheckWindow_FloatingRegionBySelector: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        floatingRegions: [
          {
            region: '#overflowing-div',
            maxUpOffset: 3,
            maxDownOffset: 3,
            maxLeftOffset: 20,
            maxRightOffset: 30,
          },
        ],
      })
      eyes.close(throwException)
    },
  },
  CheckWindow_IgnoreRegionBySelector: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#overflowing-div']})
      eyes.close(throwException)
    },
  },
  CheckWindow_IgnoreRegionBySelector_Centered: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreBySelector_Centered_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreBySelector_Centered_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithIgnoreBySelector_Centered_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#centered']})
      eyes.close(throwException)
    },
  },
  CheckWindow_IgnoreRegionBySelector_Stretched: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#stretched']})
      eyes.close(throwException)
    },
  },
  CheckWindowFully_IgnoreRegionByCoordinates: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.type(driver.findElement('input').ref('input'), 'My Input')
      eyes.check({
        ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
        isFully: true,
      })
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_IgnoreRegionBySelector_Outside: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div']})
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_IgnoreRegionBySelector_TheSame: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div-image']})
      eyes.close(throwException)
    },
  },
  CheckFrameFully_FloatingRegionByCoordinates: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionInFrame3_Fluent',
    },
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame3_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame3_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionInFrame3_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        frames: ['[name="frame1"]'],
        floatingRegions: [
          {
            region: {left: 25, top: 25, width: 25, height: 25},
            maxUpOffset: 200,
            maxDownOffset: 200,
            maxLeftOffset: 150,
            maxRightOffset: 150,
          },
        ],
        matchLevel: 'Layout',
        isFully: true,
      })
      eyes.close(throwException)
    },
  },
  CheckRegionBySelector_IgnoreRegionByCoordinates: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({
        region: '#overflowing-div',
        ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
      })
      eyes.close(throwException)
    },
  },

  // #endregion

  // #region CUSTOM

  AbortIfNotClosed: {
    variants: {
      '': {config: {vg: false}},
      VG: {config: {vg: true}},
    },
    test: ({driver, eyes}) => {
      driver.visit('data:text/html,<p>Test</p>')
      eyes.open({appName: 'Test Abort', viewportSize: {width: 1200, height: 800}})
      eyes.check()
      eyes.abort()
    },
  },
  AcmeLogin: {
    page: 'Acme',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestAcmeLogin'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestAcmeLogin_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestAcmeLogin_VG'}},
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - ACME', viewportSize: {width: 1024, height: 768}})
      driver.type(driver.findElement('#username').ref('username'), 'adamC')
      driver.type(driver.findElement('#password').ref('password'), 'MySecret123?')
      eyes.check({region: '#username'})
      eyes.check({region: '#password'})
      eyes.close(throwException)
    },
  },
  HideAndRestoreScrollbars: {
    page: 'Default',
    variants: {
      CSS: {config: {stitchMode: 'CSS', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent'}},
      Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent_Scroll'}},
      VG: {config: {vg: true, baselineName: 'TestScrollbarsHiddenAndReturned_Fluent_VG'}},
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({isFully: true})
      eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  VisualLocators: {
    variants: {
      '': {config: {vg: false, baselineName: 'TestVisualLocators'}},
      VG: {config: {vg: true, baselineName: 'TestVisualLocators_VG'}},
    },
    test: ({driver, eyes, assert}) => {
      driver.visit('default')
      eyes.open({appName: 'Applitools Eyes SDK'})
      const regionsMap = eyes
        .locate({locatorNames: ['applitools_title']})
        .type('Map<String, List<Region>>')
        .ref('regionsMap')
      eyes.close(false)
      assert.deepStrictEqual(regionsMap, {
        applitools_title: [{left: 2, top: 11, width: 173, height: 58}],
      })
    },
  },
  TooBigViewportSize: {
    env: {browser: 'chrome', headless: false},
    test: ({driver, eyes, assert}) => {
      eyes.open({
        appName: 'Eyes Selenium SDK - Fluent API',
        viewportSize: {width: 5000, height: 5000},
      })
      const cachedViewportSize = eyes.getViewportSize().ref('cachedViewportSize')
      const expectedViewportSize = driver
        .executeScript('return {height: window.innerHeight, width: window.innerWidth}')
        .type('Map<String, Number>')
        .ref('expectedViewportSize')
      assert.strictEqual(cachedViewportSize.getWidth(), expectedViewportSize.width)
      assert.strictEqual(cachedViewportSize.getHeight(), expectedViewportSize.height)
      eyes.close(false)
    },
  },
  SetViewportSize: {
    variants: {
      '': {env: {browser: 'chrome'}},
      Edge: {env: {browser: 'edge-18'}},
    },
    test: ({driver, eyes, assert}) => {
      const expectedViewportSize = {width: 600, height: 600}
      eyes.constructor.setViewportSize(expectedViewportSize)
      const actualViewportSize = driver
        .executeScript('return {width: window.innerWidth, height: window.innerHeight}')
        .type('Map<String, Number>')
        .ref('actualViewportSize')
      assert.deepStrictEqual(actualViewportSize, expectedViewportSize)
    },
  },
  RefreshStaleScrollRootElementAfterPageReload: {
    test: ({driver, eyes}) => {
      driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
      eyes.check()
      driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
      eyes.check()
      eyes.close()
    },
  },
  CheckStaleElement: {
    features: ['webdriver'],
    test: ({driver, eyes, assert}) => {
      driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
      const element = driver.findElement('#inner-img')
      driver.click('#invalidate-button')
      assert.throws(
        () => eyes.check({region: element}),
        error => driver.constructor.isStaleElementError(error),
      )
      eyes.close(false)
    },
  },
  CheckRefreshableElement: {
    features: ['webdriver'],
    test: ({driver, eyes}) => {
      driver.visit('http://localhost:5000/TestPages/RefreshDomPage/auto-refresh')
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
      const element = driver.findElement('#inner-img')
      driver.click('#refresh-button')
      eyes.check({region: element})
      eyes.close()
    },
  },
  CheckRefreshableElementInsideFrame: {
    features: ['webdriver'],
    test: ({driver, eyes}) => {
      driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage/iframe')
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
      const frameElement = driver.findElement('[name="frame"]').ref('frameElement')
      driver.switchToFrame(frameElement)
      const element = driver.findElement('#inner-img')
      driver.click('#refresh-button')
      driver.switchToFrame(null)

      eyes.check({frames: [frameElement], region: element})
      eyes.close()
    },
  },
  TestGetAllTestResults: {
    test: ({eyes, assert}) => {
      eyes.open({appName: 'Applitools Eyes SDK'})
      assert.throws(() => eyes.close())
      eyes.runner.getAllTestResults(false)
    },
  },

  // #endregion
}
