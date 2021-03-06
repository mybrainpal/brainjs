/**
 * Proudly created by ohad on 10/01/2017.
 */
const _      = require('../util/wrapper'),
      $      = require('../util/dom'),
      Logger = require('./logger'),
      Level  = require('./logger').Level;
/**
 * @param {string} [message]
 */
function BaseError(message) {
  Error.prototype.constructor.apply(this, arguments);
  this.message = message;
}
BaseError.prototype = new Error;

//noinspection JSCheckFunctionSignatures
$.on('error', _baseErrorHandler, {}, window, true);

//noinspection JSValidateJSDoc
/**
 * Handler for `error` events
 * @param {ErrorEvent} event
 * @private
 */
function _baseErrorHandler(event) {
  if (!_shouldHandle(event)) return;
  let error = event.error;
  if (_.isNil(error)) {
    //noinspection JSUnresolvedVariable
    error = new BaseError(event.message);
  }
  Logger.log(Level.ERROR, event.message);
  require.ensure('stacktrace-js', function (require) {
    require('stacktrace-js').fromError(error, {offline: true})
                            .then((stackFrame) => {
                              error.stack = stackFrame;
                              Logger.log(Level.ERROR, event)
                            });
  });
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
  if (_.is(event.error, BaseError)) return true;
  //noinspection JSUnresolvedVariable
  return /brainpal/.test(event.filename);
}

module.exports = BaseError;