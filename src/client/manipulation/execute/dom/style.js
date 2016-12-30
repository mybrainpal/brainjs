/**
 * Proudly created by ohad on 19/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    StubExecutor = require('./../stub');
/**
 * Changes elements style, because we all deserve more like on Facebook!
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {string} cssText - to be pasted into a new style element. {$selector} string
 *                               will be replace by {@link _generateSelector}
 *  @property {string} [selector] - css selector.
 *  @property {string} [customClass = exports.defaultCustomClass]
 */
exports.execute = function (elements, options) {
    let cssText, className;
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('StyleExecutor: Invalid input.');
    }
    className = options.customClass || exports.defaultCustomClass;
    cssText   =
        options.cssText.replace(`.${className}`,
                                _generateSelector(options.selector || '', className));
    _.css.load(cssText);
    if (_.isEmpty(elements) && options.selector) {
        elements = document.querySelectorAll(options.selector);
    }
    elements.forEach(function (elem) {
        elem.classList.add(className);
    })
};

/**
 * @param {Array<Element>|NodeList} elements
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (_.has(options, 'selector')) {
        if (!_.isString(options.selector)) return false;
        try {if (_.isEmpty(document.querySelectorAll(options.selector))) return false;}
        catch (e) {return false;}
    }
    if (_.has(options, 'customClass') &&
        (!_.isString(options.customClass) || !options.customClass)) {
        return false;
    }
    return _.isString(options.cssText) && !!options.cssText;
};

/**
 * To be used when generating selectors.
 * @type {string}
 */
exports.defaultCustomClass = 'brainpal-custom';

/**
 * @param {string} selector - css selector
 * @param {string} className -
 * @returns {string} a selector to be used in the stylesheet created by {@link execute} above.
 * @private
 */
function _generateSelector(selector, className) {
    return selector + `.${className}`;
}