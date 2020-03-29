'use strict';
const getStoryTitle = require('./getStoryTitle');
const deprecationWarning = require('./deprecationWarning');

function makeRenderStory({config, logger, testWindow, performance, timeItAsync}) {
  return function renderStory({story, resourceUrls, resourceContents, frames, cdt, url}) {
    const {name, kind, parameters} = story;
    const title = getStoryTitle({name, kind, parameters});
    const eyesOptions = (parameters && parameters.eyes) || {};
    const {
      ignoreDisplacements,
      ignore,
      accessibility,
      floating,
      strict,
      content,
      layout,
      scriptHooks,
      sizeMode,
      target,
      fully,
      selector,
      region,
      tag,
      properties,
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
        ...(properties !== undefined ? properties : config.properties || []),
      ],
      ignoreDisplacements,
    };

    const checkParams = {
      cdt,
      resourceUrls,
      resourceContents,
      url,
      frames,
      ignore: ignore !== undefined ? ignore : config.ignore,
      floating: floating !== undefined ? floating : config.floating,
      layout: layout !== undefined ? layout : config.layout,
      strict: strict !== undefined ? strict : config.strict,
      content: content !== undefined ? content : config.content,
      accessibility: accessibility !== undefined ? accessibility : config.accessibility,
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
