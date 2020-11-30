'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const chalk = require('chalk');
const errorDigest = require('../../../src/plugin/errorDigest');
const {TestResults} = require('@applitools/visual-grid-client');
const snap = require('snaptdout');

describe('errorDigest', () => {
  it('works', async () => {
    const err1 = new TestResults({
      name: 'test0',
      hostDisplaySize: {width: 4, height: 5},
      url: 'url0',
    });
    err1.error = new Error('bla');
    const err2 = new TestResults({
      name: 'test0',
      hostDisplaySize: {width: 6, height: 7},
      url: 'url0',
    });
    err2.error = new Error('bloo');
    const err3 = new Error('kuku');
    const failed = [err1, err2, err3];
    const diffs = [
      new TestResults({
        name: 'test1',
        hostDisplaySize: {width: 100, height: 200},
        url: 'url1',
        status: 'Unresolved',
      }),
      new TestResults({
        name: 'test2',
        hostDisplaySize: {width: 300, height: 400},
        url: 'url2',
        status: 'Unresolved',
      }),
    ];
    const passed = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
        status: 'Passed',
      }),
    ];

    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    await snap(output, 'works')
  });

  it('should only print existing results', async () => {
    const emptyResult = new TestResults();
    emptyResult.isEmpty = true;
    const passed = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
        status: 'Passed',
      }),
      emptyResult,
    ];
    const failed = [];
    const diffs = [];
    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    await snap(output, 'no empty')
  });

  it('should handle error results', async () => {
    const failure = new Error('i failed you');
    const passed = [];
    const failed = [failure];
    const diffs = [];
    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    await snap(output, 'error results')
  });
});
