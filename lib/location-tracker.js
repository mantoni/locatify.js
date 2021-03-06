/*
 * locatify.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

const events = require('events');


const POSITION_ERRORS = {
  1: 'Position tracking not allowed',
  2: 'Position tracking unavailable',
  3: 'Position tracking timeout',
  DEFAULT: 'Position tracking error'
};


exports.create = function () {
  const location = new events.EventEmitter();

  function success(event) {
    location.emit('position', {
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      accuracy: event.coords.accuracy
    });
  }

  function error(err) {
    const e = new Error(POSITION_ERRORS[err.code] || POSITION_ERRORS.DEFAULT);
    e.code = err.code;
    location.emit('error', e);
  }

  const watch = navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0
  });

  let previousHeading;
  let removeEventListener = null;

  function orientationChange(event) {
    let value;
    if (event.webkitCompassHeading !== undefined) {
      value = event.webkitCompassHeading;
      if (typeof value !== 'number') {
        return;
      }
      value = Math.floor(value);
    } else {
      if (!event.absolute) {
        removeEventListener();
        const e = new Error('Orientation tracking not absolute');
        e.code = 'E_RELATIVE';
        location.emit('error', e);
        return;
      }
      if (typeof event.alpha !== 'number') {
        return;
      }
      value = 360 - Math.floor(event.alpha);
    }
    if (value !== previousHeading) {
      previousHeading = value;
      location.emit('heading', value);
    }
  }

  removeEventListener = function () {
    global.removeEventListener('deviceorientation', orientationChange);
    global.removeEventListener('deviceorientationabsolute', orientationChange);
  };

  if ('ondeviceorientationabsolute' in window) {
    global.addEventListener('deviceorientationabsolute', orientationChange,
      false);
  } else {
    global.addEventListener('deviceorientation', orientationChange, false);
  }

  location.destroy = function () {
    removeEventListener();
    location.removeAllListeners();
    navigator.geolocation.clearWatch(watch);
  };

  return location;
};
