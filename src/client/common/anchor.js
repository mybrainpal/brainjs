/**
 * Proudly created by ohad on 03/12/2016.
 */
'use strict';

/**
 * Describes an event about an element in the DOM.
 * @param {Object} options
 *  @field {Descriptor} descriptor
 *  @field {BrainEvent} event
 * @constructor
 */
function Anchor(options) {
   this.options(options);
}

/**
 * @returns {EventListener} returns an event listener that's relevant for self.
 */
Anchor.prototype.listener = function() {};