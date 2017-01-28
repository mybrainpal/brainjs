/**
 * Proudly created by ohad on 02/12/2016.
 *
 * A communication interface to store data in a data warehouse. The interface is often
 * implemented by integrations.
 */
const InMemoryStorage = require('./in-memory.storage');
/**
 * Saves message using _storage.
 * @param message
 */
exports.save = function (message) {
  _storage.save(message);
};
let _storage = InMemoryStorage;

/**
 * Sets _storage to `require('./name')`
 * @param {string} name
 * @param {Object} [options] - for the new storage initialization.
 */
exports.set = function (name, options) {
  switch (name) {
    case exports.names.IN_MEMORY:
      _storage = InMemoryStorage;
      return;
    case exports.names.CONSOLE:
      require.ensure('./console.storage', function (require) {
        _storageSwitch(require('./console.storage'));
      });
      break;
    case exports.names.GOOGLE_ANALYTICS:
      require.ensure('./google-analytics.storage', function (require) {
        _storageSwitch(require('./google-analytics.storage'), options);
      });
      break;
  }
};

exports.names = Object.freeze({
                                IN_MEMORY       : 'in-memory',
                                CONSOLE         : 'console',
                                GOOGLE_ANALYTICS: 'google-analytics'
                              });

/**
 * Switches _storage to newStorage.
 * @param {Object} newStorage - the new storage module.
 * @param {Object} [options] - for the new storage initialization.
 * @private
 */
function _storageSwitch(newStorage, options) {
  const onReady = () => {
    _storage = newStorage;
    for (let i = 0; i < InMemoryStorage.storage.length; i++) {
      _storage.save(InMemoryStorage.storage[i])
    }
    InMemoryStorage.flush();
  };
  if (newStorage.init) {
    newStorage.init(options, onReady);
  } else { onReady(); }
}