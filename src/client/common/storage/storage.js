/**
 * Proudly created by ohad on 02/12/2016.
 *
 * A communication interface to store data in a data warehouse. The interface is often
 * implemented by integrations.
 */
const _               = require('../util/wrapper'),
      BaseError       = require('../log/base.error'),
      InMemoryStorage = require('./in-memory.storage');
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
 * @param {function} [callback] - to run after the storage switch had been completed.
 */
exports.set = function (name, options, callback) {
  if (!_.isString(name)) {
    throw new BaseError('Storage: ' + name + ' must be a string.');
  }
  switch (name) {
    case exports.names.IN_MEMORY:
      _storage = InMemoryStorage;
      if (callback) callback();
      return;
    case exports.names.CONSOLE:
      _storageSwitch(require('./console.storage'), {}, callback);
      break;
    case exports.names.GOOGLE_ANALYTICS:
      _storageSwitch(require('./google-analytics.storage'), options, callback);
      break;
    case exports.names.POST:
      _storageSwitch(require('./post.storage'), options, callback);
      break;
    default:
      throw new BaseError('Storage: ' + name + ' is illegal storage name.');
  }
};

exports.names = Object.freeze({
                                CONSOLE         : 'console',
                                GOOGLE_ANALYTICS: 'google-analytics',
                                IN_MEMORY       : 'in-memory',
                                POST            : 'post'
                              });

/**
 * Switches _storage to newStorage.
 * @param {Object} newStorage - the new storage module.
 * @param {Object} [options] - for the new storage initialization.
 * @param {function} [callback] - to run after the storage switch had been completed.
 * @private
 */
function _storageSwitch(newStorage, options, callback) {
  const onReady = () => {
    _storage = newStorage;
    for (let i = 0; i < InMemoryStorage.storage.length; i++) {
      _storage.save(InMemoryStorage.storage[i])
    }
    InMemoryStorage.flush();
    if (callback) callback();
  };
  if (newStorage.init) {
    newStorage.init(options, onReady);
  } else { onReady(); }
}