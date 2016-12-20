/**
 * Proudly created by ohad on 19/12/2016.
 */
var _            = require('./../../common/util/wrapper'),
    StubExecutor = require('./stub');
/**
 * Manipulates form elements, for the good of society.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {boolean} [focus]
 */
exports.execute = function (elements, specs) {
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('FormExecutor: Invalid input.');
    }
    if (_.has(specs, 'focus')) {
        elements[0].focus();
    }
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    return StubExecutor.preconditions(elements, specs) && !!elements.length;
};
