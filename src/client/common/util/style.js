/**
 * Proudly created by ohad on 15/12/2016.
 */
const _ = require('./prototype');
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
  if (!exports.loadable(css)) throw Error('StyleUtil: css is of invalid type.');
  if (_.isString(css)) {
    styleElement.textContent = css;
  } else {
    styleElement.textContent = css[css.length - 1][1];
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
  return Array.isArray(css) && css.length && Array.isArray(css[css.length - 1]) &&
         css[css.length - 1].length === 4 &&
         _.isString(css[css.length - 1][1]);

};