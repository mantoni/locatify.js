/*eslint-env mocha*/
/*
 * locatify.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

const sinon = require('sinon');
const tracker = require('../lib/location-tracker');
const fakeLocation = require('./util/fake-location');


describe('location-tracker', () => {
  let loc;
  let track;
  let watch;

  beforeEach(() => {
    loc = fakeLocation.create();
    track = tracker.create();
    watch = navigator.geolocation.watchPosition;
  });

  afterEach(() => {
    loc.destroy();
    track.destroy();
  });

  it('watches position', () => {
    sinon.assert.calledOnce(watch);
    sinon.assert.calledWith(watch, sinon.match.func, sinon.match.func, {
      enableHighAccuracy: true,
      maximumAge: 0
    });
  });

  it('emits "error" event if position unavailable', () => {
    const spy = sinon.spy();
    track.on('error', spy);

    watch.firstCall.args[1]({
      code: 2,
      message: 'broken'
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      code: 2,
      message: 'Position tracking unavailable'
    });
  });

  it('emits "error" event for unknown error', () => {
    const spy = sinon.spy();
    track.on('error', spy);

    watch.firstCall.args[1]({
      message: 'broken'
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      message: 'Position tracking error'
    });
  });

  it('emits "position" on position change', () => {
    const spy = sinon.spy();
    track.on('position', spy);

    watch.firstCall.args[0]({
      coords: {
        longitude: 47.32,
        latitude: 9.12,
        accuracy: 25
      }
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, {
      longitude: 47.32,
      latitude: 9.12,
      accuracy: 25
    });
  });

  it('emits "heading" on orientation change (standard)', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      alpha: 120.3
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 240);
  });

  it('emits "heading" on orientation change (webkit)', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      alpha: 6,
      webkitCompassHeading: 120.3
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 120);
  });

  it('emits "error" event once if standard event is not absolute', () => {
    const error = sinon.spy();
    track.on('error', error);
    const heading = sinon.spy();
    track.on('heading', heading);

    loc.updateOrientation({
      absolute: false,
      alpha: 6
    });
    loc.updateOrientation({
      absolute: false,
      alpha: 7
    });

    sinon.assert.calledOnce(error);
    sinon.assert.calledWithMatch(error, {
      code: 'E_RELATIVE',
      message: 'Orientation tracking not absolute'
    });
    sinon.assert.notCalled(heading);
  });

  it('does not emit "heading" if value is null (standard)', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      alpha: null
    });

    sinon.assert.notCalled(spy);
  });

  it('does not emit "heading" if value is null (webkit)', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      webkitCompassHeading: null
    });

    sinon.assert.notCalled(spy);
  });

  it('does not emit "heading" if none of the values is given', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true
    });

    sinon.assert.notCalled(spy);
  });

  it('does not emit "heading" after destroy', () => {
    const spy = sinon.spy();
    track.on('heading', spy);
    track.destroy();

    loc.updateOrientation({
      absolute: true,
      alpha: 120
    });

    sinon.assert.notCalled(spy);
  });

  it('does not emit same value twice', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      alpha: 120.1
    });
    loc.updateOrientation({
      absolute: true,
      alpha: 120.2
    });

    sinon.assert.calledOnce(spy);
  });

  it('emits differing values', () => {
    const spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      absolute: true,
      alpha: 120.1
    });
    loc.updateOrientation({
      absolute: true,
      alpha: 121.1
    });

    sinon.assert.calledTwice(spy);
  });

  it('removes watch on destroy', () => {
    track.destroy();

    sinon.assert.calledOnce(navigator.geolocation.clearWatch);
  });

});
