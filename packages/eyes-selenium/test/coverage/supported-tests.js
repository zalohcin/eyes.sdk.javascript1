const executionModes = [{isVisualGrid: true}, {isCssStitching: true}, {isScrollStitching: true}]
const tests = [
  'TestAcmeLogin',
  'TestCheckElementFully_Fluent',
  'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent',
  'TestCheckElementWithIgnoreRegionBySameElement_Fluent',
  'TestCheckFrame',
  'TestCheckFrame_Fluent',
  'TestCheckFrameFully_Fluent',
  'TestCheckFrameInFrame_Fully_Fluent',
  'TestCheckFrameInFrame_Fully_Fluent2',
  'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent',
  'TestCheckOverflowingRegionByCoordinates_Fluent',
  'TestCheckPageWithHeader_Window',
  'TestCheckPageWithHeaderFully_Window',
  'TestCheckPageWithHeader_Region',
  'TestCheckPageWithHeaderFully_Region',
  'TestCheckRegion',
  'TestCheckRegion2',
  'TestCheckRegionByCoordinates_Fluent',
  'TestCheckRegionByCoordinatesInFrame_Fluent',
  'TestCheckRegionByCoordinatesInFrameFully_Fluent',
  'TestCheckRegionBySelectorAfterManualScroll_Fluent',
  'TestCheckRegionInFrame',
  'TestCheckRegionInFrame_Fluent',
  'TestCheckRegionInFrame3_Fluent',
  'TestCheckRegionInAVeryBigFrame',
  'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame',
  'TestCheckRegionWithIgnoreRegion_Fluent',
  'TestCheckWindow',
  'TestCheckWindowAfterScroll',
  'TestCheckWindow_Body',
  'TestCheckWindow_Html',
  'TestCheckWindow_Fluent',
  'TestCheckWindowFully',
  'TestCheckWindowViewport',
  'TestCheckWindow_Simple_Html',
  'TestCheckWindowWithFloatingByRegion_Fluent',
  'TestCheckWindowWithFloatingBySelector_Fluent',
  'TestCheckWindowWithIgnoreRegion_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Centered_Fluent',
  'TestCheckWindowWithIgnoreBySelector_Stretched_Fluent',
  'TestDoubleCheckWindow',
  'TestSimpleRegion',
  'TestScrollbarsHiddenAndReturned_Fluent',
]
let supportedTests = []
function addTest(name, executionMode) {
  supportedTests.push({name, executionMode})
}
tests.forEach(name => {
  executionModes.forEach(executionMode => {
    addTest(name, executionMode)
  })
})
addTest('Test Abort', {isVisualGrid: true})
addTest('Test Abort', {isCssStitching: true})

module.exports = supportedTests
