/**
 * Proudly created by ohad on 16/01/2017.
 */
const _      = require('../../../../common/util/wrapper'),
      Master = require('../../master');
exports.name = 'tooltip';
Master.register(exports);
/**
 * Interface for TooltipExecutor.
 * @param {Object} options
 */
exports.execute = function (options) {
  require.ensure('./tooltip', function (require) {
    const impl = require('./tooltip');
    impl.preconditions(options);
    impl.execute(options);
  });
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {};

/**
 * Name prefix for attributes, events and ids.
 * @type {string}
 */
exports.namePrefix = 'brainpal-' + exports.name;

/**
 * @param {string|number} [id]
 * @returns {string} prefixes namePrefix to id, if it is not nil.
 */
exports.tooltipId = function (id) {
  return _.isNil(id) ? exports.namePrefix : `${exports.namePrefix}-${id.toString()}`;
};
