'use strict';
const puppeteer = require('puppeteer');
const getStories = require('./browser/getStories');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {getProcessPageAndSerializeScript} = require('@applitools/dom-snapshot');
const {presult} = require('@applitools/functional-commons');
const makeRenderStory = require('./renderStory');
const makeRenderStories = require('./renderStories');
const makeGetStoryData = require('./getStoryData');
const getChunks = require('./getChunks');
const ora = require('ora');
const flatten = require('lodash.flatten');
const chalk = require('chalk');
const filterStories = require('./filterStories');
const addVariationStories = require('./addVariationStories');

const CONCURRENT_PAGES = 3;

async function eyesStorybook({config, logger, performance, timeItAsync}) {
  logger.log('eyesStorybook started');
  const {storybookUrl, waitBeforeScreenshots} = config;
  const browser = await puppeteer.launch(config.puppeteerOptions);
  logger.log('browser launched');
  const page = await browser.newPage();
  const userAgent = await page.evaluate('navigator.userAgent');
  const {openEyes} = makeVisualGridClient({userAgent, ...config, logger: logger.extend('vgc')});

  const processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`;
  logger.log('got script for processPage');
  try {
    page.on('console', msg => {
      logger.log(msg.args().join(' '));
    });

    const spinner = ora('Reading stories');
    spinner.start();
    logger.log('navigating to storybook url:', storybookUrl);
    await page.goto(storybookUrl);

    logger.log('Getting stories from storybook');
    let stories = await page.evaluate(getStories);
    logger.log(`got ${stories.length} stories:`, JSON.stringify(stories));
    spinner.succeed();

    if (process.env.APPLITOOLS_STORYBOOK_DEBUG) {
      stories = stories.slice(0, 5);
    }

    const filteredStories = filterStories({stories, config});

    const storiesIncludingVariations = addVariationStories({stories: filteredStories, config});

    logger.log(`starting to run ${storiesIncludingVariations.length} stories`);

    const pages = await initPagesForBrowser(browser);

    logger.log(`${pages.length} pages open`);

    const getStoryData = makeGetStoryData({logger, processPageAndSerialize, waitBeforeScreenshots});
    const renderStory = makeRenderStory({
      logger: logger.extend('renderStory'),
      openEyes,
      performance,
      timeItAsync,
    });
    const renderStories = makeRenderStories({
      getChunks,
      getStoryData,
      pages,
      renderStory,
      storybookUrl,
      logger,
    });

    logger.log('finished creating functions');

    const [error, results] = await presult(
      timeItAsync('renderStories', () => renderStories(storiesIncludingVariations)),
    );

    if (error) {
      console.log(chalk.red(`Error when rendering stories: ${error}`));
      return [];
    } else {
      return flatten(results);
    }
  } catch (ex) {
    logger.log(ex);
    if (ex instanceof SyntaxError) {
      throw ex;
    }
  } finally {
    logger.log('total time: ', performance['renderStories']);
    logger.log('perf results', performance);
    await browser.close();
  }

  async function initPagesForBrowser(browser) {
    return Promise.all(
      new Array(CONCURRENT_PAGES).fill().map(async () => {
        const page = await browser.newPage();
        const [err] = await presult(
          page.goto(`${storybookUrl}/iframe.html?eyes-storybook=true`, {timeout: 10000}),
        );
        if (err) {
          logger.log(`error navigating to iframe.html`, err);
          throw err;
        }
        return page;
      }),
    );
  }
}

module.exports = eyesStorybook;
