/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Does nothing. Increases mind peace by 2.
 */

/**
 * Executes big data security in real time, and you guessed it, on the cloud!
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 */
module.exports.execute = function (elements, specs) {
    if (!module.exports.preconditions(elements, specs)) {
        throw new TypeError('StubExecutor: Invalid input.');
    }
};

/**
 * @param {Array<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
module.exports.preconditions = function (elements, specs) {
    var i;
    if (!(elements instanceof Array) && !(elements instanceof NodeList)) {
        return false;
    }
    if (typeof specs !== 'object' || specs === null) {
        return false;
    }
    for (i = 0; i < elements.length; i++) {
        if (!(elements[i] instanceof Element)) {
            return false;
        }
    }
    return true;
};
