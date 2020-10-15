module.exports = {
  CheckWindow: {
    variants: {
      ClassicVG: {skip: true},
      VG: {skip: true},
    },
  },
  CheckWindowFully_Body: {
    variants: {
      CSS: {config: {branchName: 'v2'}},
    },
  },
  CheckWindow_Double: {
    variants: {
      ClassicVG: {skip: true},
    },
  },
  CheckWindowFully_StickyHeaderPage: {
    variants: {
      Scroll: {skip: true},
    },
  },
  CheckFrame: {
    variants: {
      VG: {config: {branchName: 'v2'}, skip: true},
      CSS: {config: {branchName: 'v2'}},
      Scroll: {config: {branchName: 'v2'}},
    },
  },
  CheckFrameFully: {
    variants: {
      VG: {skip: true},
      CSS: {skip: true},
    },
  },
  CheckFrameInFrameFully: {
    variants: {
      VG: {config: {branchName: 'v1'}},
      CSS: {config: {branchName: 'v1'}},
      Scroll: {config: {branchName: 'v1'}},
    },
  },
  CheckFrameInFrameFully_Double: {
    variants: {
      VG: {config: {branchName: 'v2'}},
      CSS: {config: {branchName: 'v2'}},
      Scroll: {config: {branchName: 'v2'}},
    },
  },
  CheckRegionByCoordinates_Overflowing: {
    variants: {
      CSS: {skip: true},
      Scroll: {skip: true},
    },
  },
  CheckRegionBySelector_ManualScroll: {
    variants: {
      Scroll: {skip: true},
    },
  },
  CheckRegionBySelectorFully_StickyHeaderPage: {
    variants: {
      CSS: {skip: true},
      Scroll: {skip: true},
    },
  },
  CheckRegionBySelectorFully_ScrollableModal_ModalsPage: {
    variants: {
      VG: {skip: true},
      CSS: {skip: true},
      Scroll: {skip: true},
    },
  },
  CheckRegionByCoordinatesInFrame: {
    variants: {
      CSS: {skip: true},
      Scroll: {skip: true},
    },
  },
  CheckRegionByCoordinatesInFrameFully: {
    variants: {
      CSS: {skip: true},
    },
  },
  CheckRegionBySelectorInFrame_Overflowing: {
    variants: {
      Scroll: {skip: true},
    },
  },
  CheckRegionBySelectorInFrame_Overflowing_ManualSwitchToFrame: {
    variants: {
      Scroll: {skip: true},
    },
  },
  CheckWindow_FloatingRegionByCoordinates: {
    variants: {
      VG: {skip: true},
    },
  },
  CheckWindow_FloatingRegionBySelector: {
    variants: {
      VG: {skip: true},
    },
  },
  CheckWindow_IgnoreRegionBySelector: {
    variants: {
      VG: {skip: true},
    },
  },
  CheckWindow_IgnoreRegionBySelector_Centered: {
    variants: {
      VG: {skip: true},
    },
  },
  CheckWindow_IgnoreRegionBySelector_Stretched: {
    variants: {
      VG: {skip: true},
    },
  },
  CheckFrameFully_FloatingRegionByCoordinates: {
    variants: {
      VG: {skip: true},
      CSS: {skip: true},
    },
  },
  CheckRegionBySelector_IgnoreRegionByCoordinates: {
    variants: {
      VG: {skip: true},
      CSS: {skip: true},
    },
  },
}
