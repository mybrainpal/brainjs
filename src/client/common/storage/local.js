/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * Logs data in console.log
 * @param {Object} [options]
 * @constructor
 */
function LocalStorage(options) {}

/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
LocalStorage.prototype.log = function (subject) {
    console.log('BrainPal-LocalStorage: ' + subject);
};