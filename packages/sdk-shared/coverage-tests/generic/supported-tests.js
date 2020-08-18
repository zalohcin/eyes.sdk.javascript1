module.exports = {
  // #region CHECK WINDOW

  TestCheckWindow: [
    {config: {vg: true}, disabled: true},
    {config: {vg: true, check: 'classic'}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckWindowAfterScroll: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowFully: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindow_Body: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS', branchName: 'v2'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindow_Html: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindow_Simple_Html: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestDoubleCheckWindow: [
    {config: {vg: true, check: 'classic'}, disabled: true},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckPageWithHeader_Window: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckPageWithHeader_Window_Fully: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestWindowWithModal_Fully: [{config: {stitchMode: 'Scroll'}}],
  TestHorizonalScroll: [{config: {stitchMode: 'CSS'}}, {config: {stitchMode: 'Scroll'}}],

  // #endregion

  // #region CHECK FRAME

  TestCheckFrame: [
    {config: {vg: true, branchName: 'v2'}, disabled: true},
    {config: {vg: true, check: 'classic'}},
    {config: {stitchMode: 'CSS', branchName: 'v2'}},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll', branchName: 'v2'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckFrameFully_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckFrameInFrame_Fully_Fluent: [
    {config: {vg: true, branchName: 'v1'}},
    {config: {stitchMode: 'CSS', branchName: 'v1'}},
    {config: {stitchMode: 'Scroll', branchName: 'v1'}},
  ],
  TestCheckFrameInFrame_Fully_Fluent2: [
    {config: {vg: true, branchName: 'v2'}},
    {config: {stitchMode: 'CSS', branchName: 'v2'}},
    {config: {stitchMode: 'Scroll', branchName: 'v2'}},
  ],

  // #endregion

  // #region CHECK REGION

  TestCheckRegion: [
    {config: {vg: true, check: 'classic'}},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckRegion2: [
    {config: {vg: true, check: 'classic'}},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckElementFully_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckRegionByCoordinates_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckOverflowingRegionByCoordinates_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestCheckRegionBySelectorAfterManualScroll_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  CheckRegionWithFractionalMetrics: [{config: {stitchMode: 'Scroll'}}],
  TestCheckPageWithHeader_Region: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckPageWithHeader_Region_Fully: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestCheckFixedRegion: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckFixedRegion_Fully: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestSimpleModal: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckScrollableModal: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestScrollableModal_Fully: [{config: {stitchMode: 'CSS'}}, {config: {stitchMode: 'Scroll'}}],
  TestScrollableContentInModal_Fully: [
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  AppiumAndroidCheckRegion: [{}],
  TestCheckRegionByCoordinateInFrame_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestCheckRegionByCoordinateInFrameFully_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckRegionInFrame: [
    {config: {vg: true}},
    {config: {vg: true, check: 'classic'}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'CSS', check: 'classic'}},
    {config: {stitchMode: 'Scroll'}},
    {config: {stitchMode: 'Scroll', check: 'classic'}},
  ],
  TestCheckRegionInAVeryBigFrame: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}, disabled: true},
  ],
  CheckRegionInFrameLargerThenViewport: [
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],

  // #endregion

  // #region CODED REGIONS

  TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithFloatingByRegion_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithFloatingBySelector_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithIgnoreBySelector_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithIgnoreBySelector_Centered_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckWindowWithIgnoreRegion_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckElementWithIgnoreRegionBySameElement_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckRegionInFrame3_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestCheckRegionWithIgnoreRegion_Fluent: [
    {config: {vg: true}, disabled: true},
    {config: {stitchMode: 'CSS'}, disabled: true},
    {config: {stitchMode: 'Scroll'}},
  ],

  // #endregion

  // #region CUSTOM

  TestAbortIfNotClosed: [{config: {vg: true}}, {config: {vg: false}}],
  TestAcmeLogin: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestScrollbarsHiddenAndReturned_Fluent: [
    {config: {vg: true}},
    {config: {stitchMode: 'CSS'}},
    {config: {stitchMode: 'Scroll'}},
  ],
  TestVisualLocators: [{config: {vg: true}}, {config: {vg: false}}],
  TestTooBigViewportSize: [{}],
  TestSetViewportSize: [{env: {browser: 'chrome'}}, {env: {browser: 'edge-18'}}],
  RefreshStaleScrollRootElementAfterPageReload: [{}],
  CheckStaleElement: [{}],
  CheckRefreshableElement: [{}],
  CheckRefreshableElementInsideFrame: [{}],
  TestGetAllTestResults: [{}],

  // #endregion
}
