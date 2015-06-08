# Locatify.js

[![Build Status]](https://travis-ci.org/mantoni/locatify.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/licy.js/blob/master/LICENSE)

Geo location and device orientation as an EventEmitter.

## Usage

```js
var locatify = require('locatify');

var locationTracker = locatify.create();
```

## API

The location tracker inherits from [EventEmitter][].

- `destroy()`: Remove all event handlers and listeners from this event emitter.

## Events

- `position`: Emitted when the position changes. The passed object has these
  properties:
    - `latitude`
    - `longitude`
    - `accuracy`
- `heading`: Emitted when the device orientation changes with the new degree
  numeric value.
- `error`: If an error occurred obtaining the device position.

## Development

- `npm install` to install the dev dependencies
- `npm test` to lint, run tests in PhantomJS and check code coverage

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/locatify.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/locatify.svg
[EventEmitter]: https://nodejs.org/api/events.html
