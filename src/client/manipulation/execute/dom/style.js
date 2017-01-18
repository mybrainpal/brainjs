/**
 * Proudly created by ohad on 19/12/2016.
 */
let _         = require('./../../../common/util/wrapper'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    BaseError = require('../../../common/log/base.error'),
    Master    = require('../master');
exports.name  = 'style';
Master.register(exports);
/**
 * Changes elements style, because we all have a little beauty hiding inside!
 * @param {Object} options
 *  @property {string|Array} css - to be pasted into a new style element. Can be the required
 *  content of a style module.
 */
exports.execute = function (options) {
    const newStylesheet = _.css.load(options.css);
    if (options.toLog) {
        if (newStylesheet) {
            Logger.log(Level.INFO,
                       `Added stylesheet (${newStylesheet.textContent.substring(0, 10)})`);
        } else {
            Logger.log(Level.WARNING,
                       `Failed to add stylesheet (${options.css.toString().substring(0, 10)})`);
        }
    }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
    if (!_.css.loadable(options.css)) {
        throw new BaseError('StyleExecutor: css is not loadable.');
    }
};
