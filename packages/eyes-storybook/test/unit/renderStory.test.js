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

  it('passes correct parameters to testWindow - basic', async () => {
    const testWindow = async x => x;

    const renderStory = makeRenderStory({config: {}, logger, testWindow, performance, timeItAsync});
    const story = {name: 'name', kind: 'kind'};
    const title = getStoryTitle(story);
    const results = await renderStory({
      story,
      resourceUrls: 'resourceUrls',
      resourceContents: 'resourceContents',
      cdt: 'cdt',
      url: 'url',
    });

    deleteUndefinedPropsRecursive(results);

    expect(results).to.eql({
      checkParams: {
        resourceUrls: 'resourceUrls',
        resourceContents: 'resourceContents',
        cdt: 'cdt',
        url: 'url',
      },
      openParams: {
        properties: [
          {name: 'Component name', value: 'kind'},
          {name: 'State', value: 'name'},
        ],
        testName: title,
      },
      throwEx: false,
    });
  });

  it('passes correct parameters to testWindow - local configuration', async () => {
    const testWindow = async x => x;

    const renderStory = makeRenderStory({config: {}, logger, testWindow, performance, timeItAsync});

    const eyesOptions = {
      ignore: 'ignore',
      floating: 'floating',
      accessibility: 'accessibility',
      strict: 'strict',
      layout: 'layout',
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

    const results = await renderStory({story});

    deleteUndefinedPropsRecursive(results);

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
      checkParams,
    });
  });

  it('passes correct parameters to testWindow - global configuration', async () => {
    const testWindow = async x => x;

    const globalConfig = {
      ignore: 'ignore',
      floating: 'floating',
      accessibility: 'accessibility',
      strict: 'strict',
      layout: 'layout',
    };

    const renderStory = makeRenderStory({
      config: globalConfig,
      logger,
      testWindow,
      performance,
      timeItAsync,
    });

    const story = {name: 'name', kind: 'kind'};
    const title = getStoryTitle(story);

    const results = await renderStory({story});

    deleteUndefinedPropsRecursive(results);

    const {...checkParams} = globalConfig;
    expect(results).to.eql({
      throwEx: false,
      openParams: {
        properties: [
          {
            name: 'Component name',
            value: 'kind',
          },
          {
            name: 'State',
            value: 'name',
          },
        ],
        testName: title,
      },
      checkParams,
    });
  });

  it('passes correct parameters to testWindow - local configuration overrides global configuration', async () => {
    const testWindow = async x => x;

    const globalConfig = {
      ignore: 'global ignore',
      floating: 'global floating',
      accessibility: 'global accessibility',
      strict: 'global strict',
      layout: 'global layout',
      ignoreDisplacements: true,
      properties: [{name: 'global Custom property', value: null}],
    };

    const renderStory = makeRenderStory({
      config: globalConfig,
      logger,
      testWindow,
      performance,
      timeItAsync,
    });

    const eyesOptions = {
      ignore: 'ignore',
      floating: 'floating',
      accessibility: 'accessibility',
      strict: 'strict',
      layout: 'layout',
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

    const results = await renderStory({story});

    deleteUndefinedPropsRecursive(results);

    const {ignoreDisplacements, properties, ...checkParams} = eyesOptions; // and NOT globalConfig
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
      checkParams,
    });
  });

  it('sets performance timing', async () => {
    const testWindow = async x => x;

    const renderStory = makeRenderStory({config: {}, logger, testWindow, performance, timeItAsync});

    const story = {name: 'name', kind: 'kind'};
    const title = getStoryTitle(story);
    await renderStory({story});
    expect(performance[title]).not.to.equal(undefined);
  });

  it('throws error during testWindow', async () => {
    const testWindow = async () => {
      await psetTimeout(0);
      throw new Error('bla');
    };

    const renderStory = makeRenderStory({config: {}, logger, testWindow, performance, timeItAsync});
    const [{message}] = await presult(renderStory({story: {}}));
    expect(message).to.equal('bla');
  });
});

function deleteUndefinedPropsRecursive(obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] === undefined) {
        delete obj[prop];
      }
      if (typeof obj[prop] === 'object') {
        deleteUndefinedPropsRecursive(obj[prop]);
      }
    }
  }
}
