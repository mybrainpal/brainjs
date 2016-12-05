/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * The lucky client running BrainPal
 * @param options
 * @constructor
 */
function Client(options) {
    this.options(options);
    this.initialize();
}

Client.prototype.options = function(options) {};

Client.prototype.initialize = function() {
    // TODO(ohad): populate with real fields.
    this.id = 1234;
};