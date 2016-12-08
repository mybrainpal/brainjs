/**
 * Proudly created by ohad on 03/12/2016.
 */
var ErrorLogger = require('./log/logger');
/**
 * Used to describe an element in the DOM.
 * @param {Object} options
 * @constructor
 */
function Descriptor(options) {
    if (options) {
        this.options(options);
    } else {
        ErrorLogger().log('Descriptor: missing options.');
    }
}

/**
 * @param options
 *  @property {Object} description - collection of properties that will be used to locate an
 *                                   element.
 */
Descriptor.prototype.options = function (options) {
    if (options.hasOwnProperty('description')) {
        this.description = options.description;
    } else {
        ErrorLogger().log('Descriptor: missing description.');
    }
};

/**
 * @returns {Element} that best matches the description.
 */
Descriptor.prototype.locate = function() {
    if (this.description.hasOwnProperty('id')) {
        return document.getElementById(this.description.id);
    }
};

/**
 * Expose the `Descriptor` constructor.
 */
module.exports = Descriptor;