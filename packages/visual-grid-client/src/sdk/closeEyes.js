'use strict';

function makeCloseEyes({getError, logger, getCheckWindowPromises, wrappers}) {
  return async function closeEyes(throwEx = true) {
    let error;
    if ((error = getError())) {
      logger.log('closeEyes() aborting when started');
      throw error;
    }
    return Promise.all(
      getCheckWindowPromises().map((checkWindowPromise, i) =>
        checkWindowPromise.then(() => {
          if ((error = getError())) {
            logger.log(`closeEyes() aborting after checkWindow (index of browser=${i})`);
            throw error;
          }

          return wrappers[i].close(throwEx);
        }),
      ),
    );
  };
}

module.exports = makeCloseEyes;
