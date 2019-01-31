'use strict';
const {presult} = require('@applitools/functional-commons');

function makeCloseEyes({
  getError,
  logger,
  getCheckWindowPromises,
  wrappers,
  resolveTests,
  openEyesPromises,
}) {
  return async function closeEyes(throwEx = true) {
    let error;
    if ((error = getError())) {
      logger.log('closeEyes() aborting when started');
      throw error;
    }
    return Promise.all(
      getCheckWindowPromises().map((checkWindowPromise, i) =>
        checkWindowPromise
          .then(() => openEyesPromises[i]) // the close job must start after openEyes has finished, otherwise resolving the whole test in will fail, because the test was never started. This situation could happen when a render fails and the checkWindow promise is rejected before waiting on openEyesPromise.;
          .then(async () => {
            if ((error = getError())) {
              logger.log('closeEyes() aborting after checkWindow');
              resolveTests[i]();
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
