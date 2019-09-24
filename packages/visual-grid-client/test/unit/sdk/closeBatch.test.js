'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const makeCloseBatch = require('../../../src/sdk/makeCloseBatch');

describe('closeBatch', () => {
  let batches;
  let closeBatch;

  beforeEach(() => {
    batches = [];
    closeBatch = makeCloseBatch(batches);
  });

  it('works', async () => {
    let _deleteCalledWith;
    const deleteBatchSessions = async id => (_deleteCalledWith = id);
    batches.push({id: 'someId', deleteBatchSessions});
    await closeBatch();
    expect(_deleteCalledWith).to.equal('someId');
  });

  it('works for many batch IDs', async () => {
    let _deleteCalledWith = [];
    const deleteBatchSessions = async id => _deleteCalledWith.push(id);
    batches.push({id: 'someId', deleteBatchSessions});
    batches.push({id: 'someId2', deleteBatchSessions});
    await closeBatch();
    expect(_deleteCalledWith).to.eql(['someId', 'someId2']);
  });

  it('ignores missing IDs', async () => {
    let _deleteCalledWith = [];
    const deleteBatchSessions = async id => _deleteCalledWith.push(id);
    batches.push({deleteBatchSessions});
    batches.push({id: 'someId2', deleteBatchSessions});
    await closeBatch();
    expect(_deleteCalledWith).to.eql(['someId2']);
  });
});
