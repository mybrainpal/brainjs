/**
 * Proudly created by ohad on 19/12/2016.
 */
let _      = require('./../../../common/util/wrapper'),
    BaseError = require('../../../common/log/base.error'),
    Master = require('../master');
exports.name = 'style';
Master.register(exports);
/**
 * Changes elements style, because we all have a little beauty hiding inside!
 * @param {Object} options
 *  @property {string|Array} css - to be pasted into a new style element. Can be the required
 *  content of a style module.
 */
exports.execute = function (options) {
    _.css.load(options.css);
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
    if (!_.css.loadable(options.css)) {
        throw new BaseError('StyleExecutor: css is not loadable.');
    }
};
