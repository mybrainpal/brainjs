/**
 * Proudly created by ohad on 04/12/2016.
 */
var Storage = require('../storage/storage');
/**
 * Used to save logs.
 * @type {Object}
 * @private
 */
var _storage = Storage.getDefault();
/**
 * Prefixed to all logs
 * @type {Object}
 * @private
 */
var _prefix = '';

module.exports.Level = Object.freeze({
                                         FINE   : {value: 0, name: 'Fine'},
                                         INFO   : {value: 1, name: 'Info'},
                                         WARNING: {value: 2, name: 'Warning'},
                                         ERROR  : {value: 3, name: 'Error'},
                                         FATAL  : {value: 4, name: 'Fatal'}
                                     });

/**
 * @param options
 *  @property {Object} [storage=]
 *  @property {string} [prefix=BP-Logger:]
 */
module.exports.options = function (options) {
    if (options.hasOwnProperty('storage')) {
        _storage = Storage.get(options.storage);
    }
    if (options.hasOwnProperty('prefix')) {
        _prefix = options.prefix;
    }
};

/**
 * Logs msg onto storage.
 * @param {Object} level - severity of the log.
 * @param {Object} message
 */
module.exports.log = function (level, message) {
    _storage.save(_prefix + level.name.toUpperCase() + ': ' + message);
};
