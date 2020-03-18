'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const makeRenderStory = require('../../src/renderStory');
const {presult} = require('@applitools/functional-commons');
const {makeTiming} = require('@applitools/monitoring-commons');
const psetTimeout = require('util').promisify(setTimeout);
const getStoryTitle = require('../../src/getStoryTitle');
const logger = require('../util/testLogger');

describe('renderStory', () => {
  let performance, timeItAsync;

  beforeEach(() => {
    const timing = makeTiming();
    performance = timing.performance;
    timeItAsync = timing.timeItAsync;
  });

  it('calls testWindow with proper arguments and sets performance timing', async () => {
    const testWindow = async x => x;

    const config = {
      ignore: ['globalIgnore'],
    };

    const renderStory = makeRenderStory({config, logger, testWindow, performance, timeItAsync});

    const cdt = 'cdt';
    const resourceUrls = 'resourceUrls';
    const resourceContents = 'resourceContents';
    const url = 'url';
    const eyesOptions = {
      ignore: ['ignore'],
      floating: ['floating'],
      accessibility: ['accessibility'],
      strict: ['strict'],
      layout: ['layout'],
      scriptHooks: 'scriptHooks',
      sizeMode: 'sizeMode',
      target: 'target',
      fully: 'fully',
      selector: 'selector',
      region: 'region',
      tag: 'tag',
      ignoreDisplacements: true,
      properties: [{name: 'Custom property', value: null}],
    };
    const story = {name: 'name', kind: 'kind', parameters: {eyes: eyesOptions}};
    const title = getStoryTitle(story);

    const results = await renderStory({story, resourceUrls, resourceContents, cdt, url});

    const {ignoreDisplacements, properties, ...checkParams} = eyesOptions;
    expect(results).to.eql({
      throwEx: false,
      openParams: {
        ignoreDisplacements,
        properties: [
          {
            name: 'Component name',
            value: 'kind',
          },
          {
            name: 'State',
            value: 'name',
          },
          ...properties,
        ],
        testName: title,
      },
      checkParams: {
        cdt,
        resourceContents,
        resourceUrls,
        url,
        frames: undefined,
        content: [],
        ...checkParams,
        ignore: config.ignore.concat(eyesOptions.ignore),
      },
    });

    expect(performance[title]).not.to.equal(undefined);
  });

  it('throws error during testWindow', async () => {
    const testWindow = async () => {
      await psetTimeout(0);
      throw new Error('bla');
    };

    const renderStory = makeRenderStory({logger, testWindow, performance, timeItAsync});
    const [{message}] = await presult(renderStory({story: {}}));
    expect(message).to.equal('bla');
  });
});
