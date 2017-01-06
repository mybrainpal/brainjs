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
    if (!exports.loadable(css)) throw TypeError('StyleUtil: css is of invalid type.');
    if (_.isString(css)) {
        styleElement.textContent = css;
    } else {
        styleElement.textContent = _.last(css)[1];
    }
    styleElement.setAttribute(exports.identifyingAttribute, 'true');
    entry.parentNode.insertBefore(styleElement, entry);
    return styleElement;
};

/**
 * @param {Object|string} css - css text or the object provided by using require on css files.
 */
exports.loadable = function (css) {
    if (_.isString(css)) return true;
    return _.isArray(css) && css.length && _.isArray(_.last(css)) && _.last(css).length === 4 &&
           _.isString(_.last(css)[1]);

};