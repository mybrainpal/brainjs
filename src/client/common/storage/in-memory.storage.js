/**
 * Proudly created by ohad on 15/01/2017.
 *
 * Stores messages in-memory. Allows faster initialization of the entire system, and can be used
 * for testing.
 */
/**
 * Saves a message.
 * @param {Object} message
 */
exports.save = function save(message) { exports.storage.push(message) };

/**
 * Flushes the storage.
 */
exports.flush = function () { exports.storage = [] };

/**
 * Stores the saved messages.
 * @type {Array}
 */
exports.storage = [];
