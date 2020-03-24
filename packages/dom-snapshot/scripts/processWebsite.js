const {getProcessPageAndSerialize} = require('../');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async function() {
  const website = process.argv[2];
  console.log('website:', website);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', async msg => {
    const args = msg.args();
    if (args[0] && (await args[0].jsonValue()).match(/\[dom-snapshot\]/)) {
      const values = await Promise.all(msg.args().map(arg => arg.jsonValue()));
      console.log(values.join(' '));
    }
  });
  await page.goto(website, {timeout: 60000});
  const start = Date.now();
  const encodedResult = await page.evaluate(
    `(${await getProcessPageAndSerialize()})(document, true)`,
  );
  const end = Date.now();
  const result = decodeFrame(encodedResult);
  console.log(`processPageAndSerialize took ${end - start}ms`);

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
