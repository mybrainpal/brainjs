/**
 * Proudly created by ohad on 22/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    sweetAlert2  = require('sweetalert2'),
    css    = require('sweetalert2/dist/sweetalert2.css'),
    Master = require('../master');
exports.name = 'sweetalert';
Master.register(exports);
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Object} options
 *  @property {function} swalFn - runs sweetalert2 code
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    options.swalFn(sweetAlert2);
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    return _.isFunction(options.swalFn);

};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;
