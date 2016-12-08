/**
 * Proudly created by ohad on 02/12/2016.
 *
 * A communication interface to store data in a data warehouse. The interface is often
 * implemented by integrations.
 */

/**
 * @param {string} storageName
 * @param {Object} [options]
 * @returns {Object} an instance of the wanted type
 */
function getStorage(storageName, options) {
    if (_storageByName.hasOwnProperty(storageName)) {
        return _storageByName[storageName];
    }
    return create(storageName, options);
}
module.exports.get = getStorage;

/**
 * @returns {Object} an instance of the default storage.
 */
module.exports.getDefault = function () {
    return getStorage('local');
};

/**
 * @param {string} [storageName]
 * @returns {boolean} whether the specific storage is ready to save, in case the type is not
 *                    found returns false.
 *                    If no type is given, returns whether all types in _storageByName are ready.
 */
function isReady(storageName) {
    if (storageName) {
        if (!_storageByName.hasOwnProperty(storageName)) {
            return false;
        }
        return getStorage(storageName).isReady();
    }
    var ready = true;
    for (storageName in _storageByName) {
        ready = ready && isReady(storageName);
    }
    return ready;
}
module.exports.isReady = isReady;

/**
 * Instantiates a new instance of storageName in _storageByName, with the key `storageName`.
 * @param {string} storageName - of the storage to create
 * @param {Object} [options] - that will be passed to the specific storage.
 * @returns {Object} the created object.
 */
function create(storageName, options) {
    // The variables are defined are to avoid premature initialization of Logger.
    //noinspection LocalVariableNamingConventionJS
    var logger = require('../log/logger'),
        Level = require('../log/logger').Level;
    var storage = (function () {
        switch (storageName) {
            case 'local':
                return require('./console-log');
            default:
                logger.log(Level.WARNING,
                           'storage.js: ' + storageName + ' is not a storage name we know of :-/');
                return;
        }
    })();
    if (storage) {
        if (options) {
            storage.options();
        }
        _storageByName[storageName] = storage;
        return storage;
    }
    logger.log(Level.WARNING,
               'storage.js: no storage was created');
}
module.exports.create = create;

/**
 * Maps storage name to its reference.
 * @type {{string, Object}}
 * @private
 */
var _storageByName = {};