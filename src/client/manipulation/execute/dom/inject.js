/**
 * Proudly created by ohad on 24/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    Master = require('../master');
Master.register(exports.name, exports);
exports.name = 'inject';
/**
 * Injects HTML content into target elements.
 * @param {Object} options
 *  @property {string} target
 *  @property {string} [html] - to inject into target elements
 *  @property {boolean} [append = false] - whether to append the data.
 *  @property {string} [sourceSelector] - selector to source element, from which to copy html.
 */
exports.execute = function (options) {
    const target = document.querySelector(options.target);
    let html     = '', src;
    if (options.sourceSelector) {
        src = document.querySelector(options.sourceSelector);
        if (!_.isElement(src)) {
            Logger.log(Level.ERROR,
                       'InjectExecutor: could find source at ' + options.sourceSelector);
            return;
        }
        html = src.innerHTML;
    } else if (_.has(options, 'html')) {
        html = options.html;
    }
    target.innerHTML = options.append ? target.innerHTML + html : html;
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    try {
        if (!document.querySelector(options.target)) return false;
    } catch (e) { return false; }
    if (!_.has(options, 'html') && !options.sourceSelector) return false;
    if (_.has(options, 'html') && !_.isString(options.html)) return false;
    if (_.has(options, 'append') && !_.isBoolean(options.append)) return false;
    if (_.has(options, 'sourceSelector')) {
        if (!_.isString(options.sourceSelector)) return false;
        try {
            if (!document.querySelector(options.sourceSelector)) return false;
        } catch (e) { return false; }
    }
    return true;
};