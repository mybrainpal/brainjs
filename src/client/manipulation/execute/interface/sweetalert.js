/**
 * Proudly created by ohad on 22/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    sweetAlert2  = require('sweetalert2'),
    StubExecutor = require('../stub');
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {Function} modalFn - runs sweetalert2 code
 *  @property {string|number} [id]
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('SwalExecutor: Invalid input.');
    }
    window.addEventListener(exports.eventName(options.id), function () {
        options.modalFn(sweetAlert2);
    });
};

/**
 * @param {Array.<Element>|NodeList} elements - must be empty, as modals are full screen.
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (elements.length) return false;
    if (!_.isFunction(options.modalFn)) return false;
    return !(options.id && !_.isNumber(options.id) && !_.isString(options.id));

};

/**
 * Event name prefix for triggering event to show alert.
 * @type {string}
 * @private
 */
const _eventNamePrefix = 'brainpal-sweetalert2';

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
