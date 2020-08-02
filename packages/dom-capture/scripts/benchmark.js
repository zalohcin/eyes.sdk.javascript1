const generateFrameDom = require('./generateFrameDom');
const {makeTiming} = require('@applitools/monitoring-commons');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const {performance, timeItAsync} = makeTiming();

function sum(arr, threshold = 0) {
  return arr.reduce((acc, curr) => (curr > threshold ? acc + curr : acc), 0);
}

(async function() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const timings = [];
  page.on('console', async msg => {
    const args = msg.args();
    if ((args[0] && (await args[0].jsonValue())) === '[captureFrame]') {
      const time = Number(await args[1].jsonValue());
      timings.push(time);
    }
  });
  const url =
    'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuwgEKd2luZG93cyAxMMgBDNgBAegBAfgBC5ICAXmoAgM;sid=ce4701a88873eed9fbb22893b9c6eae4;city=-2600941;from_idr=1&;ilp=1;d_dcp=1';

  // const url = 'https://news.ycombinator.com';
  const testCount = 10;
  let dom;
  for (let i = 0, ii = testCount; i < ii; i++) {
    console.log('iteration', i);
    dom = await generateFrameDom({timeItAsync, page, url});
    if (i === 0) {
      const domStr = JSON.stringify(dom);
      fs.writeFileSync(path.resolve(__dirname, 'benchmark.dom.json'), domStr);
    }
  }

  console.log('\naverage captureFrame:', performance['captureFrame'] / testCount);
  console.log('\naverage captureFrame in browser:', sum(timings, 10) / testCount, timings);
  await browser.close();
})();
