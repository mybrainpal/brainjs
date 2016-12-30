/**
 * Proudly created by ohad on 19/12/2016.
 */
let StubExecutor = require('./../stub');
/**
 * Manipulates form elements, for the good of society.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {boolean} [focus] - whether to focus on the first provided element.
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('FormExecutor: Invalid input.');
    }
    if (options.focus) {
        elements[0].focus();
    }
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    return StubExecutor.preconditions(elements, options) && !!elements.length;
};
