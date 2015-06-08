/*
 * locatify.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global document, navigator*/
'use strict';

var sinon = require('sinon');

if (!navigator.geolocation) {
  var noop = function () { return; };
  // PhantomJS doesn't support geolocation.
  navigator.geolocation = {
    watchPosition: noop,
    clearWatch: noop
  };
}

exports.create = function () {
  var watch = sinon.stub(navigator.geolocation, 'watchPosition');
  var clear = sinon.stub(navigator.geolocation, 'clearWatch');

  return {

    updateOrientation: function (props) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('deviceorientation', true, true);
      if (props) {
        Object.keys(props).forEach(function (key) {
          event[key] = props[key];
        });
      }
      document.dispatchEvent(event);
    },

    destroy: function () {
      watch.restore();
      clear.restore();
    }
  };
};
