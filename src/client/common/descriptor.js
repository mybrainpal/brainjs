/**
 * Proudly created by ohad on 03/12/2016.
 */
/**
 * Used to describe an element in the DOM.
 * @param {Object} options
 * @constructor
 */
function Descriptor(options) {
    this.options(options);
}

/**
 * Initializes Descriptor object.
 * @param options
 *  @property {Object} description - collection of properties that will be used to locate an
 *                                   element.
 */
Descriptor.prototype.options = function (options) {
    if (options.hasOwnProperty('description')) {
        this.description = options.description;
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