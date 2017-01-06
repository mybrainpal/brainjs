/**
 * Proudly created by ohad on 30/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    alertify     = require('alertifyjs'),
    css    = require('alertifyjs/build/css/alertify.css'),
    cssRtl = require('alertifyjs/build/css/alertify.rtl.css'),
    Master = require('../master');
Master.register(exports.name, exports);
exports.name = 'alertify';

/**
 * Notifies the user, using alertifyjs. http://alertifyjs.com/
 * @param {Object} options
 *  @property {function} alertifyFn - runs alertifyjs code
 *  @property {string|number} [id]
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
    document.addEventListener(exports.eventName(options.id), function () {
        options.alertifyFn(alertify);
    });
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    if (!_.isFunction(options.alertifyFn)) return false;
    return !(options.id && !_.isNumber(options.id) && !_.isString(options.id));

};

/**
 * Event name prefix for triggering event to show alert.
 * @type {string}
 * @private
 */
const _eventNamePrefix = 'brainpal-alertify';

/**
 * @param {string|number} [id] - to append to event name.
 * @returns {string} an event name to listen to
 */
exports.eventName = function (id) {
    if (id) {
        return _eventNamePrefix + '-' + id.toString();
    }
    return _eventNamePrefix;
};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;