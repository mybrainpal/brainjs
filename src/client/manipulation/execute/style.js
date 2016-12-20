/**
 * Proudly created by ohad on 19/12/2016.
 */
var _            = require('./../../common/util/wrapper'),
    StubExecutor = require('./stub');
/**
 * Changes elements style, because we all deserve more like on Facebook!
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string} cssText - to be pasted into a new style element. {$selector} string
 *                               will be replace by {@link _generateSelector}
 *  @property {string} [selector] - css selector.
 *  @property {string} [customClass = exports.defaultCustomClass]
 */
exports.execute = function (elements, specs) {
    var cssText, className;
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('StyleExecutor: Invalid input.');
    }
    className = specs.customClass || exports.defaultCustomClass;
    cssText   =
        specs.cssText.replace('.' + className, _generateSelector(specs.selector || '', className));
    _.loadCss(cssText);
    if (_.isEmpty(elements) && _.has(specs, 'selector')) {
        elements = document.querySelectorAll(specs.selector);
    }
    elements.forEach(function (elem) {
        elem.classList.add(className);
    })
};

/**
 * @param {Array<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    return StubExecutor.preconditions(elements, specs) &&
           _.has(specs, 'cssText');
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
    return selector + '.' + className;
}