const executionModes = [{isVisualGrid: true}, {isCssStitching: true}, {isScrollStitching: true}]
const tests = [
  'TestCheckFrame',
  'TestCheckPageWithHeader_Window',
  'TestCheckPageWithHeaderFully_Window',
  'TestCheckPageWithHeader_Region',
  'TestCheckPageWithHeaderFully_Region',
  'TestCheckRegion',
  'TestCheckRegion2',
  'TestCheckRegionInFrame',
  'TestCheckWindow',
  'TestCheckWindowAfterScroll',
  'TestCheckWindowFully',
  'TestCheckWindowViewport',
  'TestDoubleCheckWindow',
  'TestCheckElementFully_Fluent',
  'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent',
  'TestCheckElementWithIgnoreRegionBySameElement_Fluent',
  'TestCheckFrame_Fluent',
  'TestCheckFrameFully_Fluent',
  'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent',
  'TestCheckRegionByCoordinates_Fluent',
  'TestCheckRegionByCoordinatesInFrame_Fluent',
  'TestCheckRegionByCoordinatesInFrameFully_Fluent',
  'TestCheckOverflowingRegionByCoordinates_Fluent',
  'TestCheckRegionBySelectorAfterManualScroll_Fluent',
  'TestCheckRegionWithIgnoreRegion_Fluent',
  'TestCheckWindow_Fluent',
  'TestCheckWindowWithIgnoreRegion_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Centered_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent',
  'TestCheckWindowWithFloatingByRegion_Fluent',
  'TestCheckWindowWithFloatingBySelector_Fluent',
  'TestScrollbarsHiddenAndReturned_Fluent',
  'TestSimpleRegion',
]
let supportedTests = []
tests.forEach(name => {
  executionModes.forEach(executionMode => {
    supportedTests.push({name, executionMode})
  })
})

module.exports = supportedTests
