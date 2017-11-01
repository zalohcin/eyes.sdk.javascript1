const {Builder} = require('selenium-webdriver');
const {ConsoleLogHandler, FixedCutProvider} = require('eyes.sdk');
const {Eyes} = require('../index');

let driver = null, eyes = null;
describe('Eyes.Selenium.JavaScript - simple', () => {

    before(function() {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub')
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("Simple methods on TestHtmlPages", function() {
        return eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 560}).then(driver => {
            driver.get('https://astappev.github.io/test-html-pages/');

            eyes.addProperty("MyProp", "I'm correct!");

            eyes.checkWindow("Entire window");

            // cut params: header, footer, left, right.
            // noinspection MagicNumberJS
            eyes.setImageCut(new FixedCutProvider(60, 100, 50, 120));

            eyes.checkWindow("Entire window with cut borders");

            return eyes.close();
        });
    });

    afterEach(function() {
        return driver.quit().then(() => eyes.abortIfNotClosed());
    });
});
