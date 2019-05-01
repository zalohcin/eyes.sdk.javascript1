'use strict';

const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const rimrafCB = require('rimraf');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const rimraf = promisify(rimrafCB);
const URL = require('url').URL;
const DIR_NAME = '.debug';

async function handleDebugData(results, metaData = {}, dirPath = DIR_NAME) {
  if (
    !process.env.DEBUG_SAVE ||
    process.env.DEBUG_SAVE === '0' ||
    process.env.DEBUG_SAVE === 'false'
  ) {
    return;
  }
  const isMainDir = dirPath === DIR_NAME;
  if (!fs.existsSync(dirPath)) {
    await mkdir(dirPath);
  } else if (isMainDir) {
    await rimraf('.debug');
    await mkdir(dirPath);
  }

  await Promise.all([
    createFrameData(results, dirPath),
    results.frames.map((f, i) => handleDebugData(f, {}, path.join(dirPath, `frame-${i}`))),
  ]);
  if (isMainDir) {
    await createMetaDataFile(dirPath);
  }

  async function createMetaDataFile(dirPath) {
    await writeFile(
      path.join(dirPath, `INFO-${new Date().toISOString()}.json`),
      JSON.stringify({...metaData, createdAt: new Date().toISOString()}, null, 2),
    );
  }

  async function createFrameData(frame, dirPath) {
    await writeFile(path.join(dirPath, 'cdt.json'), JSON.stringify(frame.cdt, null, 2));
    await writeFile(
      path.join(dirPath, 'resourceUrls.json'),
      JSON.stringify(frame.resourceUrls, null, 2),
    );

    const resourcePath = path.join(dirPath, 'resourceContents');
    if (!fs.existsSync(resourcePath)) {
      await mkdir(resourcePath);
    }
    await Promise.all(
      Object.values(frame.resourceContents).map(
        async r => await writeFile(filePath(resourcePath, r.url), fileValue(r)),
      ),
    );
  }

  function filePath(resourcePath, fileUrl) {
    const fileName =
      (URL(fileUrl).pathname &&
        URL(fileUrl).pathname.match(/([^/]+)(?:\/?)$/) &&
        URL(fileUrl).pathname.match(/([^/]+)(?:\/?)$/)[1]) ||
      'unknown';
    const type = (fileName.match(/(\..+)$/) && fileName.match(/(\..+)$/)[1]) || '';
    return path.join(resourcePath, `${fileName}-${Date.now()}${type}`);
  }

  function fileValue(resource) {
    if (resource.type.includes('text')) {
      return resource.value.toString();
    } else {
      return resource.value;
    }
  }
}

module.exports = handleDebugData;
