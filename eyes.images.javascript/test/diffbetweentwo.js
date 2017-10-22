"use strict";

const fs = require('fs');

const {ConsoleLogHandler, RectangleSize} = require('../index.js').CoreSDK;
const Eyes = require('../index.js').Eyes;

const eyes = new Eyes();
eyes.setLogHandler(new ConsoleLogHandler(true));
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
eyes.setHostOS('Mac OS X 10.10');
eyes.setHostApp("My browser");

// load images from local storage
const image1 = fs.readFileSync('DSC_2976.png');
const image2 = fs.readFileSync('DSC_2977.png');
const image1Size = new RectangleSize(4000, 2667);
const image2Size = new RectangleSize(4000, 2667);

const appName = "eyes.images.javascript - diffbetweentwo";
// get random name for our test, each test is "unique" test on eyes server
const testName = Math.random().toString(36).substring(2, 15);

function openSessionAndSendImage(eyes, appName, testName, image, imageSize) {
    return eyes.open(appName, testName, imageSize).then(() => {
        // Notice since eyes.checkImage returns a promise, you need to call it with "return" in order for the wrapping "then" to wait on it.
        return eyes.checkImage(image);
    }).then(() => {
        // We're calling close with "false" so that the promise will resolve even if the test failed and not reject.
        return eyes.close(false);
    });
}

return openSessionAndSendImage(eyes, appName, testName, image1, image1Size).then(() => {
    return openSessionAndSendImage(eyes, appName, testName, image2, image2Size);
}).catch(err => {
    console.error("An error occurs during runtime", err);
    return eyes.abortIfNotClosed();
});
