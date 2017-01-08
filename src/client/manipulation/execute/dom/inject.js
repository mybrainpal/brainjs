/**
 * Proudly created by ohad on 24/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    Master = require('../master');
exports.name = 'inject';
Master.register(exports);
/**
 * Injects HTML content into target elements.
 * @param {Object} options
 *  @property {string} target
 *  @property {string} [position] - where to inject the html. If none given, replaces the html
 *  with the target inner html.
 *  @property {string} [html] - to inject.
 *  @property {string} [sourceSelector] - selector to source element, from which to copy html.
 */
exports.execute = function (options) {
    const target = document.querySelector(options.target);
    let src, html = '';
    if (options.sourceSelector) {
        src = document.querySelector(options.sourceSelector);
        if (!_.isElement(src)) {
            Logger.log(Level.ERROR,
                       'InjectExecutor: could find source at ' + options.sourceSelector);
            return;
        }
        html = src.innerHTML;
    } else if (options.html) html = options.html;

    if (options.position) {
        target.insertAdjacentHTML(options.position, html);
    } else {
        target.innerHTML = html;
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
    if (_.has(options, 'position') && !_.isString(options.position)) return false;
    if (_.has(options, 'html') && !_.isString(options.html)) return false;
    if (_.has(options, 'sourceSelector')) {
        if (!_.isString(options.sourceSelector)) return false;
        try {
            if (!document.querySelector(options.sourceSelector)) return false;
        } catch (e) { return false; }
        if (_.has(options, 'html')) return false;
    }
    return true;
};