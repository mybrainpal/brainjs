/**
 * Proudly created by ohad on 03/12/2016.
 */
/**
 * Describes an event about an element in the DOM.
 * @param {Object} options
 * @constructor
 */
function Anchor(options) {
   this.options(options);
}

/**
 * @param {Object} options
 *  @property {Object} descriptor
 *  @property {Array} eventNames
 */
Anchor.prototype.options = function(options) {
    if (options.hasOwnProperty('descriptor')) {
       this.target = (new Descriptor(options.descriptor)).locate();
       this.label = target.tagName;
        if (this.target.hasOwnProperty('id')) {
            this.label += '-' + this.target.getAttribute('id');
        }
        if (this.target.innerHTML) {
            this.label += '-' + this.target.innerHTML.substr(0, 10);
        }
    }
    if (options.hasOwnProperty('events')) {
       this.eventNames = options.eventNames;
    }
};

/**
 * @param {Function} handler to assign for the event listener
 * @returns {EventListener} returns an event listener that's relevant for self.
 */
Anchor.prototype.listen = function(handler) {
    for (var eventName in this.eventNames) {
        this.target.addEventListener(eventName, handler);
    }
};