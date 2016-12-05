/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * @param {Object} [options]
 * @constructor
 */
function Error(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {Logger} logger
 *  @property {string} [prefix=BP-Error:]
 */
Error.prototype.options = function(options) {
    if (options.hasOwnProperty('logger')) {
        this.logger = options.logger;
    } else {
        console.log('BrainPal Error handler loaded without logger');
    }
    if (options.hasOwnProperty('prefix')) {
        this.prefix = options.prefix;
    } else {
        this.prefix = 'BP-Error:';
    }
};

/**
 * Logs msg onto logger.
 * @param {string} msg
 */
Error.prototype.log = function (msg) {
    if (this.hasOwnProperty('logger')) {
        this.logger.log(this.prefix + msg);
    }
};