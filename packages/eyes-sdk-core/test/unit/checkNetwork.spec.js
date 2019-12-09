'use strict'

const assert = require('assert')
const {makeCheckNetwork} = require('../../lib/troubleshoot/checkNetwork')

describe('checkNetwork', () => {
  let output
  let throwFor
  const eyes = {
    testServer: async () => {
      if (throwFor.includes('eyes:Server')) {
        throw new Error('eyes:Server')
      }
    },
    testAxios: async () => {
      if (throwFor.includes('eyes:Axios')) {
        throw new Error('eyes:Axios')
      }
    },
    testFetch: async () => {
      if (throwFor.includes('eyes:Fetch')) {
        throw new Error('eyes:Fetch')
      }
    },
    testCurl: async () => {
      if (throwFor.includes('eyes:Curl')) {
        throw new Error('eyes:Curl')
      }
    },
    testHttps: async () => {
      if (throwFor.includes('eyes:Https')) {
        throw new Error('eyes:Https')
      }
    },
  }
  const vg = {
    testServer: async () => {
      if (throwFor.includes('vg:Server')) {
        throw new Error('vg:Server')
      }
    },
    testAxios: async () => {
      if (throwFor.includes('vg:Axios')) {
        throw new Error('vg:Axios')
      }
    },
    testFetch: async () => {
      if (throwFor.includes('vg:Fetch')) {
        throw new Error('vg:Fetch')
      }
    },
    testCurl: async () => {
      if (throwFor.includes('vg:Curl')) {
        throw new Error('vg:Curl')
      }
    },
    testHttps: async () => {
      if (throwFor.includes('vg:Https')) {
        throw new Error('vg:Https')
      }
    },
  }

  const stream = {
    write: (...args) => output.push(args),
    cursorTo: () => {},
    clearLine: () => {},
  }
  const checkNetwork = makeCheckNetwork({
    stream,
    eyes,
    vg,
  })

  const sanitizeApiKey = () => {
    output[0][0] = output[0][0].replace(/{"apiKey":".+"}/, '{"apiKey":"someKey"}')
  }

  beforeEach(() => {
    output = []
    throwFor = []
  })

  it('work', async () => {
    await checkNetwork()
    sanitizeApiKey()
    assert.deepStrictEqual(output, [
      [
        '\u001b[36mEyes check netwrok running with {"apiKey":"someKey"} HTTP_PROXY="" HTTPS_PROXY="". \u001b[39m\n\u001b[36m\u001b[39m\n\u001b[36m\u001b[39m',
      ],
      ['\u001b[36m[1] Checking eyes servers api  \u001b[39m\n\u001b[36m\u001b[39m'],
      ['\u001b[32m[eyes] cURL                    [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] cURL                    [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] https                   [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] https                   [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] axios                   [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] axios                   [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] node-fetch              [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] node-fetch              [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] server connector        [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] server connector        [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[36m[2] Checking visual grid servers api  \u001b[39m\n\u001b[36m\u001b[39m'],
      ['\u001b[32m[VG] cURL                      [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] cURL                      [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] https                     [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] https                     [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] axios                     [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] axios                     [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] node-fetch                [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] node-fetch                [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] server connector          [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] server connector          [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m\u001b[39m\n\u001b[32mSUCCESS!\u001b[39m\n\u001b[32m\u001b[39m'],
    ])
  })

  it('displays errors', async () => {
    throwFor = ['eyes:Curl', 'eyes:Server', 'vg:Axios', 'vg:Fetch', 'pub:Curl']
    await checkNetwork()
    sanitizeApiKey()
    assert.deepStrictEqual(output, [
      [
        '\u001b[36mEyes check netwrok running with {"apiKey":"someKey"} HTTP_PROXY="" HTTPS_PROXY="". \u001b[39m\n\u001b[36m\u001b[39m\n\u001b[36m\u001b[39m',
      ],
      ['\u001b[36m[1] Checking eyes servers api  \u001b[39m\n\u001b[36m\u001b[39m'],
      ['\u001b[32m[eyes] cURL                    [ ?  ]\u001b[39m'],
      [
        '\u001b[31m[eyes] cURL                    [ X  ]  +0 eyes:Curl \u001b[39m\n\u001b[31m\u001b[39m',
      ],
      ['\u001b[32m[eyes] https                   [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] https                   [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] axios                   [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] axios                   [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] node-fetch              [ ?  ]\u001b[39m'],
      ['\u001b[32m[eyes] node-fetch              [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[eyes] server connector        [ ?  ]\u001b[39m'],
      [
        '\u001b[31m[eyes] server connector        [ X  ]  +0 eyes:Server \u001b[39m\n\u001b[31m\u001b[39m',
      ],
      ['\u001b[36m[2] Checking visual grid servers api  \u001b[39m\n\u001b[36m\u001b[39m'],
      ['\u001b[32m[VG] cURL                      [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] cURL                      [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] https                     [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] https                     [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[32m[VG] axios                     [ ?  ]\u001b[39m'],
      [
        '\u001b[31m[VG] axios                     [ X  ]  +0 vg:Axios \u001b[39m\n\u001b[31m\u001b[39m',
      ],
      ['\u001b[32m[VG] node-fetch                [ ?  ]\u001b[39m'],
      [
        '\u001b[31m[VG] node-fetch                [ X  ]  +0 vg:Fetch \u001b[39m\n\u001b[31m\u001b[39m',
      ],
      ['\u001b[32m[VG] server connector          [ ?  ]\u001b[39m'],
      ['\u001b[32m[VG] server connector          [ OK ]  +0 \u001b[39m\n\u001b[32m\u001b[39m'],
      ['\u001b[31m\u001b[39m\n\u001b[31mFAILED!\u001b[39m\n\u001b[31m\u001b[39m'],
      [
        '\u001b[31m\u001b[39m\n\u001b[31mYOUR PROXY SEEMS TO BE BLOCKING APPLITOOLS REQUESTS, PLEASE MAKE SURE THE FOLLOWING COMMAND SUCCEED:\u001b[39m\n\u001b[31mcurl undefined\u001b[39m\n\u001b[31m\u001b[39m',
      ],
    ])
  })
})
