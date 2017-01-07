/**
 * Proudly created by ohad on 19/12/2016.
 */
const _      = require('../../../common/util/wrapper'),
      Master = require('../master');
exports.name = 'form';
Master.register(exports);
/**
 * Manipulates form elements, for the good of society.
 * @param {Object} options
 *  @property {string} target - css selector
 *  @property {boolean} [focus] - whether to focus on the first provided element.
 */
exports.execute = function (options) {
    let target = document.querySelector(options.target);
    if (options.focus) {
        target.focus();
    }
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    try {
        if (!document.querySelector(options.target)) return false;
    } catch (e) { return false; }
    return _.isNil(options.focus) || _.isBoolean(options.focus);
};
