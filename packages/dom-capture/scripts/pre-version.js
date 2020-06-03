'use strict';
const {exec} = require('child_process');
const {promisify} = require('util');
const pexec = promisify(exec);

(async () => {
  await pexec('yarn build');
  await pexec('yarn test');
})();
