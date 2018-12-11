'use strict';

/* eslint-env browser */

/**
 * This file is meant to be used as an input for Browserify for creating a browser version of the SDK, by adding
 * the EyesImages object to the global "window" instance.
 */
window.EyesImages = require('@applitools/eyes.images');

console.log("EyesImages loaded into the 'window' object"); // eslint-disable-line no-console
