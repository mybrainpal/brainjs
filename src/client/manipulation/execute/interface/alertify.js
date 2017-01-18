/**
 * Proudly created by ohad on 30/12/2016.
 */
let _         = require('./../../../common/util/wrapper'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    BaseError = require('../../../common/log/base.error'),
    Master    = require('../master');
exports.name  = 'alertify';
Master.register(exports);

/**
 * Notifies the user, using alertifyjs. http://alertifyjs.com/
 * @param {Object} options
 *  @property {function} alertifyFn - runs alertifyjs code
 *  @property {boolean} [rtl = false] - whether to load rtl style.
 */
exports.execute = function (options) {
        // TODO(ohad): support multiple style loads.
        if (options.rtl) {
            require.ensure('alertifyjs/build/css/alertify.rtl.css', function (require) {
                if (!_styleLoaded) _.css.load(require('alertifyjs/build/css/alertify.rtl.css'));
                _styleLoaded = true;
                _run(options.alertifyFn);
            });
        } else {
            require.ensure('alertifyjs/build/css/alertify.css', function (require) {
                if (!_styleLoaded) _.css.load(require('alertifyjs/build/css/alertify.css'));
                _styleLoaded = true;
                _run(options.alertifyFn);
            });
        }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
    if (!_.isFunction(options.alertifyFn)) {
        throw new BaseError('AlertifyExecutor: alertifyFn must be a function.');
    }

};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;

/**
 * Loads alertifyjs on demand and runs alertifyFn.
 * @param alertifyFn
 * @private
 */
function _run(alertifyFn) {
    require.ensure('alertifyjs', function (require) {
        alertifyFn(require('alertifyjs'));
    });
}