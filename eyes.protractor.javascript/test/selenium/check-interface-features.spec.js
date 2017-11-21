const { ConsoleLogHandler, MatchLevel, Region, RectangleSize, FloatingMatchSettings } = require('eyes.sdk');
const { Target } = require('eyes.selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check-interface-features', () => {

    beforeAll(function () {
        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));
    });

    it("test check interface features", function () {
        return eyes.open(browser, global.appName, global.testName, new RectangleSize(1000, 700)).then(() => {
            browser.get('https://astappev.github.io/test-html-pages/');

            // Entire window, equivalent to eyes.checkWindow()
            eyes.check("Entire window", Target.window()
                .matchLevel(MatchLevel.Layout)
                .ignore(by.id("overflowing-div"))
                .ignore(element(by.name("frame1")))
                .ignores(new Region(400, 100, 50, 50), new Region(400, 200, 50, 100))
                .floating(new FloatingMatchSettings(500, 100, 75, 100, 25, 10, 30, 15))
                .floating(by.id("overflowing-div-image"), 5, 25, 10, 25)
            );

            // Region by rect, equivalent to eyes.checkFrame()
            eyes.check("Region by rect", Target.region(new Region(50, 50, 200, 200))
                .floating(new FloatingMatchSettings(50, 50, 60, 50, 10, 10, 10, 10))
            );

            return eyes.close();
        });
    });

    afterEach(function () {
        return eyes.abortIfNotClosed();
    });
});
