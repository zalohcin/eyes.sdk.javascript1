#!/usr/bin/env node
/* eslint-disable no-console */

'use strict';

const chalk = require('chalk');
const eyes = require('../lib/troubleshoot/eyes');
const pub = require('../lib/troubleshoot/public');
const vg = require('../lib/troubleshoot/vg');
const { userConfig, presult } = require('../lib/troubleshoot/utils');

const print = (...msg) => process.stdout.write(chalk.cyan(...msg));
const printErr = (...msg) => process.stdout.write(chalk.red(...msg));
const printSuccess = (...msg) => process.stdout.write(chalk.green(...msg));

const doTest = async (func, name) => {
  print(name, '- [ ? ]');
  const [err, _res] = await presult(func());
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  if (err) {
    printErr(name, '- [ X ]', err, '\n');
  } else {
    printSuccess(name, '- [ OK ]', err, '\n');
  }
  return !!err;
};

const doOptionalTest = async (func, name) => {
  print(name, '- [ ? ]');
  const [err, _res] = await presult(func());
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  if (err) {
    printSuccess(name, '- [ X ]', err, '\n');
  } else {
    printSuccess(name, '- [ OK ]', err, '\n');
  }
  return !!err;
};

if (!userConfig.apiKey) {
  printErr('missing "apiKey" add APPLITOOLS_API_KEY as an env variable or add "apiKey" in applitools.config.js\n');
  return;
}

print('Netwrok Sanity running with', JSON.stringify(userConfig), '\n\n');

(async () => {
  let hasErr = false;
  let restrictedAccess = true;
  let curlRenderErr = true;
  let curlVgErr = true;

  print('[1] Checking eyes servers api', eyes.url, '\n');
  hasErr = await doTest(eyes.testServer, '[eyes] server connector');
  hasErr = await doTest(eyes.testAxios, '[eyes] axios') || hasErr;
  hasErr = await doTest(eyes.testFetch, '[eyes] node-fetch') || hasErr;
  curlRenderErr = await doTest(eyes.testCurl, '[eyes] cURL');
  hasErr = hasErr || curlRenderErr;

  print('[2]  Checking Visual Grid servers api', vg.url, '\n');
  hasErr = await doTest(vg.testServer, '[VG] server connector') || hasErr;
  hasErr = await doTest(vg.testAxios, '[VG] axios') || hasErr;
  hasErr = await doTest(vg.testFetch, '[VG] node-fetch') || hasErr;
  curlVgErr = await doTest(vg.testCurl, '[VG] cURL');
  hasErr = curlVgErr || hasErr;

  print('[3] Checking simple public api', pub.url, '\n');
  restrictedAccess = await doOptionalTest(pub.testAxios, '[public] axios');
  restrictedAccess = await doOptionalTest(pub.testFetch, '[public] node-fetch') || restrictedAccess;
  restrictedAccess = await doOptionalTest(pub.testCurl, '[public] cURL') || restrictedAccess;

  if (restrictedAccess) {
    printSuccess(`[public] PUBLIC ACCESS TO ${pub.url} IS RESTRICTED\n`);
  } else {
    printSuccess('[public] PUBLIC ACCESS IS ENABLED\n');
  }

  console.log('');
  if (hasErr) {
    printErr('FAILED!\n');
  } else {
    printSuccess('SUCCESS!\n');
  }

  const proxyMsg = 'YOUR PROXY SEEMS TO BE BLOCKING APPLITOOLS REQUESTS, PLEASE MAKE SURE THE FOLLOWING COMMAND SUCCEED';
  if (curlRenderErr) {
    printErr(`${proxyMsg}:\ncurl -X GET ${eyes.url}\n`);
  }
  if (curlVgErr) {
    printErr(`${proxyMsg}:\n${await vg.getCurlCmd()}\n`);
  }
})();
