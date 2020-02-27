const {getCaptureDomScript} = require('../');
const startTestServer = require('../tests/util/testServer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const {beautifyOutput} = require('../tests/util/beautifyOutput');

(async function() {
  const testServer = await startTestServer({port: 7373});
  const anotherTestServer1 = await startTestServer({port: 7272});
  const anotherTestServer2 = await startTestServer({port: 7171});
  const baseUrl = `http://localhost:${testServer.port}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const captureDomScript = `(${await getCaptureDomScript()})()`;

  await generateFixture(`${baseUrl}/test.html`, 'test');
  await generateFixture(`${baseUrl}/testWithCrossOriginIframe.html`, 'testWithCrossOriginIframe');
  await generateFixture(
    `${baseUrl}/testWithCrossOriginIframe.surge.html`,
    'testWithCrossOriginIframe.surge',
  );
  await generateFixture(`${baseUrl}/testWithNestedIframe.html`, 'testWithNestedIframe');
  await generateFixture(`${baseUrl}/testWithCrossOriginCss.html`, 'testWithCrossOriginCss');
  await generateFixture(`${baseUrl}/testWithNestedIframe.surge.html`, 'testWithNestedIframe.surge');

  await testServer.close();
  await anotherTestServer1.close();
  await anotherTestServer2.close();
  await browser.close();

  async function generateFixture(url, name) {
    await page.goto(`${url}`);
    const domStr = beautifyOutput(await page.evaluate(captureDomScript));
    fs.writeFileSync(`tests/fixtures/${name}.dom.json`, domStr);
  }
})();
