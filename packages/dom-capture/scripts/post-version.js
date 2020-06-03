'use strict';
const {exec} = require('child_process');
const {promisify} = require('util');
const pexec = promisify(exec);
const {version} = require('../package.json');

(async () => {
  await pexec('yarn build');
  await pexec('git add dist');
  await pexec(`git commit -m "[auto] dom-capture: dist scripts for v${version}"`);
})();
