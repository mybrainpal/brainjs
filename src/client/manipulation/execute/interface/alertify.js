/**
 * Proudly created by ohad on 30/12/2016.
 */
let _        = require('./../../../common/util/wrapper'),
    alertify = require('alertifyjs'),
    css      = require('alertifyjs/build/css/alertify.css'),
    cssRtl   = require('alertifyjs/build/css/alertify.rtl.css'),
    Master   = require('../master');
exports.name = 'alertify';
Master.register(exports);

/**
 * Notifies the user, using alertifyjs. http://alertifyjs.com/
 * @param {Object} options
 *  @property {function} alertifyFn - runs alertifyjs code
 *  @property {boolean} [rtl = false] - whether to load rtl style.
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        // TODO(ohad): support multiple style loads.
        if (options.rtl) {
            _.css.load(cssRtl);
        } else {
            _.css.load(css);
        }
        _styleLoaded = true;
    }
    options.alertifyFn(alertify);
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    return _.isFunction(options.alertifyFn);

};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;