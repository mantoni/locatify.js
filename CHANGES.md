# Changes

## 2.0.1

- Fail if orientation event is relative
- Use absolute device orientation event if available

## 2.0.0

- Require node 6
- Switch to eslint and update to ES6
- Update Sinon to v5
- Use Studio Changes for releases
- Fix orientation for newer Safari versions
- Pass `--allow-chrome-as-root` to mochify on travis
- Update node versions in travis config
- Upgrade mochify and ajust tests

## 1.0.3

- Don't require alpha to be an own property of the event

## 1.0.2

- Invert alpha and don't emit undefined or null values

## 1.0.1

- Don't modify message of error since browsers might consider it readonly

## 1.0.0

- Initial release
