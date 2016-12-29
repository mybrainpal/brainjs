/**
 * Proudly created by ohad on 04/12/2016.
 *
 * Describes a group of users that make or don't make love.
 * The whole purpose of a Demographics instance is to decide whether the client belongs to it.
 */
let _ = require('./../../common/util/wrapper'),
    Client = require('./../../common/client'),
    Logger = require('./../../common/log/logger'),
    Level  = require('./../../common/log/logger').Level;
/**
 * @param {Object} [options]
 *  @property {Array.<Object>} properties - describing which users are part of the demographics
 *                                          population.
 * @returns {boolean} Whether the client belongs to this demographics.
 */
exports.included = function (options) {
    options = options || {};
    if (options.properties) {
        for (let i = 0; i < options.properties.length; i++) {
            if (!_satisfyProperty(options.properties[i])) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Introduces additional restriction into the Demographics instance.
 * @param {Object} property
 *  @property {string} name
 *  @property {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 *  @property {Number} [moduloOf] - modulo base.
 *  @property {string} [os] - operating system name (case insensitive).
 * @private
 */
function _satisfyProperty(property) {
    if (!property.name) {
        Logger.log(Level.WARNING, 'Demographics property is missing a name. ' +
                                  JSON.stringify(property));
        return false;
    }
    switch (property.name) {
        case 'modulo':
            if (property.moduloIds && property.moduloOf) {
                return _moduloInclude(property.moduloIds, property.moduloOf);
            }
            Logger.log(Level.WARNING, 'Demographics modulo property is missing required ' +
                                      'properties.');
            break;
        case 'os':
            if (property.os) {
                return _osInclude(property.os);
            }
            Logger.log(Level.WARNING, 'Demographics os property is missing required ' +
                                      'properties.');
            break;
        default:
            Logger.log(Level.WARNING, 'Demographics property ' + property.name + ' is unknown.');
            return false;
    }
    return false;
}

/**
 * @param {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 * @param {Number} [moduloOf] - modulo base.
 * @returns {boolean}
 * @private
 */
function _moduloInclude(moduloIds, moduloOf) {
    if (Client.id && _.isNumber(Client.id)) {
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
