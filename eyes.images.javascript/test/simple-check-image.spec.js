const {ConsoleLogHandler, RectangleSize, Region, Location, MouseTrigger} = require('@applitools/eyes.sdk.core');
const {Eyes} = require('../index');

let eyes = null;
describe('Eyes.Images.JavaScript - simple check image', () => {

    before(function () {
        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        eyes.setLogHandler(new ConsoleLogHandler(true));

        // eyes.setProxy('http://localhost:9999');
        eyes.setHostOS('Mac OS X 10.10');
        eyes.setHostApp("My browser");
    });

    it("test check method", function () {
        return eyes.open(this.test.parent.title, this.test.title, new RectangleSize(1000, 633)).then(() => {
            return eyes.checkImage(__dirname + '/resources/image2.png', 'My second image');
        }).then(() => {
            console.log(`Running session: ${eyes.getRunningSession()}`);
            eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));
            return eyes.checkImage(__dirname + '/resources/image1.png', 'My first image');
        }).then(() => {
            console.log(`Running session: ${eyes.getRunningSession()}`);
            eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));
            return eyes.checkRegion(__dirname + '/resources/image1.png', new Region(309, 227, 381, 215), 'Specific region');
        }).then(() => {
            // We're calling close with "false" so that the promise will resolve even if the test failed and not reject.
            // This will make waiting on firstTestPromise simpler (we just handle "resolve" part of the "then").
            return eyes.close(false);
        }).then(results => {
            console.log(`Results: ${results}`);
        });
    });

    afterEach(function () {
        return eyes.abortIfNotClosed();
    });
});
