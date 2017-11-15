const {Builder} = require('selenium-webdriver');
const {ConsoleLogHandler, RectangleSize} = require('eyes.sdk');
const {Eyes, Target} = require('../index');

let driver = null, eyes = null;
describe('Eyes.Selenium.JavaScript - check window', () => {

    before(function() {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub')
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("test check window methods", function() {
        return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
            driver.get('https://astappev.github.io/test-html-pages/');

            eyes.check("Partial window", Target.window());

            eyes.check("Entire window", Target.window().fully());

            return eyes.close();
        });
    });

    afterEach(function() {
        return driver.quit().then(() => eyes.abortIfNotClosed());
    });
});
