'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const makeRenderBatch = require('../../../src/sdk/renderBatch');
const {RenderStatus} = require('@applitools/eyes.sdk.core');
const FakeRunningRender = require('../../util/FakeRunningRender');
const FakeRenderRequest = require('../../util/FakeRenderRequest');
const createResourceCache = require('../../../src/sdk/createResourceCache');

function createFakeWrapper() {
  return {
    async renderBatch(renderRequests) {
      return renderRequests.map((renderRequest, i) => {
        const renderId = renderRequest.getRenderId();
        return new FakeRunningRender(
          renderId || `id${i + 1}`,
          renderId ? `status${i + 1}` : RenderStatus.NEED_MORE_RESOURCES,
        );
      });
    },
    async putResources(dom, runningRender) {
      this.resourcesPutted.push({dom, renderId: runningRender.getRenderId()});
    },
    resourcesPutted: [],
    _logger: {
      verbose: console.log,
      log: console.log,
    },
  };
}

function putResources(rGridDom, runningRender, wrapper) {
  return wrapper.putResources(rGridDom, runningRender);
}

describe('renderBatch', () => {
  let cache, renderBatch;

  beforeEach(() => {
    cache = createResourceCache();
    renderBatch = makeRenderBatch({putResources, resourceCache: cache});
  });

  it('works', async () => {
    const renderRequests = [
      new FakeRenderRequest('dom1', []),
      new FakeRenderRequest('dom2', []),
      new FakeRenderRequest('dom3', [
        {
          getUrl() {
            return 'url-1';
          },
          getSha256Hash() {
            return 'sha256hash';
          },
          getContentType() {
            return 'contentType';
          },
          getContent() {
            return 'content';
          },
        },
        {
          getUrl() {
            return 'url-2';
          },
          getSha256Hash() {
            return 'sha256hash-2';
          },
          getContentType() {
            return 'text/css';
          },
          getContent() {
            return 'content-2';
          },
        },
      ]),
    ];

    const wrapper = createFakeWrapper();

    const renderIds = await renderBatch(renderRequests, wrapper);
    expect(renderIds).to.eql(['id1', 'id2', 'id3']);

    expect(renderRequests.map(renderRequest => renderRequest.getRenderId())).to.eql([
      'id1',
      'id2',
      'id3',
    ]);

    expect(wrapper.resourcesPutted).to.eql([
      {dom: 'dom1', renderId: 'id1'},
      {dom: 'dom2', renderId: 'id2'},
      {dom: 'dom3', renderId: 'id3'},
    ]);

    expect(cache.getValue('url-1')).to.eql({
      url: 'url-1',
      type: 'contentType',
      hash: 'sha256hash',
      content: undefined,
    });

    expect(cache.getValue('url-2')).to.eql({
      url: 'url-2',
      type: 'text/css',
      hash: 'sha256hash-2',
      content: 'content-2',
    });
  });

  it('throws an error if need-more-resources is received on second render request', async () => {
    // a wrapper that always returns need-more-resources
    const wrapper = {
      async renderBatch() {
        return [new FakeRunningRender('some id', RenderStatus.NEED_MORE_RESOURCES)];
      },

      async putResources() {},
    };
    const error = await renderBatch([new FakeRenderRequest('some dom')], wrapper).then(
      x => x,
      err => err,
    );

    expect(error).to.be.an.instanceof(Error);
  });
});
