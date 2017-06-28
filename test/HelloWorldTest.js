import test from 'ava';
var LFT = require("leanft");
var Web = LFT.Web;
import {Eyes, ConsoleLogHandler} from '../index';

const testName = "Eyes.LeanFT.JavaScript - Hello World";
let browser = null, eyes = null;


test.cb.before(t => {
    LFT.init();

    eyes = new Eyes("https://localhost.applitools.com");
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setForceFullPageScreenshot(true);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    //eyes.setSaveDebugScreenshots(true, "c:/temp");
    //eyes.setServerUrl("https://localhost.applitools.com"); // TODO - add missing function "setServerUrl"

    LFT.whenDone(t.end);
});

test.cb.beforeEach(t => {
    LFT.beforeTest();

    Web.Browser.launch(Web.BrowserType.Chrome).then(function(launched_browser){
        browser = launched_browser;
    });

    LFT.whenDone(t.end);
});

test.cb('LeanFT Hello World', t => {
    eyes.open(browser, testName, t.title).then(function () {
        browser.navigate("https://www.applitools.com/helloworld");
        browser.sync();

        eyes.checkWindow("Hello!");

        let button = browser.$(Web.Element({tagName: "button"}));
        button.click();

        eyes.checkWindow("Click!");

        return eyes.close();
    });

    LFT.whenDone(t.end);
});

test.cb.afterEach.always(t => {
    LFT.afterTest();
    if (browser){
        browser.close();
    }
    LFT.whenDone(t.end);
});

test.cb.after.always(t => {
    LFT.cleanup();
    LFT.whenDone(t.end);
});
