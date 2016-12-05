/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * Swaps two DOM elements.
 * @constructor
 */
function SwapExecutor() {}

/**
 * Swaps between elements[0] and elements[1].
 * @param {Array} elements
 * @param {Object} options
 *  @property {Function} callback
 */
SwapExecutor.prototype.execute = function(elements, options) {
    var parent, firstInserted, secondInserted;
    if (elements[0].parentNode) {
        parent = elements[0].parentNode;
        firstInserted = parent.insertBefore(elements[1], elements[0]);
        parent.removeChild(elements[0]);
    }
    if (elements[1].parentNode) {
        parent = elements[1].parentNode;
        secondInserted = parent.insertBefore(elements[0], elements[1]);
        parent.removeChild(elements[1]);
    }
    if (options.hasOwnProperty('callback')) {
        options.callback(firstInserted, secondInserted);
    }
    // TODO(ohad): handle styling bloopers.
};

/**
 * Returns whether the executor has valid input.
 * @param {*} elements
 * @param {*} options
 */
SwapExecutor.prototype.preconditions = function(elements, options) {
    if (!Array.isArray(elements)) {
        window.BrainPal.errorLogger.log('BrainPal-SwapExecutor-error: variable elements is not an array.');
        return false;
    }
    if (elements.length != 2) {
        window.BrainPal.errorLogger.log('BrainPal-SwapExecutor-error: elements.length != 2.');
        return false;
    }
    if (elements[0].parentNode === null || elements[0].parentNode === undefined) {
        window.BrainPal.errorLogger.log('BrainPal-SwapExecutor-error: swapped element(elements[0]) without a parent.');
        return false;
    }
    if (elements[1].parentNode === null || elements[1].parentNode === undefined) {
        window.BrainPal.errorLogger.log('BrainPal-SwapExecutor-error: swapped element(elements[1]) without a parent.');
        return false;
    }
    return true;
};