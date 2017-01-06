/**
 * Proudly created by ohad on 22/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    sweetAlert2  = require('sweetalert2'),
    css    = require('sweetalert2/dist/sweetalert2.css'),
    Master = require('../master');
Master.register(exports.name, exports);
exports.name = 'sweetalert';
/**
 * Creates a modal using sweet alerts 2, the modal is triggered by an external event.
 * https://limonte.github.io/sweetalert2/
 * @param {Object} options
 *  @property {function} modalFn - runs sweetalert2 code
 *  @property {string|number} [id]
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    document.addEventListener(exports.eventName(options.id), function () {
        options.modalFn(sweetAlert2);
    });
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
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

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;
