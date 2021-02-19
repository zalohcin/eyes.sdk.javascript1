/* global Cypress,cy,window,before,after,navigator */
'use strict';
const poll = require('./poll');
const makeSend = require('./makeSend');
const processPage = require('@applitools/dom-snapshot/dist/processPageCjs');
const domSnapshotOptions = {dontFetchResources: Cypress.config('eyesDisableBrowserFetching')};
const send = makeSend(Cypress.config('eyesPort'), window.fetch);
const makeSendRequest = require('./sendRequest');
const makeEyesCheckWindow = require('./eyesCheckWindow');
const makeHandleCypressViewport = require('./makeHandleCypressViewport');
const sendRequest = makeSendRequest(send);
const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, domSnapshotOptions});
const handleCypressViewport = makeHandleCypressViewport({cy});

function getGlobalConfigProperty(prop) {
  const property = Cypress.config(prop);
  const shouldParse = ['eyesBrowser', 'eyesLayoutBreakpoints'];
  return property ? (shouldParse.includes(prop) ? JSON.parse(property) : property) : undefined;
}

if (!getGlobalConfigProperty('eyesIsDisabled') && getGlobalConfigProperty('eyesLegacyHooks')) {
  const batchEnd = poll(({timeout}) => {
    return sendRequest({command: 'batchEnd', data: {timeout}});
  });

  before(() => {
    const userAgent = navigator.userAgent;
    sendRequest({
      command: 'batchStart',
      data: {userAgent, isInteractive: getGlobalConfigProperty('isInteractive')},
    });
  });

  after(() => {
    cy.then({timeout: 86400000}, () => {
      return batchEnd({timeout: getGlobalConfigProperty('eyesTimeout')}).catch(e => {
        if (!!getGlobalConfigProperty('eyesFailCypressOnDiff')) {
          throw e;
        }
      });
    });
  });
}

let isCurrentTestDisabled;

Cypress.Commands.add('eyesOpen', function(args = {}) {
  Cypress.config('eyesOpenArgs', args);
  Cypress.log({name: 'Eyes: open'});
  const {title: testName} = this.currentTest || this.test;
  const {browser: eyesOpenBrowser, isDisabled} = args;
  const globalBrowser = getGlobalConfigProperty('eyesBrowser');
  const defaultBrowser = {
    width: getGlobalConfigProperty('viewportWidth'),
    height: getGlobalConfigProperty('viewportHeight'),
    name: 'chrome',
  };

  const browser =
    validateBrowser(eyesOpenBrowser) || validateBrowser(globalBrowser) || defaultBrowser;

  if (Cypress.config('eyesIsDisabled') && isDisabled === false) {
    throw new Error(
      `Eyes-Cypress is disabled by an env variable or in the applitools.config.js file, but the "${testName}" test was passed isDisabled:false. A single test cannot be enabled when Eyes.Cypress is disabled through the global configuration. Please remove "isDisabled:false" from cy.eyesOpen() for this test, or enable Eyes.Cypress in the global configuration, either by unsetting the APPLITOOLS_IS_DISABLED env var, or by deleting 'isDisabled' from the applitools.config.js file.`,
    );
  }
  isCurrentTestDisabled = getGlobalConfigProperty('eyesIsDisabled') || isDisabled;
  if (isCurrentTestDisabled) return;

  if (browser) {
    if (Array.isArray(browser)) {
      browser.forEach(fillDefaultBrowserName);
    } else {
      fillDefaultBrowserName(browser);
    }
  }

  return handleCypressViewport(browser).then({timeout: 15000}, () =>
    sendRequest({
      command: 'open',
      data: Object.assign({testName}, args, {browser}),
    }),
  );
});

Cypress.Commands.add('eyesCheckWindow', args => {
  Cypress.log({name: 'Eyes: check window'});
  if (isCurrentTestDisabled) return;
  const eyesOpenArgs = getGlobalConfigProperty('eyesOpenArgs');
  const defaultBrowser = {
    width: getGlobalConfigProperty('viewportWidth'),
    height: getGlobalConfigProperty('viewportHeight'),
  };
  const globalArgs = {
    browser: getGlobalConfigProperty('eyesBrowser'),
    layoutBreakpoints: getGlobalConfigProperty('eyesLayoutBreakpoints'),
  };

  const browser = eyesOpenArgs.browser || globalArgs.browser || defaultBrowser;
  const layoutBreakpoints =
    (args && args.layoutBreakpoints) ||
    (eyesOpenArgs && eyesOpenArgs.layoutBreakpoints) ||
    globalArgs.layoutBreakpoints;

  const checkArgs = {layoutBreakpoints, browser};
  if (typeof args === 'object') {
    Object.assign(checkArgs, args);
  } else {
    Object.assign(checkArgs, {tag: args});
  }

  return cy.document({log: false}).then({timeout: 60000}, doc => eyesCheckWindow(doc, checkArgs));
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  if (isCurrentTestDisabled) {
    isCurrentTestDisabled = false;
    return;
  }
  return sendRequest({command: 'close'});
});

function fillDefaultBrowserName(browser) {
  if (!browser.name && !browser.iosDeviceInfo && !browser.chromeEmulationInfo) {
    browser.name = 'chrome';
  }
}

function validateBrowser(browser) {
  if (!browser) return false;
  if (Array.isArray(browser) && browser.length > 0) return browser;
  if (!browser.width || !browser.height) return browser;
  return false;
}
