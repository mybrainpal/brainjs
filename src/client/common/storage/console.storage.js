/**
 * Proudly created by ohad on 04/12/2016.
 * Console.log based storage (i.e. each message to printed in the console)
 */
/**
 * Logs an entry on message.
 * @param {Object} message
 */
exports.save = function save(message) { console.log('BPStorage: ' + JSON.stringify(message)); };
