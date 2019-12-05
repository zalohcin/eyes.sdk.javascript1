'use strict';

const assert = require('assert');
const { makeCheckNetwork } = require('../../lib/troubleshoot/checkNetwork');

describe('checkNetwork', () => {
  let output;

  const print = (...args) => { output.reg.push(args); };
  const printErr = (...args) => { output.err.push(args); };
  const printSuccess = (...args) => { output.success.push(args); };
  const clearLine = () => {};

  let throwFor;
  const eyes = {
    testServer: async () => { if (throwFor.includes('eyes:Server')) { throw new Error('eyes:Server'); } },
    testAxios: async () => { if (throwFor.includes('eyes:Axios')) { throw new Error('eyes:Axios'); } },
    testFetch: async () => { if (throwFor.includes('eyes:Fetch')) { throw new Error('eyes:Fetch'); } },
    testCurl: async () => { if (throwFor.includes('eyes:Curl')) { throw new Error('eyes:Curl'); } },
  };
  const vg = {
    testServer: async () => { if (throwFor.includes('vg:Server')) { throw new Error('vg:Server'); } },
    testAxios: async () => { if (throwFor.includes('vg:Axios')) { throw new Error('vg:Axios'); } },
    testFetch: async () => { if (throwFor.includes('vg:Fetch')) { throw new Error('vg:Fetch'); } },
    testCurl: async () => { if (throwFor.includes('vg:Curl')) { throw new Error('vg:Curl'); } },
  };
  const pub = {
    testAxios: async () => { if (throwFor.includes('pub:Axios')) { throw new Error('pub:Axios'); } },
    testFetch: async () => { if (throwFor.includes('pub:Fetch')) { throw new Error('pub:Fetch'); } },
    testCurl: async () => { if (throwFor.includes('pub:Curl')) { throw new Error('pub:Curl'); } },
  };

  const checkNetwork = makeCheckNetwork({
    print,
    printErr,
    printSuccess,
    clearLine,
    eyes,
    vg,
    pub,
  });

  const sanitizeApiKey = () => {
    output.reg[0][1] = output.reg[0][1].replace(/{"apiKey":".+"}/, '{"apiKey":"someKey"}');
  };

  beforeEach(() => {
    output = {
      reg: [],
      err: [],
      success: [],
    };
    throwFor = [];
  });

  it('work', async () => {
    await checkNetwork();
    sanitizeApiKey();
    assert.deepStrictEqual(output, { reg:
      [['Eyes check netwrok running with',
        '{"apiKey":"someKey"}',
        '\n\n'],
      ['[1] Checking eyes servers api', undefined, '\n'],
      ['[eyes] server connector', '- [ ? ]'],
      ['[eyes] axios', '- [ ? ]'],
      ['[eyes] node-fetch', '- [ ? ]'],
      ['[eyes] cURL', '- [ ? ]'],
      ['[2]  Checking visual grid servers api', undefined, '\n'],
      ['[VG] server connector', '- [ ? ]'],
      ['[VG] axios', '- [ ? ]'],
      ['[VG] node-fetch', '- [ ? ]'],
      ['[VG] cURL', '- [ ? ]'],
      ['[3] Checking simple public api', undefined, '\n'],
      ['[public] axios', '- [ ? ]'],
      ['[public] node-fetch', '- [ ? ]'],
      ['[public] cURL', '- [ ? ]']],
    err: [],
    success:
      [['[eyes] server connector', '- [ OK ]', '\n'],
        ['[eyes] axios', '- [ OK ]', '\n'],
        ['[eyes] node-fetch', '- [ OK ]', '\n'],
        ['[eyes] cURL', '- [ OK ]', '\n'],
        ['[VG] server connector', '- [ OK ]', '\n'],
        ['[VG] axios', '- [ OK ]', '\n'],
        ['[VG] node-fetch', '- [ OK ]', '\n'],
        ['[VG] cURL', '- [ OK ]', '\n'],
        ['[public] axios', '- [ OK ]', '\n'],
        ['[public] node-fetch', '- [ OK ]', '\n'],
        ['[public] cURL', '- [ OK ]', '\n'],
        ['[public] PUBLIC ACCESS IS ENABLED\n'],
        ['\nSUCCESS!\n']] });
  });

  it('displays errors', async () => {
    throwFor = ['eyes:Curl', 'eyes:Server', 'vg:Axios', 'vg:Fetch', 'pub:Curl'];
    await checkNetwork();
    sanitizeApiKey();
    assert.deepStrictEqual(output, { reg:
      [['Eyes check netwrok running with',
        '{"apiKey":"someKey"}',
        '\n\n'],
      ['[1] Checking eyes servers api', undefined, '\n'],
      ['[eyes] server connector', '- [ ? ]'],
      ['[eyes] axios', '- [ ? ]'],
      ['[eyes] node-fetch', '- [ ? ]'],
      ['[eyes] cURL', '- [ ? ]'],
      ['[2]  Checking visual grid servers api', undefined, '\n'],
      ['[VG] server connector', '- [ ? ]'],
      ['[VG] axios', '- [ ? ]'],
      ['[VG] node-fetch', '- [ ? ]'],
      ['[VG] cURL', '- [ ? ]'],
      ['[3] Checking simple public api', undefined, '\n'],
      ['[public] axios', '- [ ? ]'],
      ['[public] node-fetch', '- [ ? ]'],
      ['[public] cURL', '- [ ? ]']],
    err:
      [['[eyes] server connector', '- [ X ]', 'eyes:Server', '\n'],
        ['[eyes] cURL', '- [ X ]', 'eyes:Curl', '\n'],
        ['[VG] axios', '- [ X ]', 'vg:Axios', '\n'],
        ['[VG] node-fetch', '- [ X ]', 'vg:Fetch', '\n'],
        ['\nFAILED!\n'],
        ['YOUR PROXY SEEMS TO BE BLOCKING APPLITOOLS REQUESTS, PLEASE MAKE SURE THE FOLLOWING COMMAND SUCCEED:\ncurl -X GET undefined\n']],
    success:
      [['[eyes] axios', '- [ OK ]', '\n'],
        ['[eyes] node-fetch', '- [ OK ]', '\n'],
        ['[VG] server connector', '- [ OK ]', '\n'],
        ['[VG] cURL', '- [ OK ]', '\n'],
        ['[public] axios', '- [ OK ]', '\n'],
        ['[public] node-fetch', '- [ OK ]', '\n'],
        ['[public] cURL', '- [ X ]', 'pub:Curl', '\n'],
        ['[public] PUBLIC ACCESS TO undefined IS RESTRICTED\n']] });
  });
});
