/**
 * Proudly created by ohad on 02/12/2016.
 */
/**
 * Collector is used to collect data about events and log them using the {@link Logger}.
 * @param {Object} options
 * @constructor
 */
function Collector(options) {
    this.options(options);
}

/**
 * Initializes self.
 * @param {Object} options
 *  @property {string} storage
 */
Collector.prototype.options = function(options) {
    if (options.hasOwnProperty('storage')) {
        this.storage = window.BrainPal.storage.create(options.storage);
    } else {
        window.BrainPal.errorLogger.log('Collector: missing storage.');
    }
};

/**
 * Collects data on subject based on anchor.
 * @param {Anchor} anchor
 * @param {Object} subject
 */
Collector.prototype.collect = function(anchor, subject) {
    anchor.listen(function() {this.storage.save(subject);});
};