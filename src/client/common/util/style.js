/**
 * Proudly created by ohad on 15/12/2016.
 */
const _ = require('lodash');
/**
 * Identifies the owner Node of _styleSheet.
 * @type {string}
 */
exports.identifyingAttribute = 'data-brainpal-style';
/**
 * Loads css styles into a new stylesheet.
 * @param {Object|string} css - css text or the object provided by using require on css files.
 * @returns {Element} the created style element.
 */
exports.load = function (css) {
    let styleElement  = document.createElement('style'),
        entry         = document.getElementsByTagName('script')[0];
    styleElement.type = 'text/css';
    if (_.isString(css)) {
        styleElement.textContent = css;
    } else if (_.isArray(css) && css.length === 1 && _.isArray(css[0]) && css[0].length === 4 &&
               _.isString(css[0][1])) { // Handles webpack css and scss require.
        styleElement.textContent = css[0][1];
    } else {
        throw TypeError('StyleUtil: css is of invalid type.');
    }
    styleElement.textContent = typeof css === 'string' ? css : css[0][1];
    styleElement.setAttribute(exports.identifyingAttribute, 'true');
    entry.parentNode.insertBefore(styleElement, entry);
    return styleElement;
};
