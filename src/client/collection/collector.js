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
 *  @property {Logger} logger
 */
Collector.prototype.options = function(options) {
    this.logger = options.logger;
};

/**
 * Collects data on subject based on anchor.
 * @param {Anchor} anchor
 * @param {Subject} subject
 */
Collector.prototype.collect = function(anchor, subject) {
    anchor.listener(function() {this.logger.log(subject);});
};