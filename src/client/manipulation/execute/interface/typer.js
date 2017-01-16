/**
 * Proudly created by ohad on 30/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    BaseError = require('../../../common/log/base.error'),
    typer        = require('./typer-js'),
    css    = require('typer-js/typer.css'),
    Master = require('../master');
exports.name = 'typer';
Master.register(exports);
/**
 * Creates a typing effect using the magical typer-js library.
 * https://github.com/qodesmith/typer
 * @param {Object} options
 *  @property {function} typerFn - runs typer-js code
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    options.typerFn(typer);
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    if (!_.isFunction(options.typerFn)) {
        throw new BaseError('TyperExecutor: typerFn must be a function.');
    }
};

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;