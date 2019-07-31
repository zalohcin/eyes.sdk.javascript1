'use strict';
const mapValues = require('lodash.mapvalues');
const {loadFixtureBuffer} = require('./loadFixture');
const toRGridResource = require('./toRGridResource');

function getTestSvgResources(baseUrl) {
  const jpgName1 = 'gargamel.jpg';
  const jpgName2 = 'gargamel1.jpg';
  const jpgName3 = 'smurfs3.jpg';
  const jpgName4 = 'smurfs4.jpg';
  const jpgUrl1 = `${baseUrl}/${jpgName1}`;
  const jpgUrl2 = `${baseUrl}/${jpgName2}`;
  const jpgUrl3 = `${baseUrl}/${jpgName3}`;
  const jpgUrl4 = `${baseUrl}/${jpgName4}`;
  const jpgContent1 = loadFixtureBuffer(jpgName1);
  const jpgContent2 = loadFixtureBuffer(jpgName2);
  const jpgContent3 = loadFixtureBuffer(jpgName3);
  const jpgContent4 = loadFixtureBuffer(jpgName4);
  const svgType = 'image/jpeg';

  return mapValues(
    {
      [jpgUrl1]: {type: svgType, value: jpgContent1},
      [jpgUrl2]: {type: svgType, value: jpgContent2},
      [jpgUrl3]: {type: svgType, value: jpgContent3},
      [jpgUrl4]: {type: svgType, value: jpgContent4},
    },
    (o, url) => toRGridResource({type: o.type, value: o.value, url}),
  );
}

module.exports = getTestSvgResources;
