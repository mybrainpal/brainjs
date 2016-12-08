/**
 * Proudly created by ohad on 04/12/2016.
 */
var Client = require('./client'),
    Logger = require('./log/logger'),
    Level = require('./log/logger').Level;
/**
 * Describes a group of users that make or don't make love.
 * @param options
 * @constructor
 */
function Demographics(options) {
    if (options) {
        this.options(options);
    } else {
        Logger.log(Level.WARNING, 'Demographics: missing options.');
    }
}

/**
 * @param options
 *  @property {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 *  @property {Number} [moduloOf] - modulo base.
 */
Demographics.prototype.options = function (options) {
    if (options.hasOwnProperty('moduloIds') && options.hasOwnProperty('moduloOf')) {
        this.included = moduloInclude;
    }
};

/**
 * Collection of the demographics properties.
 * @type {Array}
 */
Demographics.prototype.properties = [];
/**
 * Whether the client is included within the demographics.
 * @param {Client} client
 * @returns {boolean}
 */
Demographics.prototype.included = function (client) { return true; };

/**
 * @param {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 * @param {Number} [moduloOf] - modulo base.
 * @returns {boolean}
 */
function moduloInclude(moduloIds, moduloOf) {
    if (Client.hasOwnProperty('id') && Client.id) {
        return options.moduloIds.indexOf(Client.id) != -1;
    }
    return false;

}
/**
 * Expose the `Demographics` constructor.
 */
module.exports = Demographics;
