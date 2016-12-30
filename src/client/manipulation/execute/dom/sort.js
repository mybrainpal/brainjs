/**
 * Proudly created by ohad on 18/12/2016.
 */
let tinysort     = require('tinysort'),
    StubExecutor = require('./../stub');

/**
 * Sorts nodes using tinysort - http://tinysort.sjeiti.com/
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options - to be used with tinysort.
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('SortExecutor: Invalid input.');
    }
    tinysort(elements, options);
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options - to be used with tinysort.
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    return StubExecutor.preconditions(elements, options) &&
           typeof tinysort === 'function';
};
