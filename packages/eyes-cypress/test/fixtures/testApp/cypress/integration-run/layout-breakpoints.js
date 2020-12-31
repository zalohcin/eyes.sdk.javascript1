/* global cy */
describe('JS layout', () => {
  it('should support js layouts in cypress', () => {
    cy.visit('https://applitools.github.io/demo/TestPages/JsLayout/');
    cy.eyesOpen({
      appName: 'JS layout',
      testName: 'testing js layout support in cypress',
      browser: [
        {name: 'chrome', width: 1000, height: 800},
        {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
        {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
      ],
      layoutBreakpoints: [500, 1000],
    });
    cy.eyesCheckWindow('Test');
    cy.eyesClose();
  });
});
