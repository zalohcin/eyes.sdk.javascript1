'use strict';
const {presult} = require('@applitools/functional-commons');

function makeCloseEyes({getError, logger, getCheckWindowPromises, wrappers, resolveTests}) {
  return async function closeEyes(throwEx = true) {
    let error;
    if ((error = getError())) {
      logger.log('closeEyes() aborting when started');
      throw error;
    }
    return Promise.all(
      getCheckWindowPromises().map((checkWindowPromise, i) =>
        checkWindowPromise.then(async () => {
          if ((error = getError())) {
            logger.log('closeEyes() aborting after checkWindow');
            throw error;
          }

          const [closeErr, closeResult] = await presult(wrappers[i].close(throwEx));
          resolveTests[i]();
          if (closeErr) {
            throw closeErr;
          }

          return closeResult;
        }),
      ),
    );
  };
}

module.exports = makeCloseEyes;
