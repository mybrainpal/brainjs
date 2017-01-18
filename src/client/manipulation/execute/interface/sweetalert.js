/**
 * Proudly created by ohad on 22/12/2016.
 */
let _         = require('../../../common/util/wrapper'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    BaseError = require('../../../common/log/base.error'),
    Master    = require('../master');
exports.name  = 'sweetalert';
Master.register(exports);
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Object} options
 *  @property {function} swalFn - runs sweetalert2 code
 */
exports.execute = function (options) {
    require.ensure(['sweetalert2', 'sweetalert2/dist/sweetalert2.css'], function (require) {
        if (!_styleLoaded) _.css.load(require('sweetalert2/dist/sweetalert2.css'));
        _styleLoaded = true;
        options.swalFn(require('sweetalert2'));
    });
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    if (!_.isFunction(options.swalFn)) {
        throw new BaseError('SweetalertExecutor: swalFn must be a function.');
    }
};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;
