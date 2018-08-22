'use strict';

function makeCloseEyes({getError, logger, getCheckWindowPromises, wrappers}) {
  return async function closeEyes(throwEx = true) {
    let error;
    if ((error = getError())) {
      logger.log('closeEyes() aborting when started');
      throw error;
    }
    await Promise.all(getCheckWindowPromises());
    if ((error = getError())) {
      logger.log('closeEyes() aborting after checkWindow');
      throw error;
    }
    return await Promise.all(wrappers.map(wrapper => wrapper.close(throwEx)));
  };
}

module.exports = makeCloseEyes;
