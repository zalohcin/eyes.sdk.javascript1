'use strict'

const _eyes = require('./eyes')
const _pub = require('./public')
const _vg = require('./vg')
const {userConfig, presult} = require('./utils')

function makeCheckNetwork({
  print,
  printErr,
  printSuccess,
  clearLine,
  eyes = _eyes,
  pub = _pub,
  vg = _vg,
}) {
  async function doTest(func, name) {
    print(name, '- [ ? ]')
    const [err] = await presult(func())
    clearLine()
    if (err) {
      printErr(name, '- [ X ]', err.message, '\n')
    } else {
      printSuccess(name, '- [ OK ]', '\n')
    }
    return !!err
  }

  async function doOptionalTest(func, name) {
    print(name, '- [ ? ]')
    const [err] = await presult(func())
    clearLine()
    if (err) {
      printSuccess(name, '- [ X ]', err.message, '\n')
    } else {
      printSuccess(name, '- [ OK ]', '\n')
    }
    return !!err
  }

  return async function checkNetwork() {
    if (!userConfig.apiKey) {
      printErr(
        'missing "apiKey" add APPLITOOLS_API_KEY as an env variable or add "apiKey" in applitools.config.js\n',
      )
      return
    }
    print('Eyes check netwrok running with', JSON.stringify(userConfig), '\n\n')

    let hasErr = false
    let restrictedAccess = true
    let curlRenderErr = true
    let curlVgErr = true

    print('[1] Checking eyes servers api', eyes.url, '\n')
    hasErr = await doTest(eyes.testServer, '[eyes] server connector')
    hasErr = (await doTest(eyes.testAxios, '[eyes] axios')) || hasErr
    hasErr = (await doTest(eyes.testFetch, '[eyes] node-fetch')) || hasErr
    curlRenderErr = await doTest(eyes.testCurl, '[eyes] cURL')
    hasErr = hasErr || curlRenderErr

    print('[2]  Checking visual grid servers api', vg.url, '\n')
    hasErr = (await doTest(vg.testServer, '[VG] server connector')) || hasErr
    hasErr = (await doTest(vg.testAxios, '[VG] axios')) || hasErr
    hasErr = (await doTest(vg.testFetch, '[VG] node-fetch')) || hasErr
    curlVgErr = await doTest(vg.testCurl, '[VG] cURL')
    hasErr = curlVgErr || hasErr

    print('[3] Checking simple public api', pub.url, '\n')
    restrictedAccess = await doOptionalTest(pub.testAxios, '[public] axios')
    restrictedAccess =
      (await doOptionalTest(pub.testFetch, '[public] node-fetch')) || restrictedAccess
    restrictedAccess = (await doOptionalTest(pub.testCurl, '[public] cURL')) || restrictedAccess

    if (restrictedAccess) {
      printSuccess(`[public] PUBLIC ACCESS TO ${pub.url} IS RESTRICTED\n`)
    } else {
      printSuccess('[public] PUBLIC ACCESS IS ENABLED\n')
    }

    if (hasErr) {
      printErr('\nFAILED!\n')
    } else {
      printSuccess('\nSUCCESS!\n')
    }

    const proxyMsg =
      'YOUR PROXY SEEMS TO BE BLOCKING APPLITOOLS REQUESTS, PLEASE MAKE SURE THE FOLLOWING COMMAND SUCCEED'
    if (curlRenderErr) {
      printErr(`${proxyMsg}:\ncurl -X GET ${eyes.url}\n`)
    }
    if (curlVgErr) {
      printErr(`${proxyMsg}:\n${await vg.getCurlCmd()}\n`)
    }
  }
}

exports.makeCheckNetwork = makeCheckNetwork
