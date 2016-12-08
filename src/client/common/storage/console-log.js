/**
 * Proudly created by ohad on 04/12/2016.
 */
var ErrorLogger = require('../log/logger');
/**
 * Logs data in console.log
 * @param {Object} [options]
 * @constructor
 */
function BPLocalStorage(options) {}

/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
BPLocalStorage.prototype.save = function (subject) {
    try {
        console.log('BrainPal-BPLocalStorage: ' + subject);
    } catch (e) {
        ErrorLogger().log('BPLocalStorage: ' + e.toString());
    }
};

/**
 * @returns {boolean} whether BPLocalStorage#save is ready to be invoked.
 */
BPLocalStorage.prototype.isReady = function() { return true; };

/**
 * Expose the `BPLocalStorage` constructor.
 */
module.exports = BPLocalStorage;