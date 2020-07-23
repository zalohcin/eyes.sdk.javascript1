'use strict';
const fs = require('fs');
const path = require('path');

const resultsFilename = path.resolve(
  __dirname,
  '../custom-page-result/recordFetchesMiddlewareResults.txt',
);

module.exports = (req, _res, next) => {
  fs.appendFileSync(resultsFilename, JSON.stringify({url: req.url, headers: req.headers}) + '\n');
  next();
};

module.exports.startRecord = () => {
  try {
    fs.unlinkSync(resultsFilename);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return;
    }
    throw err;
  }
};

module.exports.playback = () => {
  return fs
    .readFileSync(resultsFilename, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l));
};
