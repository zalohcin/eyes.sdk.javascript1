'use strict';
function ptimeout(promiseFunc, timeout, error) {
  return (...args) => {
    let res, rej;
    const p = new Promise((resolve, reject) => ((res = resolve), (rej = reject)));
    let timeoutId = setTimeout(() => ((timeoutId = undefined), rej(error)), timeout);
    promiseFunc(...args)
      .then(result => res(result), err => rej(err))
      .then(() => timeoutId && clearTimeout(timeoutId));
    return p;
  };
}

module.exports = ptimeout;
