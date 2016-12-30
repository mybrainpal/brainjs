/**
 * Proudly created by ohad on 30/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    alertify     = require('alertifyjs'),
    StubExecutor = require('./../stub');
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {Function} alertifyFn - runs alertifyjs code
 *  @property {string|number} [id]
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('AlertifyExecutor: Invalid input.');
    }
    window.addEventListener(exports.eventName(options.id), function () {
        options.alertifyFn(alertify);
    });
};

/**
 * @param {Array.<Element>|NodeList} elements - must be empty, as alerts are independent.
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (elements.length) return false;
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
