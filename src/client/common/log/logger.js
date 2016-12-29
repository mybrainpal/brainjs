/**
 * Proudly created by ohad on 04/12/2016.
 */
let _        = require('./../../common/util/wrapper'),
    Storage  = require('../storage/storage');
/**
 * Used to save logs.
 * @type {Object}
 * @private
 */
let _storage = Storage.getDefault();
/**
 * Prefixed to all logs
 * @type {Object}
 * @private
 */
let _prefix  = '';

exports.Level = Object.freeze({
                                  FINE   : {value: 0, name: 'Fine'},
                                  INFO   : {value: 1, name: 'Info'},
                                  WARNING: {value: 2, name: 'Warning'},
                                  ERROR  : {value: 3, name: 'Error'},
                                  FATAL  : {value: 4, name: 'Fatal'}
                              });

/**
 * @param options
 *  @property {Object} [storage]
 *  @property {string} [prefix]
 */
exports.options = function (options) {
    if (options.storage) {
        _storage = Storage.get(options.storage);
    }
    if (options.prefix) {
        _prefix = options.prefix;
    }
};

/**
 * Logs msg onto storage.
 * @param {Object} level - severity of the log.
 * @param {Object} message
 */
exports.log = function (level, message) {
    let subject = {
        level: level.name.toUpperCase(),
        type : 'log'
    };
    if (_.isString(message)) {
        subject.content = message
    } else {
        _.merge(subject, message);
    }
    _storage.save(subject);
};
