/*
 * locatify.js
 *
 * Copyright (c) 2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

const sinon = require('sinon');

exports.create = function () {
  const watch = sinon.stub(navigator.geolocation, 'watchPosition');
  const clear = sinon.stub(navigator.geolocation, 'clearWatch');

  return {

    updateOrientation(props) {
      const event = document.createEvent('HTMLEvents');
      if ('ondeviceorientationabsolute' in window) {
        event.initEvent('deviceorientationabsolute', true, true);
      } else {
        event.initEvent('deviceorientation', true, true);
      }
      if (props) {
        Object.keys(props).forEach((key) => {
          event[key] = props[key];
        });
      }
      document.dispatchEvent(event);
    },

    updateAbsoluteOrientation(props) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('deviceorientationabsolute', true, true);
      if (props) {
        Object.keys(props).forEach((key) => {
          event[key] = props[key];
        });
      }
      document.dispatchEvent(event);
    },

    destroy() {
      watch.restore();
      clear.restore();
    }
  };
};
