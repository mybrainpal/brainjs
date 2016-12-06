/**
 * Proudly created by ohad on 02/12/2016.
 */
/**
 * A communication interface to store data in an external data warehouse. The interface is often
 * implemented by integrations.
 *
 * This constructor should not be invoked.
 *
 * @param {Object} [options]
 * @constructor
 */
function Storage(options) {}

/**
 * @param name
 * @returns {Object} an instance of name-storage.
 */
Storage.prototype.create = function(name) {
    switch (name) {
        case 'local':
            return new LocalStorage();
        default:
            BrainPal.errorLogger.log(name + ' is not a storage option, maybe one day though');
    }
};