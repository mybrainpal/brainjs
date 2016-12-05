/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * Describes a group of users based on various characteristics.
 * @param options
 * @constructor
 */
function Demographics(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {Array} [moduloIds] - array of accepted modulus (as per moduloOf).
 *  @property {Number} [moduloOf] - modulo base.
 */
Demographics.prototype.options = function (options) {
    if (options.hasOwnProperty('moduloIds') && options.hasOwnProperty('moduloOf')) {
        this.prototype.included = function (client) {
            if (client.hasOwnProperty('id')) {
                return options.moduloIds.indexOf(client.id % options.moduloOf) != -1;
            }
            return false;
        };
    }
};

/**
 * Whether the client is included within the demographics.
 * @param {Client} client
 * @returns {boolean}
 */
Demographics.prototype.included = function (client) { return true; };