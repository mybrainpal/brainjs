/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Does nothing. Increases mind peace by 2.
 */
let _ = require('./../../common/util/wrapper');
/**
 * Executes big data security in real time, and you guessed it, on the cloud!
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('StubExecutor: Invalid input.');
    }
};

/**
 * @param {Array<Element>|NodeList} elements
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    let i;
    if (!Array.isArray(elements) && !(elements instanceof NodeList)) {
        return false;
    }
    if (typeof options !== 'object' || options === null) {
        return false;
    }
    for (i = 0; i < elements.length; i++) {
        if (!_.isElement(elements[i])) {
            return false;
        }
    }
    return true;
};
