"use strict";

const fs = require('fs');

const {ConsoleLogHandler, RectangleSize, Region, Location, MouseTrigger} = require('../index.js').CoreSDK;
const Eyes = require('../index.js').Eyes;

const eyes = new Eyes();
eyes.setLogHandler(new ConsoleLogHandler(true));
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
// eyes.setProxy('http://localhost:9999');
eyes.setHostOS('Mac OS X 10.10');
eyes.setHostApp("My browser");

// load images from local storage
const image1 = fs.readFileSync('image1.png');
const image2 = fs.readFileSync('image2.png');

// noinspection MagicNumberJS
return eyes.open("eyes.images.javascript", "First test5_3", new RectangleSize(800, 600)).then(() => {
    // Notice since eyes.checkImage returns a promise, you need to call it with "return" in order for the wrapping "then" to wait on it.
    return eyes.checkImage(image2, 'My second image');
}).then(() => {
    console.log(`Running session: ${eyes.getRunningSession()}`);
    // noinspection MagicNumberJS
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));
    return eyes.checkImage(image1, 'My first image');
}).then(() => {
    // noinspection MagicNumberJS
    return eyes.checkRegion(image1, new Region(495, 100, 355, 360), 'Specific region');
}).then(() => {
    // We're calling close with "false" so that the promise will resolve even if the test failed and not reject.
    // This will make waiting on firstTestPromise simpler (we just handle "resolve" part of the "then").
    return eyes.close(false);
}, function (err) {
    console.error("An error occurs during runtime", err);
    return eyes.abortIfNotClosed();
}).then((results) => {
    console.log(`Results: ${results}`);
});

