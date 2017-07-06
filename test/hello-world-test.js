import test from 'ava';
import LFT from 'leanft';
import {Web} from 'leanft';
import {Eyes, ConsoleLogHandler} from '../index';

const appName = "Eyes.LeanFT.JavaScrip - hello world";
let browser = null, eyes = null;

test.cb.before(t => {
    LFT.init();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setForceFullPageScreenshot(true);

    LFT.whenDone(t.end);
});

test.cb.beforeEach(t => {
    LFT.beforeTest();

    const testName = t.title.replace("beforeEach for ", "");
    Web.Browser.launch(Web.BrowserType.Chrome).then(function(launched_browser){
        return eyes.open(launched_browser, appName, testName);
    }).then(function (launched_browser) {
        browser = launched_browser;
    });

    LFT.whenDone(t.end);
});

test.cb('LeanFT Hello World', t => {
    browser.navigate("https://www.applitools.com/helloworld");
    browser.sync();

    eyes.checkWindow("Hello!");

    let button = browser.$(Web.Element({tagName: "button"}));
    button.click();

    eyes.checkWindow("Click!");

    eyes.close();

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
    eyes.abortIfNotClosed();
    LFT.whenDone(t.end);
});
