'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const ptimeout = require('../../../src/sdk/ptimeout');
const psetTimeout = require('util').promisify(setTimeout);
const {presult} = require('@applitools/functional-commons');

describe('ptimeout', () => {
  it('works', async () => {
    let _args;
    const func = ptimeout(
      async (...args) => {
        await psetTimeout(500);
        _args = args;
        return 'ok';
      },
      1000,
      'timeout!!!',
    );
    const inputArgs = [1, 2, 3];
    const result = await func(...inputArgs);
    expect(result).to.eql('ok');
    expect(_args).to.eql(inputArgs);
  });

  it('works with sync function', async () => {
    let _args;
    const func = ptimeout(
      (...args) => {
        _args = args;
        return Promise.resolve('ok');
      },
      1000,
      'timeout!!!',
    );
    const inputArgs = [1, 2, 3];
    const result = await func(...inputArgs);
    expect(result).to.eql('ok');
    expect(_args).to.eql(inputArgs);
  });

  it('rejects with timeout', async () => {
    let _args;
    const func = ptimeout(
      async (...args) => {
        await psetTimeout(1000);
        _args = args;
        return 'ok';
      },
      500,
      'timeout!!!',
    );
    const inputArgs = [1, 2, 3];
    const [err] = await presult(func(...inputArgs));
    expect(err).to.eq('timeout!!!');
  });

  it('rejects if the promise rejects', async () => {
    const func = ptimeout(
      async () => {
        await psetTimeout(500);
        return Promise.reject(new Error('rejected!!!'));
      },
      1000,
      'timeout!!!',
    );
    const [err] = await presult(func());
    expect(err.message).to.eq('rejected!!!');
  });

  it('rejects if the promise rejects and has timeout', async () => {
    const func = ptimeout(
      async () => {
        await psetTimeout(500);
        return Promise.reject(new Error('rejected!!!'));
      },
      200,
      new Error('timeout!!!'),
    );
    const [err] = await presult(func());
    expect(err.message).to.eq('timeout!!!');
  });
});
