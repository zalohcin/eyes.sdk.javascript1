'use strict';

const makeOpenEyes = require('./openEyes');

function makeTestWindow(openConfig) {
  const openEyes = makeOpenEyes({...openConfig, isIsngleWindow: true});
  return async ({openParams, checkParams, throwEx = true}) => {
    const {checkWindow, close} = await openEyes(openParams);
    await checkWindow(checkParams);
    return await close(throwEx);
  };
}

module.exports = makeTestWindow;
