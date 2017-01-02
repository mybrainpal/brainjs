/**
 * Proudly created by ohad on 23/12/2016.
 *
 * Factory for special events, we do double shifts here.
 */
let IdleEvent = require('./idle'),
    Logger    = require('../../common/log/logger'),
    Level     = require('../../common/log/logger').Level;


/**
 * Maps event names to their module counterpart.
 * @type {{string: Object}}
 * @private
 */
let _eventsByName = {
    'idle': IdleEvent
};

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
