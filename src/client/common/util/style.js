/**
 * Proudly created by ohad on 15/12/2016.
 */
/**
 * BrainPal global stylesheet.
 * @type {CSSStyleSheet}
 * @private
 */
var _styleSheet;

/**
 * Identifies the owner Node of _styleSheet.
 * @type {string}
 * @private
 */
var _identifyingAttribute           = 'brainpal';
module.exports.identifyingAttribute = _identifyingAttribute;
/**
 * Creates a new style styleElement and assigns _styleSheet to its correspondent CSSStyleSheet.
 * @private
 */
function _init() {
    var styleElement  = document.createElement('style'),
        i, ownerNode,
        entry         = document.getElementsByTagName('script')[0];
    styleElement.type = 'text/css';
    styleElement.setAttribute(_identifyingAttribute, 'true');

    entry.parentNode.insertBefore(styleElement, entry);
    for (i = 0; i < document.styleSheets.length; i++) {
        //noinspection JSUnresolvedVariable
        ownerNode = document.styleSheets[i].ownerNode;
        if (ownerNode && ownerNode instanceof Element
            && ownerNode.hasAttribute(_identifyingAttribute)) {
            //noinspection JSValidateTypes
            _styleSheet = document.styleSheets[i];
        }
    }
}
_init();

/**
 * Interface for the CSSStyleSheet.insertRule of _styleSheet.
 * @param {string} selector
 * @param {string} cssText
 * @param {number} [index]
 */
module.exports.insertRule = function (selector, cssText, index) {
    if (typeof index !== 'number') {
        index = _styleSheet.cssRules.length;
    }
    if (!/\s*\{.*}\s*/.test(cssText)) {
        cssText = '{' + cssText + '}';
    }
    _styleSheet.insertRule(selector + cssText, index);
};

/**
 * Loads cssText styles into a new stylesheet.
 * @param {string} cssText
 * @returns {Element} the created style element.
 */
module.exports.load = function (cssText) {
    var styleElement         = document.createElement('style'),
        entry                = document.getElementsByTagName('script')[0];
    styleElement.type        = 'text/css';
    styleElement.textContent = cssText;
    styleElement.setAttribute(_identifyingAttribute, 'true');
    entry.parentNode.insertBefore(styleElement, entry);
    return styleElement;
};