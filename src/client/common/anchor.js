/**
 * Proudly created by ohad on 03/12/2016.
 */
var Logger = require('./log/logger'),
    Level = require('./log/logger').Level,
    Locator = require('./locator');
/**
 * Container for a DOM node and collection of events associated with it.
 * @param {Object} options
 * @constructor
 */
function Anchor(options) {
   this.options(options);
}

/**
 * @param {Object} options
 *  @property {Object} description
 *  @property {Array} eventNames
 */
Anchor.prototype.options = function(options) {
    if (options.hasOwnProperty('description')) {
        this.target = Locator.locate(options.description);
        if (this.target) {
            this.label = _label(this.target);
        } else {
            Logger.log(Level.WARNING, 'Anchor: is missing a target.');
        }
    }
    if (options.hasOwnProperty('eventNames')) {
       this.eventNames = options.eventNames;
    }
};

/**
 * Creates anchor label for target.
 * @param {Node} target
 * @returns {string} understandable label for target.
 * @private
 */
function _label(target) {
    var label = (target === document) ? 'document' : target.nodeName.toLowerCase();
    if (target.nodeType === Node.ELEMENT_NODE && target.hasAttribute('id')) {
        label += '-' + target.getAttribute('id');
    }
    // TODO(ohad): handle nested elements, so that label contains a human context of target.
    if (target.nodeValue) {
        label += '-' + target.nodeValue.substr(0, 10);
    }
    return label;
}

/**
 * Expose the `Anchor` constructor.
 */
module.exports = Anchor;
