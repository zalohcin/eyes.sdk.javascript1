import test from 'ava';
var LFT = require("leanft");
import { Eyes, ConsoleLogHandler } from '../index';
var expect = require("leanft/expect");
var spawn = require('child_process').spawn;
var StdWin = LFT.StdWin;
var Desktop = LFT.Desktop;
var Keyboard = LFT.Keyboard;
var Mouse = LFT.Mouse;

const testName = "Eyes.LeanFT.JavaScript - Notepad";

let notepadWindow = null, eyes = null;

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

    // Launch the Notepad application.
    spawn('C:/Windows/System32/notepad.exe');

    // Locate the Notepad window and assign it to a Window object.
    notepadWindow = Desktop.$(StdWin.Window({
        windowClassRegExp: "Notepad",
        windowTitleRegExp: " Notepad"
    }));

    LFT.whenDone(t.end);
});

// This example shows usage of the low level keyboard and mouse operations
test.cb('LeanFT Notepad Test', t => {
    eyes.open(notepadWindow, testName, t.title).then(function () {

        eyes.checkWindow("Before");

        Keyboard.sendString("Applitools LeanFT Test");

        var ENTER_KEY_SCAN_CODE = 28;
        Keyboard.pressKey(ENTER_KEY_SCAN_CODE);

        eyes.checkWindow("After");

        return eyes.close();
    });

    LFT.whenDone(t.end);
});

test.cb.afterEach.always(t => {
    LFT.afterTest();
    if (notepadWindow){
        notepadWindow.close();
    }
    LFT.whenDone(t.end);
});

test.cb.after.always(t => {
    LFT.cleanup();
    LFT.whenDone(t.end);
});
