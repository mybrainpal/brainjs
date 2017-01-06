/**
 * Proudly created by ohad on 18/12/2016.
 */
let tinysort     = require('tinysort'),
    Master = require('../master');
Master.register(exports.name, exports);
exports.name = 'sort';

/**
 * Sorts nodes using tinysort - http://tinysort.sjeiti.com/
 * @param {Object} options - to be used with tinysort.
 *  @property {string} targets - css selector of the elements to sort.
 */
exports.execute = function (options) {
    tinysort(options.targets, options);
};

/**
 * @param {Object} options - to be used with tinysort.
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    try {
        const target = document.querySelector(options.targets);
        if (!target) return false;
    } catch (e) { return false; }
    return true;
};
