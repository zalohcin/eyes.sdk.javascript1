import test from 'ava';
var LFT = require("leanft");
var Web = LFT.Web;
import {Eyes, ConsoleLogHandler} from '../index';

const testName = "Eyes.LeanFT.JavaScript - simple";
let browser = null, eyes = null;

test.cb.before(t => {
    LFT.init();

    eyes = new Eyes("https://localhost.applitools.com");
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setForceFullPageScreenshot(true);
    eyes.setLogHandler(new ConsoleLogHandler(true));

    LFT.whenDone(t.end);
});

test.cb.beforeEach(t => {
    LFT.beforeTest();

    Web.Browser.launch(Web.BrowserType.Chrome).then(function(launched_browser){
        browser = launched_browser;
    });

    LFT.whenDone(t.end);
});

test.cb('LeanFT simple', t => {
    eyes.open(browser, testName, t.title).then(function () {
        browser.navigate("http://newtours.demoaut.com/");
        browser.sync();

        eyes.checkWindow("full window");

        eyes.checkRegion({left: 50, top: 100, height: 125, width: 200}, "region area");

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