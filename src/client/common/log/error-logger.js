/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * @param {Object} [options]
 * @constructor
 */
function ErrorLogger(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {Logger} storage
 *  @property {string} [prefix=BP-ErrorLogger:]
 */
ErrorLogger.prototype.options = function(options) {
    if (options.hasOwnProperty('storage')) {
        this.storage = options.storage;
    } else {
        throw new Error('BrainPal ErrorLogger handler loaded without storage');
    }
    if (options.hasOwnProperty('prefix')) {
        this.prefix = options.prefix;
    } else {
        this.prefix = 'BP-ErrorLogger:';
    }
};

/**
 * Logs msg onto storage.
 * @param {string} msg
 */
ErrorLogger.prototype.log = function (msg) {
    if (this.hasOwnProperty('storage')) {
        this.storage.log(this.prefix + msg);
    }
};