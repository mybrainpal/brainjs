/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * Am implementation of {@link Logger}.
 * @param {Object} [options]
 * @constructor
 */
function LocalLogger(options) {}

/**
 * Logs an entry on subject.
 * @param {Subject} subject
 */
LocalLogger.prototype.log = function (subject) {
    console.log('BrainPal-LocalLogger: ' + subject);
};