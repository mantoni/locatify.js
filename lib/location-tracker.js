/*
 * geo-tales-mobile
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global navigator*/
'use strict';

var events = require('events');


var POSITION_ERRORS = {
  1: 'Position tracking not allowed',
  2: 'Position tracking unavailable',
  3: 'Position tracking timeout',
  DEFAULT: 'Position tracking error'
};


exports.create = function () {
  var location = new events.EventEmitter();

  function success(event) {
    location.emit('position', {
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      accuracy: event.coords.accuracy
    });
  }

  function error(err) {
    err.message = POSITION_ERRORS[err.code] || POSITION_ERRORS.DEFAULT;
    location.emit('error', err);
  }

  var watch = navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0
  });

  function orientationChange(event) {
    location.emit('heading', event.hasOwnProperty('webkitCompassHeading')
        ? event.webkitCompassHeading
        : event.alpha);
  }

  global.addEventListener('deviceorientation', orientationChange, false);

  location.destroy = function () {
    global.removeEventListener('deviceorientation', orientationChange);
    location.removeAllListeners();
    navigator.geolocation.clearWatch(watch);
  };

  return location;
};
