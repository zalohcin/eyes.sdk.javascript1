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
  'TestCheckPageWithHeader_Window_Fully',
  'TestCheckPageWithHeader_Region',
  'TestCheckPageWithHeaderFully_Region',
  'TestCheckRegion',
  'TestCheckRegion2',
  'TestCheckRegionByCoordinates_Fluent',
  'TestCheckRegionByCoordinateInFrame_Fluent',
  'TestCheckRegionByCoordinateInFrameFully_Fluent',
  'TestCheckRegionBySelectorAfterManualScroll_Fluent',
  'TestCheckRegionInFrame',
  'TestCheckRegionInFrame_Fluent',
  'TestCheckRegionInFrame3_Fluent',
  'TestCheckRegionInAVeryBigFrame',
  'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame',
  'TestCheckRegionWithIgnoreRegion_Fluent',
  'TestCheckScrollableModal',
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
addTest('Test_VGTestsCount_1', {isVisualGrid: true, useStrictName: true})

module.exports = supportedTests
