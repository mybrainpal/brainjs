/**
 * Proudly created by ohad on 30/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    typer        = require('./typer-js'),
    StubExecutor = require('../stub'),
    css          = require('typer-js/typer.css');
/**
 * Creates a typing effect using the magical typer-js library.
 * https://github.com/qodesmith/typer
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {Function} typerFn - runs typer-js code
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('TyperExecutor: Invalid input.');
    }
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    options.typerFn(typer);
};

/**
 * @param {Array.<Element>|NodeList} elements - must be empty, as typer-js works with selector
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (elements.length) return false;
    return _.isFunction(options.typerFn);

};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;