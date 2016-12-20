/**
 * Proudly created by ohad on 04/12/2016.
 * Console.log based storage (i.e. each message to printed in the console)
 */
var Logger = require('../log/logger'),
    Level  = require('../log/logger').Level;
/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
exports.save = function save(subject) {
    try {
        console.log('BPStorage: ' + JSON.stringify(subject));
    } catch (e) {
        Logger.log(Level.ERROR, 'console-log.js: ' + JSON.stringify(e));
    }
};

/**
 * @returns {boolean} whether #save is ready to be invoked.
 */
exports.isReady = function () { return true; };

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 */
exports.init = function (options) {};

/**
 * Runs handler as soon as the storage is ready.
 * @param {Function} handler
 */
exports.onReady = function (handler) {
    handler();
};
