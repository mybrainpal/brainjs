/**
 * Proudly created by ohad on 18/12/2016.
 */
var tinysort = require('tinysort');

/**
 * Sorts nodes using tinysort - http://tinysort.sjeiti.com/
 * @param {Array<Element>|string|NodeList} [elements]
 * @param {Object} [specs] - to be used with tinysort.
 */
//noinspection JSUnusedLocalSymbols
module.exports.execute = function (elements, specs) {
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }
    tinysort(elements, specs);
};

/**
 * Returns whether the executor has valid input.
 * @param {Array<Element>} [elements]
 * @param {Object} [specs] - to be used with tinysort.
 */
//noinspection JSUnusedLocalSymbols
module.exports.preconditions = function (elements, specs) {
    return typeof 'tinysort' === 'function' &&
           ((elements instanceof Array && elements.length) ||
            (typeof elements === 'string'));
};
