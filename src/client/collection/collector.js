/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
var Storage  = require('../common/storage/storage'),
    Logger   = require('../common/log/logger'),
    Level    = require('../common/log/logger').Level;
/**
 * Used to save data.
 * @type {Object}
 * @private
 */
var _storage = Storage.getDefault();
/**
 * @param {Object} options
 *  @property {string} storage
 */
module.exports.options = function (options) {
    if (options.hasOwnProperty('storage')) {
        _storage = Storage.get(options.storage);
    }
};

/**
 * Collects data on subject based on anchor.
 * @param {Array<Object>} [subjects]
 *  @property {string} [name]
 *  @property {string} [selector]
 * @param {Object} [anchor]
 *  @property {string} [selector]
 *  @property {string} [eventName]
 * @param {Object} [options]
 *  @property {string} [clientProperties] - dot separated string of properties of Client, for
 *                                          example 'agent.os' for `Client.agent.os`
 *
 */
module.exports.collect = function (subjects, anchor, options) {
    var emittedSubject = {}

};
