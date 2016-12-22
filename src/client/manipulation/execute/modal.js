/**
 * Proudly created by ohad on 22/12/2016.
 */
var _            = require('./../../common/util/wrapper'),
    sweetAlert2  = require('sweetalert2'),
    StubExecutor = require('./stub');
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {Function} modalFn - runs sweetalert2 code
 *  @property {string|number} [id]
 */
exports.execute = function (elements, specs) {
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('ModalExecutor: Invalid input.');
    }
    window.addEventListener(_eventName(specs.id), function () {
        specs.modalFn(sweetAlert2);
    });
};

/**
 * @param {Array.<Element>|NodeList} elements - must be empty, as modals are full screen.
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    return _.has(specs, 'modalFn') && _.isFunction(specs.modalFn) &&
           (!_.has(specs, 'id') || _.isNumber(specs.id) || _.isString(specs.id)) &&
           StubExecutor.preconditions(elements, specs) && !elements.length;
};

/**
 * Event name prefix for triggering event to show modal.
 * @type {string}
 */
exports.eventNamePrefix = 'brainpal-modal';

/**
 * @param {string|number} [id] - to append to event name.
 * @returns {string} an event name to listen to
 * @private
 */
function _eventName(id) {
    if (id) {
        return exports.eventNamePrefix + '-' + id.toString();
    }
    return exports.eventNamePrefix;
}

