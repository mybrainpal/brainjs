/**
 * Proudly created by ohad on 19/12/2016.
 */
const _         = require('../../../common/util/wrapper'),
      $         = require('../../../common/util/dom'),
      Logger    = require('../../../common/log/logger'),
      Level     = require('../../../common/log/logger').Level,
      BaseError = require('../../../common/log/base.error'),
      Master    = require('../master');
exports.name    = 'form';
Master.register(exports);
/**
 * Manipulates form elements, for the good of society.
 * @param {Object} options
 *  @property {string} target - css selector
 *  @property {boolean} [focus] - whether to focus on the first provided element.
 */
exports.execute = function (options) {
  let target = document.querySelector(options.target);
  if (options.focus) {
    target.focus();
    if (options.toLog) {
      setTimeout(() => {
        if (document.activeElement === target) {
          Logger.log(Level.INFO, `Focused on ${options.target}`);
        } else {
          Logger.log(Level.WARNING, `Failed to focused on ${options.target}`);
        }
      }, 10);
    }
  }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  if (!document.querySelector(options.target)) {
    throw new BaseError('FormExecutor : could not find target at ' + options.target);
  }
  if (!_.isNil(options.focus) && !_.isBoolean(options.focus)) {
    throw new BaseError('FormExecutor : focus must be nil or boolean');
  }
};
