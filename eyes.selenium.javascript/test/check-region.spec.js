const {Builder, By} = require('selenium-webdriver');
const {ConsoleLogHandler, RectangleSize, Region} = require('eyes.sdk');
const {Eyes, Target} = require('../index');

let driver = null, eyes = null;
describe('Eyes.Selenium.JavaScript - check region', () => {

    before(function() {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub')
            .build();

        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("test check region methods", function() {
        // noinspection MagicNumberJS
        return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
            driver.get('https://astappev.github.io/test-html-pages/');

            // Region by rect, equivalent to eyes.checkFrame()
            // noinspection MagicNumberJS
            eyes.check("Region by rect", Target.region(new Region(50, 50, 200, 200)));

            // Region by element, equivalent to eyes.checkRegionByElement()
            eyes.check("Region by element", Target.region(driver.findElement(By.css("body > h1"))));

            // Region by locator, equivalent to eyes.checkRegionBy()
            eyes.check("Region by locator", Target.region(By.id("overflowing-div-image")));

            // Entire element by element, equivalent to eyes.checkElement()
            eyes.check("Entire element by element", Target.region(driver.findElement(By.id("overflowing-div-image"))).fully());

            // Entire element by locator, equivalent to eyes.checkElementBy()
            eyes.check("Entire element by locator", Target.region(By.id("overflowing-div")).fully());

            // Entire frame by locator, equivalent to eyes.checkFrame()
            eyes.check("Entire frame by locator", Target.frame(By.name("frame1")));

            // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
            eyes.check("Entire region in frame by frame name and region locator", Target.region(By.id("inner-frame-div"), "frame1").fully());

            return eyes.close();
        });
    });

    afterEach(function() {
        return driver.quit().then(() => eyes.abortIfNotClosed());
    });
});
