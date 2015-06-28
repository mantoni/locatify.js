/*
 * locatify.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global describe, it, before, after, beforeEach, afterEach, document,
  navigator*/
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var tracker = require('../lib/location-tracker');
var fakeLocation = require('./util/fake-location');


describe('location-tracker', function () {
  var loc;
  var track;
  var watch;

  beforeEach(function () {
    loc = fakeLocation.create();
    track = tracker.create();
    watch = navigator.geolocation.watchPosition;
  });

  afterEach(function () {
    loc.destroy();
    track.destroy();
  });

  it('watches position', function () {
    sinon.assert.calledOnce(watch);
    sinon.assert.calledWith(watch, sinon.match.func, sinon.match.func, {
      enableHighAccuracy: true,
      maximumAge: 0
    });
  });

  it('emits "error" event if position unavailable', function () {
    var spy = sinon.spy();
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

  it('emits "error" event for unknown error', function () {
    var spy = sinon.spy();
    track.on('error', spy);

    watch.firstCall.args[1]({
      message: 'broken'
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      message: 'Position tracking error'
    });
  });

  it('emits "position" on position change', function () {
    var spy = sinon.spy();
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

  it('emits "heading" on orientation change (standard)', function () {
    var spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      alpha: 120
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 120);
  });

  it('emits "heading" on orientation change (webkit)', function () {
    var spy = sinon.spy();
    track.on('heading', spy);

    loc.updateOrientation({
      alpha: 6,
      webkitCompassHeading: 120
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 120);
  });

  it('does not emit "heading" after destroy', function () {
    var spy = sinon.spy();
    track.on('heading', spy);
    track.destroy();

    loc.updateOrientation({
      alpha: 120
    });

    sinon.assert.notCalled(spy);
  });

  it('removes watch on destroy', function () {
    track.destroy();

    sinon.assert.calledOnce(navigator.geolocation.clearWatch);
  });

});
