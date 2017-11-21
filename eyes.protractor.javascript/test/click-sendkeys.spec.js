const { ConsoleLogHandler, RectangleSize } = require('eyes.sdk');
const { Target } = require('eyes.selenium');
const { Eyes } = require('../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - click-sendkeys', () => {

    beforeAll(function () {
        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("test click and sendKeys methods methods", function () {
        return eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560)).then(() => {
            browser.get('https://astappev.github.io/test-html-pages/');

            eyes.check("Entire window", Target.window().fully());

            element(by.name("name")).sendKeys("Test User");
            element(by.name("email")).sendKeys("username@example.com");
            element(by.id("submit-form")).click();

            eyes.check("After submit form", Target.window().fully());

            return eyes.close();
        });
    });

    afterEach(function () {
        return eyes.abortIfNotClosed();
    });
});
