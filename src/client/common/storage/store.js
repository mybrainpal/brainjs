/**
 * Proudly created by ohad on 02/12/2016.
 */
/**
 * A communication interface to store data in an external data warehouse. The interface is often
 * implemented by integrations.
 * @param {Object} [options]
 * @constructor
 */
function Logger(options) {}

/**
 * Logs an entry on subject.
 * @param {Subject} subject
 */
Logger.prototype.log = function(subject) {};