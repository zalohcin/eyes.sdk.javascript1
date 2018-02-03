const { Builder } = require('selenium-webdriver');
const { RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, EyesWebDriver, Target } = require('../index');
const assert = require("assert");

let driver = null, eyes = null;
describe('Eyes', function(){

    before(function () {
        driver = new Builder()
            .forBrowser('chrome')
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    });

    describe('#open()', function(){
        it('should return EyesWebDriver', function() {
            return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
                assert.equal(driver instanceof EyesWebDriver, true);
                return eyes.close();
            });
        });

        it('should throw IllegalState: Eyes not open', function () {
            return eyes.check('test', Target.window()).catch(error => {
                assert.equal(error.message, 'IllegalState: Eyes not open');
            });
        });
    });

    after(function () {
        return driver.quit().then(() => eyes.abortIfNotClosed());
    });
});
