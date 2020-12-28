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

if (!Cypress.config('eyesIsDisabled')) {
  const batchEnd = poll(({timeout}) => {
    return sendRequest({command: 'batchEnd', data: {timeout}});
  });

  before(() => {
    const userAgent = navigator.userAgent;
    const viewport = {
      width: getGlobalConfigProperty('viewportWidth'),
      height: getGlobalConfigProperty('viewportHeight'),
    };
    let browser = getGlobalConfigProperty('eyesBrowser');
    handleCypressViewport(browser).then({timeout: 86400000}, () =>
      sendRequest({command: 'batchStart', data: {viewport, userAgent}}),
    );
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
  if (Cypress.config('eyesIsDisabled') && args.isDisabled === false) {
    throw new Error(
      `Eyes-Cypress is disabled by an env variable or in the applitools.config.js file, but the "${testName}" test was passed isDisabled:false. A single test cannot be enabled when Eyes.Cypress is disabled through the global configuration. Please remove "isDisabled:false" from cy.eyesOpen() for this test, or enable Eyes.Cypress in the global configuration, either by unsetting the APPLITOOLS_IS_DISABLED env var, or by deleting 'isDisabled' from the applitools.config.js file.`,
    );
  }
  isCurrentTestDisabled = getGlobalConfigProperty('eyesIsDisabled') || args.isDisabled;
  if (isCurrentTestDisabled) return;

  return handleCypressViewport(args.browser).then({timeout: 15000}, () =>
    sendRequest({
      command: 'open',
      data: Object.assign({testName}, args),
    }),
  );
});

Cypress.Commands.add('eyesCheckWindow', args => {
  Cypress.log({name: 'Eyes: check window'});
  if (isCurrentTestDisabled) return;

  const defaultBrowser = {width: 800, height: 600, name: 'chrome'};
  const eyesOpenArgs = getGlobalConfigProperty('eyesOpenArgs');
  const globalArgs = {
    browser: getGlobalConfigProperty('eyesBrowser'),
    layoutBreakpoints: getGlobalConfigProperty('eyesLayoutBreakpoints'),
  };

  const browser = eyesOpenArgs.browser || globalArgs.browser || defaultBrowser;
  const layoutBreakpoints =
    (args && args.layoutBreakpoints) ||
    (eyesOpenArgs && eyesOpenArgs.layoutBreakpoints) ||
    globalArgs.layoutBreakpoints;

  const checkArgs = Object.assign(globalArgs, eyesOpenArgs, args);
  if (typeof args === 'object') {
    Object.assign(checkArgs, layoutBreakpoints, browser);
  } else {
    Object.assign(checkArgs, {tag: args}, browser, layoutBreakpoints);
  }

  return cy
    .document({log: false})
    .then({timeout: 60000}, async doc => await eyesCheckWindow(doc, checkArgs));
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  if (isCurrentTestDisabled) {
    isCurrentTestDisabled = false;
    return;
  }
  return sendRequest({command: 'close'});
});
