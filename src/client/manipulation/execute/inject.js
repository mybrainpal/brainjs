/**
 * Proudly created by ohad on 24/12/2016.
 */
let _ = require('./../../common/util/wrapper'),
    Logger       = require('../../common/log/logger'),
    Level        = require('../../common/log/logger').Level,
    StubExecutor = require('./stub');
/**
 * Injects HTML content into target elements.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string} [html] - to inject into target elements
 *  @property {string} [sourceSelector] - selector to source element, from which to copy html.
 */
exports.execute = function (elements, specs) {
    let innerHTML = '', src;
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('InjectExecutor: Invalid input.');
    }
    if (specs.sourceSelector) {
        src = document.querySelector(specs.sourceSelector);
        if (!_.isElement(src)) {
            Logger.log(Level.ERROR, 'InjectExecutor: could find source at ' + specs.sourceSelector);
            return;
        }
        innerHTML = src.innerHTML;
    } else if (_.has(specs, 'html')) {
        innerHTML = specs.html;
    }
    _.forEach(elements, function (elem) {
        elem.innerHTML = innerHTML;
    });
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    if (!StubExecutor.preconditions(elements, specs)) return false;
    if (!elements.length) return false;
    if (!_.has(specs, 'html') && !specs.sourceSelector) return false;
    if (_.has(specs, 'html') && !_.isString(specs.html)) return false;
    if (_.has(specs, 'sourceSelector')) {
        if (!_.isString(specs.sourceSelector)) return false;
        try {
            if (!document.querySelector(specs.sourceSelector)) return false;
        } catch (e) { return false; }
    }
    return true;
};