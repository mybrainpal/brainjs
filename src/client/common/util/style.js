/**
 * Proudly created by ohad on 15/12/2016.
 */
/**
 * Identifies the owner Node of _styleSheet.
 * @type {string}
 */
exports.identifyingAttribute = 'data-brainpal-style';
/**
 * Loads cssText styles into a new stylesheet.
 * @param {string} cssText
 * @returns {Element} the created style element.
 */
exports.load = function (cssText) {
    let styleElement         = document.createElement('style'),
        entry                = document.getElementsByTagName('script')[0];
    styleElement.type        = 'text/css';
    styleElement.textContent = cssText;
    styleElement.setAttribute(exports.identifyingAttribute, 'true');
    entry.parentNode.insertBefore(styleElement, entry);
    return styleElement;
};
