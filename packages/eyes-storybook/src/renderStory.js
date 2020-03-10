'use strict';
const getStoryTitle = require('./getStoryTitle');
const deprecationWarning = require('./deprecationWarning');

function makeRenderStory({config, logger, testWindow, performance, timeItAsync}) {
  const {
    ignore: globalIgnore = [],
    accessibility: globalAccessibility = [],
    floating: globalFloating = [],
    strict: globalStrict = [],
    content: globalContent = [],
    layout: globalLayout = [],
  } = config;

  return function renderStory({story, resourceUrls, resourceContents, frames, cdt, url}) {
    const {name, kind, parameters} = story;
    const title = getStoryTitle({name, kind, parameters});
    const eyesOptions = (parameters && parameters.eyes) || {};
    const {
      ignore = [],
      accessibility = [],
      floating = [],
      strict = [],
      content = [],
      layout = [],
      scriptHooks,
      sizeMode,
      target,
      fully,
      selector,
      region,
      tag,
    } = eyesOptions;

    if (sizeMode) {
      console.log(deprecationWarning("'sizeMode'", "'target'"));
    }

    logger.log('running story', title);

    const openParams = {
      testName: title,
      properties: [
        {name: 'Component name', value: kind},
        {name: 'State', value: name},
      ],
    };

    const checkParams = {
      cdt,
      resourceUrls,
      resourceContents,
      url,
      frames,
      ignore: globalIgnore.concat(ignore),
      floating: globalFloating.concat(floating),
      layout: globalLayout.concat(layout),
      strict: globalStrict.concat(strict),
      content: globalContent.concat(content),
      accessibility: globalAccessibility.concat(accessibility),
      scriptHooks,
      sizeMode,
      target,
      fully,
      selector,
      region,
      tag,
    };

    return timeItAsync(title, async () => {
      return testWindow({openParams, checkParams, throwEx: false});
    }).then(onDoneStory);

    function onDoneStory(results) {
      logger.log('finished story', title, 'in', performance[title]);
      return results;
    }
  };
}

module.exports = makeRenderStory;
