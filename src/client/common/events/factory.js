/**
 * Proudly created by ohad on 23/12/2016.
 *
 * Factory for special events, we do double shifts here.
 */
var _      = require('./../util/wrapper'),
    Logger = require('../../common/log/logger'),
    Level  = require('../../common/log/logger').Level;


/**
 * Maps event names to their module counterpart.
 * @type {{string: Object}}
 * @private
 */
var _eventsByName = {};

/**
 * @param {string} event
 * @param {Object} [options] - for event constructor
 * @returns {CustomEvent}
 */
exports.create = function (event, options) {
    if (_.has(_eventsByName, event)) {
        return _eventsByName[event](options || {});
    }
    Logger.log(Level.ERROR, 'EventFactory: could not find event ' + event);
};
