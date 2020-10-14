module.exports = {
  // #region CHECK WINDOW

  TestCheckWindow: {
    ClassicVG: {skip: true},
    VG: {skip: true},
  },
  TestCheckWindow_Body: {
    CSS: {config: {branchName: 'v2'}},
  },
  TestDoubleCheckWindow: {
    ClassicVG: {skip: true},
  },
  TestCheckPageWithHeader_Window_Fully: {
    Scroll: {skip: true},
  },

  // #endregion

  // #region CHECK FRAME

  TestCheckFrame: {
    VG: {config: {branchName: 'v2'}, skip: true},
    CSS: {config: {branchName: 'v2'}},
    Scroll: {config: {branchName: 'v2'}},
  },
  TestCheckFrameFully_Fluent: {
    VG: {skip: true},
    CSS: {skip: true},
  },
  TestCheckFrameInFrame_Fully_Fluent: {
    VG: {config: {branchName: 'v1'}},
    CSS: {config: {branchName: 'v1'}},
    Scroll: {config: {branchName: 'v1'}},
  },
  TestCheckFrameInFrame_Fully_Fluent2: {
    VG: {config: {branchName: 'v2'}},
    CSS: {config: {branchName: 'v2'}},
    Scroll: {config: {branchName: 'v2'}},
  },

  // #endregion

  // #region CHECK REGION

  TestCheckOverflowingRegionByCoordinates_Fluent: {
    CSS: {skip: true},
    Scroll: {skip: true},
  },
  TestCheckRegionBySelectorAfterManualScroll_Fluent: {
    Scroll: {skip: true},
  },
  TestCheckPageWithHeader_Region_Fully: {
    CSS: {skip: true},
    Scroll: {skip: true},
  },
  TestCheckScrollableModal: {
    VG: {skip: true},
    CSS: {skip: true},
    Scroll: {skip: true},
  },
  TestCheckRegionByCoordinateInFrame_Fluent: {
    CSS: {skip: true},
    Scroll: {skip: true},
  },
  TestCheckRegionByCoordinateInFrameFully_Fluent: {
    CSS: {skip: true},
  },
  TestCheckRegionInAVeryBigFrame: {
    Scroll: {skip: true},
  },
  TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: {
    Scroll: {skip: true},
  },

  // #endregion

  // #region CODED REGIONS

  TestCheckWindowWithFloatingByRegion_Fluent: {
    VG: {skip: true},
  },
  TestCheckWindowWithFloatingBySelector_Fluent: {
    VG: {skip: true},
  },
  TestCheckWindowWithIgnoreBySelector_Fluent: {
    VG: {skip: true},
  },
  TestCheckWindowWithIgnoreBySelector_Centered_Fluent: {
    VG: {skip: true},
  },
  TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: {
    VG: {skip: true},
  },
  TestCheckRegionInFrame3_Fluent: {
    VG: {skip: true},
    CSS: {skip: true},
  },
  TestCheckRegionWithIgnoreRegion_Fluent: {
    VG: {skip: true},
    CSS: {skip: true},
  },

  // #endregion

  // #region CUSTOM

  // #endregion
}
