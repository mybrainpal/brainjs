/**
 * Proudly created by ohad on 23/12/2016.
 *
 * Factory for special events, we do double shifts here.
 */
let Logger = require('../../common/log/logger'),
    Level     = require('../../common/log/logger').Level;

/**
 * @param {string} event
 * @param {Object} [options] - for event constructor
 * @returns {CustomEvent}
 */
exports.create = function (event, options) {
    if (_eventsByName[event]) {
        return new _eventsByName[event](options || {});
    }
    Logger.log(Level.ERROR, 'EventFactory: could not find event ' + event);
};

/**
 * Registers an event, and adds it to the _eventsByName map.
 * @param {Object} module - the class prototype of the event.
 */
exports.register = function (module) {
    _eventsByName[module.name()] = module;
};

/**
 * Prefix for BrainPal event names.
 * @type {string}
 */
exports.prefix = 'brainpal-';

/**
 * @param {string} name
 * @returns {string} prefixed name.
 */
exports.eventName = function (name) {
    return exports.prefix + name;
};

/**
 * Maps event names to their module counterpart.
 * @type {{string: Object}}
 * @private
 */
let _eventsByName = {};