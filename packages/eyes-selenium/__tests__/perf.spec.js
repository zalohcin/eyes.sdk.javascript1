'use strict';

const { Eyes } = require('../index.js');

jest.setTimeout(3000000);
describe('performance tests', () => {
  let eyes;
  beforeEach(() => {
    eyes = new Eyes();
  });
  afterEach(async () => {
    if (eyes._isOpen) {
      await eyes.close();
    }
  });
  it('should run the test case fast', async () => {
    const startDate = new Date();
    // eslint-disable-next-line no-undef
    const _driver = await eyes.open(driver, 'js sdk tests', 'window full perf');
    await _driver.get('https://applitools.com/helloworld');
    await eyes.setViewportSize({
      width: 1280,
      height: 800,
    });
    eyes.setForceFullPageScreenshot(true);
    await eyes.checkWindow('check full page');
    expect(new Date() - startDate).toBeLessThanOrEqual(8000);
  });
});
