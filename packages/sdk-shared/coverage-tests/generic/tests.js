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
  Modal: 'https://applitools.github.io/demo/TestPages/ModalsPage/index.html',
  HorizontalScroll: 'https://applitools.github.io/demo/TestPages/horizontal-scroll.html',
  FractionalMetric: 'https://applitools.github.io/demo/TestPages/FractionalMetrics',
  FrameLargerThenViewport: 'https://applitools.github.io/demo/TestPages/OutOfViewport/',
}

var tests = {
  // #region CHECK WINDOW

  TestCheckWindow: {
    page: 'Default',
    config: {baselineName: 'TestCheckWindow'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check()
      eyes.close(throwException)
    },
  },
  TestCheckWindowAfterScroll: {
    page: 'Default',
    config: {baselineName: 'TestCheckWindowAfterScroll'},
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      driver.executeScript('window.scrollBy(0, 350)')
      eyes.check()
      eyes.close(throwException)
    },
  },
  TestCheckWindowFully: {
    page: 'Default',
    config: {baselineName: 'TestCheckWindowFully'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckWindow_Body: {
    page: 'ScrollableBody',
    config: {baselineName: 'TestCheckWindow_Body'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'body', isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckWindow_Html: {
    page: 'ScrollableBody',
    config: {baselineName: 'TestCheckWindow_Html'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'html', isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckWindow_Simple_Html: {
    page: 'Simple',
    config: {baselineName: 'TestCheckWindow_Simple_Html'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      eyes.check({scrollRootElement: 'html', isFully: true})
      eyes.close(throwException)
    },
  },
  TestDoubleCheckWindow: {
    page: 'Default',
    config: {
      baselineName: 'TestDoubleCheckWindow',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({name: 'first'})
      eyes.check({name: 'second'})
      eyes.close(throwException)
    },
  },
  TestCheckPageWithHeader_Window: {
    page: 'StickyHeader',
    config: {
      baselineName: 'TestCheckPageWithHeader_Window',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check()
      eyes.close(throwException)
    },
  },
  TestCheckPageWithHeader_Window_Fully: {
    page: 'StickyHeader',
    config: {
      baselineName: 'TestCheckPageWithHeader_Window_Fully',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  TestWindowWithModal_Fully: {
    page: 'Modals',
    config: {
      baselineName: 'TestScrollableContentInModal_Fully',
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_scrollable_modal')
      eyes.check({scrollRootElement: '#scrollable_modal', isFully: true})
      eyes.close(throwException)
    },
  },
  TestHorizonalScroll: {
    page: 'HorizontalScroll',
    env: {browser: 'firefox'},
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 400}})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },

  // #endregion

  // #region CHECK FRAME

  TestCheckFrame: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckFrame',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({frames: ['[name="frame1"]']})
      eyes.close(throwException)
    },
  },
  TestCheckFrameFully_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckFrameFully_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({frames: ['[name="frame1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckFrameInFrame_Fully_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckFrameInFrame_Fully_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckFrameInFrame_Fully_Fluent2: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckFrameInFrame_Fully_Fluent2',
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

  TestCheckRegion: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegion',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({region: '#overflowing-div'})
      eyes.close(throwException)
    },
  },
  TestCheckRegion2: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegion2',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      eyes.check({region: '#overflowing-div-image'})
      eyes.close(throwException)
    },
  },
  TestCheckElementFully_Fluent: {
    page: 'Default',
    config: {baselineName: 'TestCheckElementFully_Fluent'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckRegionByCoordinates_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionByCoordinates_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: {left: 50, top: 70, width: 90, height: 110}})
      eyes.close(throwException)
    },
  },
  TestCheckOverflowingRegionByCoordinates_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: {left: 50, top: 110, width: 90, height: 550}})
      eyes.close(throwException)
    },
  },
  TestCheckRegionBySelectorAfterManualScroll_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent',
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.executeScript('window.scrollBy(0, 250)')
      eyes.check({region: '#centered'})
      eyes.close(throwException)
    },
  },
  CheckRegionWithFractionalMetrics: {
    page: 'FractionalMetric',
    config: {baselineName: 'CheckRegionWithFractionalMetrics'},
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
      eyes.check({region: '#target'})
      eyes.close()
    },
  },
  TestCheckPageWithHeader_Region: {
    page: 'StickyHeader',
    config: {
      baselineName: 'TestCheckPageWithHeader_Region',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({region: 'div.page', isFully: false})
      eyes.close(throwException)
    },
  },
  TestCheckPageWithHeader_Region_Fully: {
    page: 'StickyHeader',
    config: {
      baselineName: 'TestCheckPageWithHeader_Region_Fully',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      eyes.check({region: 'div.page', isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckFixedRegion: {
    page: 'FixedRegion',
    config: {
      baselineName: 'TestCheckFixedRegion',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#fixed'})
      eyes.close(throwException)
    },
  },
  TestSimpleModal: {
    page: 'Modals',
    config: {
      baselineName: 'TestSimpleModal',
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click('#open_simple_modal')
      eyes.check({region: '#simple_modal > .modal-content'})
      eyes.close(throwException)
    },
  },
  TestCheckFixedRegion_Fully: {
    page: 'FixedRegion',
    config: {
      baselineName: 'TestCheckFixedRegion_Fully',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#fixed', isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckScrollableModal: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckScrollableModal',
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      driver.click(driver.findElement('#centered').ref('element'))
      eyes.check({region: '#modal-content', scrollRootElement: '#modal1', isFully: true})
      eyes.close(throwException)
    },
  },
  TestScrollableModal_Fully: {
    page: 'Modals',
    config: {
      baselineName: 'TestScrollableModal_Fully',
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
  TestScrollableContentInModal_Fully: {
    page: 'Modals',
    config: {
      baselineName: 'TestScrollableContentInModal_Fully',
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
  AppiumAndroidCheckRegion: {
    env: {
      device: 'Samsung Galaxy S8',
      app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk',
    },
    features: ['native-selectors'],
    config: {baselineName: 'AppiumAndroidCheckRegion'},
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK'})
      eyes.check({region: 'android.widget.Button'})
      eyes.close(throwException)
    },
  },

  TestCheckRegionByCoordinateInFrame_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent',
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
  TestCheckRegionByCoordinateInFrameFully_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent',
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
  TestCheckRegionInFrame: {
    page: 'Default',
    config: {baselineName: 'TestCheckRegionInFrame'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckRegionInAVeryBigFrame: {
    page: 'Wix',
    config: {
      baselineName: 'TestCheckRegionInAVeryBigFrame',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      eyes.check({region: 'img', frames: ['[name="frame1"]']})
      eyes.close(throwException)
    },
  },
  TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: {
    features: ['webdriver'],
    page: 'Wix',
    config: {
      baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame',
    },
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      driver.switchToFrame(driver.findElement('[name="frame1"]'))
      eyes.check({region: 'img'})
      eyes.close(throwException)
    },
  },
  CheckRegionInFrameLargerThenViewport: {
    page: 'FrameLargerThenViewport',
    config: {baselineName: 'CheckRegionInFrameLargerThenViewport'},
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

  TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['.ignore'], isFully: true})
      eyes.close(throwException)
    },
  },
  TestCheckWindowWithFloatingByRegion_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent',
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
  TestCheckWindowWithFloatingBySelector_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent',
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
  TestCheckWindowWithIgnoreBySelector_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#overflowing-div']})
      eyes.close(throwException)
    },
  },
  TestCheckWindowWithIgnoreBySelector_Centered_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithIgnoreBySelector_Centered_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#centered']})
      eyes.close(throwException)
    },
  },
  TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({ignoreRegions: ['#stretched']})
      eyes.close(throwException)
    },
  },
  TestCheckWindowWithIgnoreRegion_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent',
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

  TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div']})
      eyes.close(throwException)
    },
  },
  TestCheckElementWithIgnoreRegionBySameElement_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div-image']})
      eyes.close(throwException)
    },
  },
  TestCheckRegionInFrame3_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionInFrame3_Fluent',
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
  TestCheckRegionWithIgnoreRegion_Fluent: {
    page: 'Default',
    config: {
      baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent',
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

  TestAbortIfNotClosed: ({driver, eyes}) => {
    driver.visit('data:text/html,<p>Test</p>')
    eyes.open({appName: 'Test Abort', viewportSize: {width: 1200, height: 800}})
    eyes.check()
    eyes.abort()
  },
  TestAcmeLogin: {
    name: 'AcmeLogin',
    page: 'Acme',
    config: {baselineName: 'TestAcmeLogin'},
    test: ({driver, eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - ACME', viewportSize: {width: 1024, height: 768}})
      driver.type(driver.findElement('#username').ref('username'), 'adamC')
      driver.type(driver.findElement('#password').ref('password'), 'MySecret123?')
      eyes.check({region: '#username'})
      eyes.check({region: '#password'})
      eyes.close(throwException)
    },
  },
  TestScrollbarsHiddenAndReturned_Fluent: {
    page: 'Default',
    config: {baselineName: 'TestScrollbarsHiddenAndReturned_Fluent'},
    test: ({eyes}) => {
      eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      eyes.check({isFully: true})
      eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
      eyes.check({isFully: true})
      eyes.close(throwException)
    },
  },
  TestVisualLocators: ({driver, eyes, assert}) => {
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
  TestTooBigViewportSize: {
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
  TestSetViewportSize: ({driver, eyes, assert}) => {
    const expectedViewportSize = {width: 600, height: 600}
    eyes.constructor.setViewportSize(expectedViewportSize)
    const actualViewportSize = driver
      .executeScript('return {width: window.innerWidth, height: window.innerHeight}')
      .type('Map<String, Number>')
      .ref('actualViewportSize')
    assert.deepStrictEqual(actualViewportSize, expectedViewportSize)
  },
  RefreshStaleScrollRootElementAfterPageReload: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    eyes.check()
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.check()
    eyes.close()
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
  TestGetAllTestResults: ({eyes, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    assert.throws(() => eyes.close())
    eyes.runner.getAllTestResults(false)
  },

  // #endregion
}
