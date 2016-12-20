/**
 * Proudly created by ohad on 04/12/2016.
 */
var _        = require('./../../common/util/wrapper'),
    Storage  = require('../storage/storage');
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
var _prefix  = '';

exports.Level = Object.freeze({
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
exports.options = function (options) {
    if (_.has(options, 'storage')) {
        _storage = Storage.get(options.storage);
    }
    if (_.has(options, 'prefix')) {
        _prefix = options.prefix;
    }
};

/**
 * Logs msg onto storage.
 * @param {Object} level - severity of the log.
 * @param {Object} message
 */
exports.log = function (level, message) {
    _storage.save(_prefix + level.name.toUpperCase() + ': ' + message);
};
