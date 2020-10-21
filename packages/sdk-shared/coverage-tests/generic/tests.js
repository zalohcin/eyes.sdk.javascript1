/* eslint-disable */

const viewportSize = {width: 700, height: 460}
const throwException = true

config({
  pages: {
    Default: 'https://applitools.github.io/demo/TestPages/FramesTestPage/',
    Acme: 'https://afternoon-savannah-68940.herokuapp.com/#',
    StickyHeader: 'https://applitools.github.io/demo/TestPages/PageWithHeader/index.html',
    Wix: 'https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html',
    ScrollableBody: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html',
    Simple: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html',
    FixedRegion: 'http://applitools.github.io/demo/TestPages/fixed-position',
    Modals: 'https://applitools.github.io/demo/TestPages/ModalsPage/index.html',
    HorizontalScroll: 'https://applitools.github.io/demo/TestPages/horizontal-scroll.html',
    BurgerMenu: 'http://applitools.github.io/demo/TestPages/PageWithBurgerMenu',
    FractionalMetric: 'https://applitools.github.io/demo/TestPages/FractionalMetrics',
    FrameLargerThenViewport: 'https://applitools.github.io/demo/TestPages/OutOfViewport/',
    StickyHeaderWithRegions: 'https://applitools.github.io/demo/TestPages/StickyHeaderWithRegions',
    JsLayout: 'https://applitools.github.io/demo/TestPages/JsLayout'
  },
})

// #region CHECK WINDOW

test('CheckWindow', {
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
})

test('CheckWindow_ManualScroll', {
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
})

test('CheckWindow_ManualScrollToTheEnd', {
  // should work on buggy safari version
  page: 'Default',
  features: ['webdriver'],
  variants: {
    Safari11: {env: {browser: 'safari-11', legacy: true}},
    Safari12: {env: {browser: 'safari-12', legacy: true}}
  },
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK', viewportSize})
    driver.executeScript('window.scrollTo(0, 9999)')
    eyes.check()
    eyes.close()
  },
})

test('CheckWindowFully', {
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
})

test('CheckWindowFully_IgnoreDisplacements', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestIgnoreDisplacements'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestIgnoreDisplacements_Scroll'}},
    VG: {config: {vg: true, baselineName: 'TestIgnoreDisplacements_VG'}},
  },
  test: ({eyes, assert, helpers}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true, ignoreDisplacements: true})
    const result = eyes.close(false).ref('result')
    const info = helpers.getTestInfo(result).ref('info')
    assert.strictEqual(info.actualAppOutput[0].imageMatchSettings.ignoreDisplacements, true)
  },
})

test('CheckWindowFully_Body', {
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
})

test('CheckWindowFully_Html', {
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
})

test('CheckWindowFully_Simple_Html', {
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
})

test('CheckWindow_Double', {
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
})

test('CheckWindow_StickyHeaderPage', {
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
})

test('CheckWindowFully_StickyHeaderPage', {
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
})

test('CheckWindowFully_ModalsPage', {
  page: 'Modals',
  config: {baselineName: 'TestWindowWithModal_Fully_Scroll'},
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_modal')
    eyes.check({scrollRootElement: '#scrollable_modal', isFully: true})
    eyes.close(throwException)
  },
})

test('CheckWindowFully_HorizontalScrollPage', {
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
})

test('CheckWindowFully_BurgerMenu', {
  page: 'BurgerMenu',
  config: {stitchMode: 'CSS', baselineName: 'CheckPageWithBurgerMenuFully'},
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true})
    eyes.close(throwException)
  }
})

// #endregion

// #region CHECK FRAME

test('CheckFrame', {
  page: 'Default',
  variants: {
    ClassicCSS: {config: {check: 'classic', stitchMode: 'CSS', baselineName: 'TestCheckFrame', appName: 'Eyes Selenium SDK - Classic API'}},
    ClassicScroll: {config: {check: 'classic', stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Scroll', appName: 'Eyes Selenium SDK - Classic API'}},
    ClassicVG: {config: {check: 'classic', vg: true, baselineName: 'TestCheckFrame_VG', appName: 'Eyes Selenium SDK - Classic API'}},
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrame_Fluent', appName: 'Eyes Selenium SDK - Fluent API'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Fluent_Scroll', appName: 'Eyes Selenium SDK - Fluent API'}},
    VG: {config: {vg: true, baselineName: 'TestCheckFrame_VG', appName: 'Eyes Selenium SDK - Classic API'}},
  },
  test: ({eyes}) => {
    eyes.open({viewportSize})
    eyes.check({frames: ['[name="frame1"]']})
    eyes.close(throwException)
  },
})

test('CheckFrameFully', {
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
})

test('CheckFrameInFrameFully', {
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
})

test('CheckFrameInFrameFully_Double', {
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
})

// #endregion

// #region CHECK REGION

test('CheckRegionBySelector', {
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
})

test('CheckRegionBySelector_Image', {
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
})

test('CheckRegion_FractionalMetrics', {
  page: 'FractionalMetric',
  config: {baselineName: 'CheckRegionWithFractionalMetrics'},
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({region: '#target'})
    eyes.close()
  },
})

test('CheckRegionBySelector_ManualScroll', {
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
})

test('CheckRegionBySelectorFully', {
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
})

test('CheckRegionByCoordinates', {
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
})

test('CheckRegionByCoordinates_Overflowing', {
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
})

test('CheckRegionBySelector_StickyHeaderPage', {
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
})

test('CheckRegionBySelectorFully_StickyHeaderPage', {
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
})

test('CheckRegionBySelector_Fixed', {
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
})

test('CheckRegionBySelector_Modal', {
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
})

test('CheckRegionBySelectorFully_Fixed', {
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
})

test('CheckRegionBySelectorFully_ScrollableModal', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckScrollableModal'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckScrollableModal_Scroll'}},
    VG: {config: {vg: true, baselineName: 'TestCheckScrollableModal_VG'}},
  },
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#centered')
    eyes.check({region: '#modal-content', scrollRootElement: '#modal1', isFully: true})
    eyes.close(throwException)
  },
})

test('CheckRegionBySelectorFully_ScrollableModal_ModalsPage', {
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
})

test('CheckRegionBySelectorFully_ScrollableContentModal', {
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
})

test('CheckRegionBySelector_Native', {
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
})

test('CheckRegionByElement_Hover', {
  page: 'StickyHeaderWithRegions',
  config: {hideScrollbars: false},
  variants: {
    CSS: {config: {stitchMode: 'CSS'}},
    Scroll: {config: {stitchMode: 'Scroll'}},
  },
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const input = driver.findElement('#input').ref('input')
    driver.scrollIntoView(input)
    driver.hover(input)
    eyes.check({region: input})
    eyes.close()
  }
})

test('CheckRegionByCoordinatesInFrame', {
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
})

test('CheckRegionByCoordinatesInFrameFully', {
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
})

test('CheckRegionBySelectorInFrameFully', {
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
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
    eyes.close(throwException)
  },
})

test('CheckRegionBySelectorInFrameInFrameFully', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrameInFrame_Fluent'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrameInFrame_Fluent_Scroll'}},
  },
  test: ({eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['frame1', 'frame1-1'],
      region: {type: 'css', selector: 'img'},
      isFully: true,
    })
    eyes.close()
  }
})

test('CheckRegionBySelectorInFrame_Overflowing', {
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
})

test('CheckRegionBySelectorInFrame_Overflowing_ManualSwitchToFrame', {
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
})

test('CheckRegionBySelectorInFrameFully_Overflowing', {
  page: 'FrameLargerThenViewport',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'CheckRegionInFrameLargerThenViewport'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'CheckRegionInFrameLargerThenViewport_Scroll'}},
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
})

// #endregion

// #region CODED REGIONS

test('CheckWindowFully_MultipleIgnoreRegionsBySelector', {
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
})

test('CheckWindow_FloatingRegionByCoordinates', {
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
})

test('CheckWindow_FloatingRegionBySelector', {
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
})

test('CheckWindow_IgnoreRegionBySelector', {
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
})

test('CheckWindow_IgnoreRegionBySelector_Centered', {
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
})

test('CheckWindow_IgnoreRegionBySelector_Stretched', {
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
})

test('CheckWindowFully_IgnoreRegionByCoordinates', {
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
})

test('CheckRegionBySelector_IgnoreRegionBySelector_Outside', {
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
})

test('CheckRegionBySelector_IgnoreRegionBySelector_TheSame', {
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
})

test('CheckFrameFully_FloatingRegionByCoordinates', {
  page: 'Default',
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
})

test('CheckRegionBySelector_IgnoreRegionByCoordinates', {
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
})

test('CheckWindow_AccessibilityRegionByElement', {
  page: 'Default',
  config: {
    defaultMatchSettings: {
      accessibilitySettings: {level: 'AAA', guidelinesVersion: 'WCAG_2_0'}
    }
  },
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestAccessibilityRegions'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestAccessibilityRegions_Scroll'}},
    VG: {config: {vg: true, baselineName: 'TestAccessibilityRegions_VG'}},
  },
  test: ({driver, eyes, assert, helpers}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    const accessibilityRegions = driver.findElements({type: 'css', selector: '.ignore'}).ref('accessibilityRegions')
    eyes.check({
      accessibilityRegions: [
        {region: accessibilityRegions[0], type: 'LargeText'},
        {region: accessibilityRegions[1], type: 'LargeText'},
        {region: accessibilityRegions[2], type: 'LargeText'},
      ]
    })
    const result = eyes.close().ref('results')

    const info = helpers.getTestInfo(result).ref('info')
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    assert.strictEqual(imageMatchSettings.accessibilitySettings.level, 'AAA')
    assert.strictEqual(imageMatchSettings.accessibilitySettings.version, 'WCAG_2_0')
    const expectedAccessibilityRegions = [
      {isDisabled: false, type: 'LargeText', left: 10, top: 284, width: 800, height: 500},
      {isDisabled: false, type: 'LargeText', left: 122, top: 928, width: 456, height: 306},
      {isDisabled: false, type: 'LargeText', left: 8, top: 1270, width: 690, height: 206},
    ]
    assert.strictEqual(imageMatchSettings.accessibility.length, expectedAccessibilityRegions.length)
    for (const [index, accessibilityRegion] of imageMatchSettings.accessibility.entries()) {
      assert.deepStrictEqual(accessibilityRegion, expectedAccessibilityRegions[index])
    }
  }
})

// #endregion

// #region CUSTOM

test('AbortIfNotClosed', {
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
})

test('AcmeLogin', {
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
})

test('HideAndRestoreScrollbars', {
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
})

test('VisualLocators', {
  page: 'Default',
  variants: {
    '': {config: {vg: false, baselineName: 'TestVisualLocators'}},
    VG: {config: {vg: true, baselineName: 'TestVisualLocators_VG'}},
  },
  test: ({eyes, assert}) => {
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
})

test('TooBigViewportSize', {
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
})

test('SetViewportSize', {
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
})

test('RefreshStaleScrollRootElementAfterPageReload', {
  test: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    eyes.check()
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.check()
    eyes.close()
  },
})

test('CheckStaleElement', {
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
})

test('CheckRefreshableElement', {
  skip: true,
  features: ['webdriver'],
  test: ({driver, eyes}) => {
    driver.visit('http://localhost:5000/TestPages/RefreshDomPage/auto-refresh')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    const element = driver.findElement('#inner-img')
    driver.click('#refresh-button')
    eyes.check({region: element})
    eyes.close()
  },
})

test('CheckRefreshableElementInsideFrame', {
  skip: true,
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
})

test('TestGetAllTestResults', {
  test: ({eyes, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    assert.throws(() => eyes.close())
    eyes.runner.getAllTestResults(false)
  },
})

test('JsLayoutBreakpoints', {
  page: 'JsLayout',
  config: {
    vg: true,
    browsersInfo: [
      {name: 'chrome', width: 1000, height: 800},
      {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
      {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
    ],
  },
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({layoutBreakpoints: [500, 1000],})
    eyes.close()
  }
})

test('JsLayoutBreakpoints_Config', {
  page: 'JsLayout',
  config: {
    vg: true,
    browsersInfo: [
      {name: 'chrome', width: 1000, height: 800},
      {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
      {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
    ],
    layoutBreakpoints: [500, 1000],
  },
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check()
    eyes.close()
  }
})

test('CheckLongIframeModal', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckLongIFrameModal'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckLongIFrameModal_Scroll'}},
    VG: {config: {vg: true, baselineName: 'TestCheckLongIFrameModal_VG'}},
  },
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click({type: 'css', selector: '#stretched'})
    const regions = [
      {left: 0, top: 0, width: 400, height: 5000},
      {left: 0, top: 5000, width: 400, height: 5000},
      {left: 0, top: 10000, width: 400, height: 5000},
      {left: 0, top: 15000, width: 400, height: 5000},
      {left: 0, top: 20000, width: 400, height: 2818}
    ]
    for (const region of regions) {
      eyes.check({
        scrollRootElement: '#modal2',
        frames: [{type: 'css', selector: '#modal2 iframe'}],
        region,
        isFully: true,
      })
    }
    eyes.close()
  }
})

test('CheckLongOutOfBoundsIframeModal', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckLongOutOfBoundsIFrameModal'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckLongOutOfBoundsIFrameModal_Scroll'}},
    VG: {config: {vg: true, baselineName: 'TestCheckLongOutOfBoundsIFrameModal_VG'}},
  },
  test: ({driver, eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click({type: 'css', selector: '#hidden_click'})
    const regions = [
      {left: 0, top: 0, width: 400, height: 5000},
      {left: 0, top: 5000, width: 400, height: 5000},
      {left: 0, top: 10000, width: 400, height: 5000},
      {left: 0, top: 15000, width: 400, height: 5000},
      {left: 0, top: 20000, width: 400, height: 2818}
    ]
    for (const region of regions) {
      eyes.check({
        scrollRootElement: '#modal3',
        frames: [{type: 'css', selector: '#modal3 iframe'}],
        region,
        isFully: true,
      })
    }
    eyes.close()
  }
})

test('CheckRegionInFrame_Multiple', {
  page: 'Default',
  variants: {
    CSS: {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame2_Fluent'}},
    Scroll: {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame2_Fluent_Scroll'}},
  },
  test: ({eyes}) => {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      ignoreRegions: [
        {left: 50, top: 50, width: 100, height: 100},
        {left: 70, top: 170, width: 90, height: 90},
      ],
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      isFully: true,
      timeout: 5000
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      floatingRegions: [{left: 200, top: 200, width: 150, height: 150}],
      isFully: true,
      matchLevel: 'Layout'
    })
    eyes.close()
  }
})

// #endregion
