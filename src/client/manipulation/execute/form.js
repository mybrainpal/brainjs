/**
 * Proudly created by ohad on 19/12/2016.
 */
var StubExecutor = require('./stub');
/**
 * Manipulates form elements, for the good of society.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {boolean} [focus]
 */
module.exports.execute = function (elements, specs) {
    if (!module.exports.preconditions(elements, specs)) {
        throw new TypeError('FormExecutor: Invalid input.');
    }
    if (specs.hasOwnProperty('focus')) {
        elements[0].focus();
    }
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
module.exports.preconditions = function (elements, specs) {
    return StubExecutor.preconditions(elements, specs) && !!elements.length;
};
