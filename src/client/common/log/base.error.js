/**
 * Proudly created by ohad on 10/01/2017.
 */
const Logger = require('./logger'),
      Level  = require('./logger').Level,
      _      = require('../util/wrapper');

/**
 * @param {string} [message]
 */
function BaseError(message) {
    Error.prototype.constructor.apply(this, arguments);
    this.message = message;
    this.stack   = (new Error()).stack;
}
BaseError.prototype = new Error;

//noinspection JSCheckFunctionSignatures
_.on('error', _baseErrorHandler, {}, window, true);

//noinspection JSValidateJSDoc
/**
 * Handler for `error` events
 * @param {ErrorEvent} event
 * @private
 */
function _baseErrorHandler(event) {
    if (!_shouldHandle(event)) return;
    //noinspection JSUnresolvedVariable
    let error = event.error;
    if (_.isNil(error) || !(error instanceof BaseError)) {
        //noinspection JSUnresolvedVariable
        error = new BaseError(event.message);
    }
    // TODO(ohad): add stacktrace-js
    Logger.log(Level.ERROR, error);
}

//noinspection JSValidateJSDoc
/**
 * Handler for `error` events
 * @param {ErrorEvent} event
 * @returns {boolean} whether the error event should be handled.
 * @private
 */
function _shouldHandle(event) {
    if (_.isNil(event)) return false;
    //noinspection JSUnresolvedVariable
    if (event.error instanceof BaseError) return true;
    if (process.env.NODE_ENV !== 'production') return true;
    //noinspection JSUnresolvedVariable
    return /brainpal/.test(event.filename);
}

module.exports = BaseError;