/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Locates DOM nodes based on a json description.
 */
var Logger = require('./log/logger'),
    Level = require('./log/logger').Level;

/**
 * @param {Object} description
 *  @property {string} [id]
 * @returns {Node} that best matches the description.
 */
module.exports.locate = function (description) {
    var node;
    if (description.hasOwnProperty('id')) {
        node = document.getElementById(description.id);
    }
    if (node instanceof Node) {
        return node;
    }
    Logger.log(Level.INFO, 'Locator: could not locate for ' + JSON.stringify(description));
};
