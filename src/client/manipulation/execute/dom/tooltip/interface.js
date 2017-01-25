/**
 * Proudly created by ohad on 16/01/2017.
 */
const Master = require('../../master');
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
