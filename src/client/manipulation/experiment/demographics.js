/**
 * Proudly created by ohad on 04/12/2016.
 *
 * Describes a group of users that make or don't make love.
 * The whole purpose of a Demographics instance is to decide whether the client belongs to it.
 */
let _         = require('../../common/util/wrapper'),
    Client    = require('../../common/client'),
    BaseError = require('../../common/log/base.error');
/**
 * @param {Array.<Object>|Object} properties - describing which users are part of the demographics
 *                                      population.
 * @returns {boolean} Whether the client belongs to this demographics.
 */
exports.included = function (properties) {
  if (!Array.isArray(properties)) properties = [properties];
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      if (!exports.PROPERTIES[properties[i].name]) {
        throw new BaseError('Demographics: property ' + properties[i].name + 'does not' +
                            ' exist. ' + JSON.stringify(properties[i]));
      }
      if (!exports.PROPERTIES[properties[i].name].includeFn) {
        throw new BaseError('Demographics: property ' + properties[i].name + ' is' +
                            ' missing includeFn.');
      }
      if (!exports.PROPERTIES[properties[i].name].includeFn(properties[i])) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Properties that can be used to describe an experiment demographic group.
 * @type {Object}
 */
exports.PROPERTIES = Object.freeze(
  {
    MODULO: {name: 'MODULO', includeFn: _moduloInclude},
    OS    : {name: 'OS', includeFn: _osInclude},
    URL   : {name: 'URL', includeFn: _urlInclude}
  });

/**
 * @param {Object} property
 *  @property {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 *  @property {Number} [moduloOf] - modulo base.
 * @returns {boolean}
 * @private
 */
function _moduloInclude(property) {
  if (!Array.isArray(property.moduloIds)) {
    throw new BaseError('Demographics: moduloIds must be an array.');
  }
  if (!Number.isInteger(property.moduloOf)) {
    throw new BaseError('Demographics: moduloOf must be an integer.');
  }
  if (!_.isNil(Client.id) && Number.isInteger(Client.id)) {
    return property.moduloIds.indexOf(Client.id % property.moduloOf) !== -1;
  }
  return false;
}

/**
 * @param {Object} property
 *  @property {string} os
 * @returns {boolean} whether this given OS equals the client's OS, if the client's OS is missing
 *                    false is returned.
 * @private
 */
function _osInclude(property) {
  if (!_.isString(property.os)) {
    throw new BaseError('Demographics: os must be a string.');
  }
  if (Client.agent && Client.agent.os) {
    return Client.agent.os.toLowerCase().indexOf(property.os.toLowerCase()) != -1
  }
  return false;
}

/**
 * @param {Object} property
 *  @property {string} url
 * @returns {boolean} Whether the given url equals current location.
 * @private
 */
function _urlInclude(property) {
  if (process.env.NODE_ENV !== 'production' && window.location.host &&
      window.location.host.startsWith('localhost:')) {
    return true;
  }
  if (!_.isString(property.url)) {
    throw new BaseError('Demographics: url must be a string.');
  }
  return property.url === window.location.href;
}
