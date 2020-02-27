const {getProcessPageAndSerializeScript} = require('../');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async function() {
  const website = process.argv[2];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', async msg => {
    const args = msg.args();
    if (args[0] && (await args[0].jsonValue()).match(/\[dom-capture\]/)) {
      console.log(msg.args().join(' '));
    }
  });
  await page.goto(website);
  const result = await page
    .evaluate(`(${await getProcessPageAndSerializeScript()})()`)
    .then(decodeFrame);

  fs.writeFileSync(path.resolve(__dirname, 'processed.json'), JSON.stringify(result, null, 2));
  await browser.close();

  function decodeFrame(frame) {
    return Object.assign(frame, {
      blobs: frame.blobs.map(({url, type, value}) => ({
        url,
        type,
        value: Buffer.from(value, 'base64').length,
      })),
      frames: frame.frames.map(decodeFrame),
    });
  }
})();
