/* eslint-disable */
const fs = require('fs');
const url = require('url');
url.URL = URL;
fs.open = () => { console.log('MOCK function open should not be used !!! ') };
fs.mkdir = () => { console.log('MOCK function mkdir should not be used !!! ') };
fs.writeFile = () => { console.log('MOCK function writeFile should not be used !!! ') };
process.hrtime = require('browser-process-hrtime');
window.Buffer = require('buffer').Buffer;
window.makeRenderingGridClient = require('../../../../src/sdk/renderingGridClient');
