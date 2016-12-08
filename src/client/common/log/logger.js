/**
 * Proudly created by ohad on 04/12/2016.
 */
var _singletonInstance,
    Storage = require('../storage/storage');
/**
 * @param {Object} [options]
 * @constructor
 */
function ErrorLogger(options) {
    if (_singletonInstance) {
        return _singletonInstance;
    }
    _singletonInstance = this;
    this.options(options || {});
}

/**
 * @param options
 *  @property {Object} [storage=]
 *  @property {string} [prefix=BP-ErrorLogger:]
 */
ErrorLogger.prototype.options = function(options) {
    this._storage = Storage().get(options.hasOwnProperty('storage') ? options.storage : '');
    if (options.hasOwnProperty('prefix')) {
        this._prefix = options.prefix;
    } else {
        this._prefix = 'BP-ErrorLogger:';
    }
};

/**
 * Logs msg onto storage.
 * @param {string} msg
 */
ErrorLogger.prototype.log = function (msg) {
    if (this.hasOwnProperty('storage')) {
        this._storage.save(this._prefix + msg);
    }
};

/**
 * Expose the `ErrorLogger` constructor.
 */
module.exports = ErrorLogger;