/**
 * Proudly created by ohad on 24/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    StubExecutor = require('./../stub');
/**
 * Injects HTML content into target elements.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {string} [html] - to inject into target elements
 *  @property {string} [sourceSelector] - selector to source element, from which to copy html.
 */
exports.execute = function (elements, options) {
    let innerHTML = '', src;
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('InjectExecutor: Invalid input.');
    }
    if (options.sourceSelector) {
        src = document.querySelector(options.sourceSelector);
        if (!_.isElement(src)) {
            Logger.log(Level.ERROR,
                       'InjectExecutor: could find source at ' + options.sourceSelector);
            return;
        }
        innerHTML = src.innerHTML;
    } else if (_.has(options, 'html')) {
        innerHTML = options.html;
    }
    _.forEach(elements, function (elem) {
        elem.innerHTML = innerHTML;
    });
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (!elements.length) return false;
    if (!_.has(options, 'html') && !options.sourceSelector) return false;
    if (_.has(options, 'html') && !_.isString(options.html)) return false;
    if (_.has(options, 'sourceSelector')) {
        if (!_.isString(options.sourceSelector)) return false;
        try {
            if (!document.querySelector(options.sourceSelector)) return false;
        } catch (e) { return false; }
    }
    return true;
};