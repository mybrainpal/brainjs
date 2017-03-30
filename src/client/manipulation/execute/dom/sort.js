/**
 * Proudly created by ohad on 18/12/2016.
 */
const tinysort  = require('tinysort'),
      _         = require('../../../common/util/wrapper'),
      $         = require('../../../common/util/dom'),
      Logger    = require('../../../common/log/logger'),
      Level     = require('../../../common/log/logger').Level,
      BaseError = require('../../../common/log/base.error'),
      Master    = require('../master');
exports.name    = 'sort';
Master.register(exports);

/**
 * Sorts nodes using tinysort - http://tinysort.sjeiti.com/
 * @param {Object} options - to be used with tinysort.
 *  @property {string} targets - css selector of the elements to sort.
 */
exports.execute = function (options) {
  tinysort(options.targets, options);
  if (options.toLog) {
    Logger.log(Level.INFO, 'Sorted ' + options.targets);
  }
};

/**
 * @param {Object} options - to be used with tinysort.
 */
exports.preconditions = function (options) {
  if (!_.isString(options.target) || !$(options.targets)) {
    throw new BaseError('SortExecutor: could not find targets at ' + options.targets);
  }
};
