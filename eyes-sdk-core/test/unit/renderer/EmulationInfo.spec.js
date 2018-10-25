'use strict';

const assert = require('assert');

const { EmulationDevice, EmulationInfo, ScreenOrientation } = require('../../../index');

describe('EmulationInfo', () => {
  it('constructor without arguments', () => {
    const emulationInfo = new EmulationInfo();
    assert.equal(emulationInfo.hasOwnProperty('_device'), true);
    assert.equal(emulationInfo.hasOwnProperty('_deviceName'), true);
    assert.equal(emulationInfo.hasOwnProperty('_screenOrientation'), true);
  });

  it('constructor with arguments', () => {
    const device = new EmulationDevice({ width: 1, height: 2 });
    const emulationInfo = new EmulationInfo({ device, screenOrientation: ScreenOrientation.PORTRAIT });
    assert.equal(emulationInfo.getDevice(), device);
    assert.equal(emulationInfo.getDeviceName(), undefined);
    assert.equal(emulationInfo.getScreenOrientation(), ScreenOrientation.PORTRAIT);

    const emulationInfo2 = new EmulationInfo({ deviceName: 'name' });
    assert.equal(emulationInfo2.getDevice(), undefined);
    assert.equal(emulationInfo2.getDeviceName(), 'name');
    assert.equal(emulationInfo2.getScreenOrientation(), undefined);
  });

  it('fromObject', () => {
    const deviceObj = { width: 1, height: 2, deviceScaleFactor: 3, mobile: true };
    const device = EmulationDevice.fromObject(deviceObj);

    const emulationInfo = EmulationInfo.fromObject({
      screenOrientation: ScreenOrientation.LANDSCAPE,
      device: deviceObj,
    });

    assert.deepEqual(emulationInfo.getDevice(), device);
    assert.equal(emulationInfo.getScreenOrientation(), ScreenOrientation.LANDSCAPE);
  });

  it('toJSON', () => {
    const device = new EmulationDevice({ width: 1, height: 2 });
    const emulationInfo = new EmulationInfo({ device, screenOrientation: ScreenOrientation.LANDSCAPE });
    assert.deepEqual(emulationInfo.toJSON(), { width: 1, height: 2, mobile: undefined, deviceScaleFactor: undefined, screenOrientation: ScreenOrientation.LANDSCAPE });

    const emulationInfo2 = new EmulationInfo({ deviceName: 'name' });
    assert.deepEqual(emulationInfo2.toJSON(), { deviceName: 'name', screenOrientation: undefined });
  });

  it('toString', () => {
    const device = new EmulationDevice({ width: 1, height: 2 });
    const emulationInfo = new EmulationInfo({ device, screenOrientation: ScreenOrientation.LANDSCAPE });
    assert.deepEqual(emulationInfo.toString(), 'EmulationInfo { {"screenOrientation":"landscape","width":1,"height":2} }');

    const emulationInfo2 = new EmulationInfo({ deviceName: 'name' });
    assert.deepEqual(emulationInfo2.toString(), 'EmulationInfo { {"deviceName":"name"} }');
  });
});
