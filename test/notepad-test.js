import test from 'ava';
import LFT from 'leanft';
import {StdWin, Desktop, Keyboard} from 'leanft';
import {Eyes, ConsoleLogHandler} from '../index';
import {spawn} from 'child_process';

const appName = "Eyes.LeanFT.JavaScript - notepad";
let browser = null, notepadWindow = null, eyes = null;

test.cb.before(t => {
    LFT.init();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));

    LFT.whenDone(t.end);
});

test.cb.beforeEach(t => {
    LFT.beforeTest();

    // Launch the Notepad application.
    spawn('C:/Windows/System32/notepad.exe');

    // Locate the Notepad window and assign it to a Window object.
    notepadWindow = Desktop.$(StdWin.Window({
        windowClassRegExp: "Notepad",
        windowTitleRegExp: " Notepad"
    }));

    const testName = t.title.replace("beforeEach for ", "");
    eyes.open(notepadWindow, appName, testName);

    LFT.whenDone(t.end);
});

// This example shows usage of the low level keyboard and mouse operations
test.cb('LeanFT Notepad Test', t => {

    // Move the notepad window to the top left area of the screen
    notepadWindow.move(0, 0);

    eyes.checkWindow("Before");

    Keyboard.sendString("Applitools LeanFT Test");

    var ENTER_KEY_SCAN_CODE = 28;
    Keyboard.pressKey(ENTER_KEY_SCAN_CODE);

    eyes.checkWindow("After");

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
