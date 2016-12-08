/**
 * Proudly created by ohad on 04/12/2016.
 */
var Client = require('./../../common/client'),
    Logger = require('./../../common/log/logger'),
    Level = require('./../../common/log/logger').Level;
/**
 * Describes a group of users that make or don't make love.
 *
 * The whole purpose of a Demographics instance is to decide whether the client belongs to it.
 * @param options
 * @constructor
 */
function Demographics(options) {
    if (options) {
        this.options(options);
    }
}

/**
 * @param options
 *  @property {Array} properties
 */
Demographics.prototype.options = function (options) {
    if (options.hasOwnProperty('properties')) {
        for (var i = 0; i < options.properties.length; i++) {
            this.addProperty(options.properties[i]);
        }
    }
};

/**
 * Introduces additional restriction into the Demographics instance.
 * @param {Object} property
 *  @property {string} name
 *  @property {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 *  @property {Number} [moduloOf] - modulo base.
 *  @property {string} [os] - operating system name (case insensitive).
 */
Demographics.prototype.addProperty = function (property) {
    if (!property.hasOwnProperty('name')) {
        Logger.log(Level.WARNING, 'Demographics property is missing a name. ' +
                                  property.toString());
    }
    switch (property.name) {
        case 'modulo':
            if (property.hasOwnProperty('moduloIds') && property.hasOwnProperty('moduloOf')) {
                this.included = this.included && _moduloInclude();
                return;
            }
            Logger.log(Level.WARNING, 'Demographics modulo property is missing required ' +
                                      'properties.');
            break;
        case 'os':
            if (property.hasOwnProperty('os')) {
                this.included = this.included && _osInclude(property.os);
                return;
            }
            Logger.log(Level.WARNING, 'Demographics os property is missing required ' +
                                      'properties.');
            break;
        default:
            Logger.log(Level.WARNING, 'Demographics property ' + property.name + ' is unknown.');
    }
};

/**
 * @type {boolean} Whether the client belongs to this demographics.
 */
Demographics.prototype.included = true;

/**
 * @param {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 * @param {Number} [moduloOf] - modulo base.
 * @returns {boolean}
 * @private
 */
function _moduloInclude(moduloIds, moduloOf) {
    if (Client.hasOwnProperty('id') && Client.id) {
        return moduloIds.indexOf(Client.id % moduloOf) != -1;
    }
    return false;

}

/**
 * @param {string} os
 * @returns {boolean} whether this given OS equals the client's OS, if the client's OS is missing
 *                    false is returned.
 * @private
 */
function _osInclude(os) {
    if (Client.agent && Client.agent.os) {
        return Client.agent.os.toLowerCase().indexOf(os.toLowerCase()) != -1
    }
    return false;
}

/**
 * Expose the `Demographics` constructor.
 */
module.exports = Demographics;
