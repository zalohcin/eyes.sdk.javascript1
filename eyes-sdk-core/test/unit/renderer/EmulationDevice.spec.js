'use strict';

const assert = require('assert');

const { EmulationDevice } = require('../../../index');

describe('EmulationDevice', () => {
  it('constructor without arguments', () => {
    const emulationDevice = new EmulationDevice();
    assert.equal(emulationDevice.hasOwnProperty('_width'), true);
    assert.equal(emulationDevice.hasOwnProperty('_height'), true);
    assert.equal(emulationDevice.hasOwnProperty('_deviceScaleFactor'), true);
    assert.equal(emulationDevice.hasOwnProperty('_mobile'), true);
  });

  it('constructor with arguments', () => {
    const emulationDevice = new EmulationDevice({ width: 1, height: 2, deviceScaleFactor: 3, mobile: true });
    assert.equal(emulationDevice.getWidth(), 1);
    assert.equal(emulationDevice.getHeight(), 2);
    assert.equal(emulationDevice.getDeviceScaleFactor(), 3);
    assert.equal(emulationDevice.getMobile(), true);
  });

  it('toJSON', () => {
    const emulationDeviceObj = { width: 1, height: 2, deviceScaleFactor: 3, mobile: true };
    const emulationDevice = new EmulationDevice(emulationDeviceObj);
    assert.deepEqual(emulationDevice.toJSON(), emulationDeviceObj);
  });

  it('toString', () => {
    const emulationDeviceObj = { width: 1, height: 2, deviceScaleFactor: 3, mobile: true };
    const emulationDevice = new EmulationDevice(emulationDeviceObj);
    assert.deepEqual(emulationDevice.toString(), 'EmulationDevice { {"width":1,"height":2,"deviceScaleFactor":3,"mobile":true} }');
  });
});
