/**
 * Proudly created by ohad on 18/12/2016.
 */
var tinysort     = require('tinysort'),
    StubExecutor = require('./stub');

/**
 * Sorts nodes using tinysort - http://tinysort.sjeiti.com/
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs - to be used with tinysort.
 */
module.exports.execute = function (elements, specs) {
    if (!module.exports.preconditions(elements, specs)) {
        throw new TypeError('SortExecutor: Invalid input.');
    }
    tinysort(elements, specs);
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs - to be used with tinysort.
 * @returns {boolean} whether the executor has a valid input.
 */
module.exports.preconditions = function (elements, specs) {
    return StubExecutor.preconditions(elements, specs) &&
           typeof tinysort === 'function';
};
