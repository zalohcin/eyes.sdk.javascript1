/**
 * This file is meant to be used as an input for Browserify for creating a browser version of the SDK, by adding
 * the EyesImages object to the global "window" instance.
 */
window.EyesImages = require('./index');
console.log("loaded EyesImages into the 'window' object");