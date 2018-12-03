'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeWaitForRenderedStatus = require('../../../src/sdk/waitForRenderedStatus');
const {failMsg} = makeWaitForRenderedStatus;
const {RenderStatus, RenderStatusResults} = require('@applitools/eyes-sdk-core');
const testLogger = require('../../util/testLogger');
const psetTimeout = require('util').promisify(setTimeout);
const {presult} = require('@applitools/functional-commons');

function toRenderStatuses(plainStatuses) {
  return plainStatuses.map(status => new RenderStatusResults({status}));
}

describe('waitForRenderedStatus', () => {
  it('returns rendered result', async () => {
    const expectedStatuses = toRenderStatuses([RenderStatus.RENDERED, RenderStatus.RENDERED]);
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      doGetRenderStatus: async () => expectedStatuses,
    });
    const statuses = await waitForRenderedStatus(['render1', 'render2']);
    expect(statuses).to.eql(expectedStatuses.map(x => x.toJSON()));
  });

  it('polls until rendered', async () => {
    let counter = 0;

    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getStatusInterval: 100,
      doGetRenderStatus: async () => {
        if (counter++ < 2) {
          return toRenderStatuses([RenderStatus.RENDERING, RenderStatus.RENDERING]);
        } else {
          return toRenderStatuses([RenderStatus.RENDERED, RenderStatus.RENDERED]);
        }
      },
    });

    const notYetPromise = Promise.race([
      presult(
        waitForRenderedStatus(['render1', 'render2']).then(statuses => {
          expect(statuses).to.eql(toRenderStatuses([RenderStatus.RENDERED, RenderStatus.RENDERED]));
        }),
      ),
      psetTimeout(150).then(() => 'not yet'),
    ]);
    expect(counter).to.equal(1);
    await psetTimeout(150);
    expect(counter).to.equal(2);
    await psetTimeout(100);
    expect(counter).to.equal(3);
    expect(await notYetPromise).to.equal('not yet');
  });

  it('stops polling when stop condition is met', async () => {
    let stop = false;
    psetTimeout(50).then(() => (stop = true));
    const expectedStatuses = toRenderStatuses([RenderStatus.RENDERING]); // this is important, because of the stop condition we will get a result of RENDERING
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getStatusInterval: 50,
      doGetRenderStatus: async () => expectedStatuses,
    });
    const statuses = await waitForRenderedStatus(['render1', 'render2'], () => stop);
    expect(statuses).to.eql(expectedStatuses.map(x => x.toJSON()));
  });

  it("throws error if there's an error in render", async () => {
    let output = '';
    const expectedStatuses = [
      new RenderStatusResults({status: RenderStatus.RENDERING}),
      new RenderStatusResults({status: RenderStatus.ERROR, error: 'bla'}),
    ];
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: {log: (...args) => (output += args.join(', '))},
      doGetRenderStatus: async () => expectedStatuses,
    });
    const [err, _statuses] = await presult(waitForRenderedStatus(['render1', 'render2']));
    expect(err).to.be.an.instanceOf(Error);
    expect(output).to.equal('render error received: bla');
    expect(err.message).to.equal(failMsg);
  });

  it('keeps trying if wrapper throws exception (e.g. 500 Internal server error)', async () => {
    let output = '';
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: {log: (...args) => (output += args.join(', '))},
      timeout: 100,
      getStatusInterval: 50,
      doGetRenderStatus: async () => {
        throw new Error('bla');
      },
    });
    const [err, _statuses] = await presult(waitForRenderedStatus(['render1', 'render2']));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.equal(failMsg);
    expect(output).to.contain(
      'error during getRenderStatus: Error: blaerror during getRenderStatus: Error: bla',
    );
  });

  it('throws error on timeout', async () => {
    const expectedStatuses = toRenderStatuses([RenderStatus.RENDERING, RenderStatus.RENDERING]);
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      timeout: 200,
      getStatusInterval: 50,
      doGetRenderStatus: async () => expectedStatuses,
    });
    const [err, _statuses] = await presult(waitForRenderedStatus(['render1', 'render2']));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.equal(failMsg);
  });
});
