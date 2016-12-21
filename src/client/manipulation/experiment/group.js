/**
 * Proudly created by ohad on 05/12/2016.
 */
var _            = require('./../../common/util/wrapper'),
    Logger       = require('../../common/log/logger'),
    Level        = require('../../common/log/logger').Level,
    Demographics = require('./demographics');
/**
 * A group of users having fun participating in an experiment.
 * @param options
 * @class @ExperimentGroup
 * @constructor
 */
function ExperimentGroup(options) {
    if (options) {
        this.options(options);
    } else {
        Logger.log(Level.WARNING, 'ExperimentGroup: missing options.');
    }
}

/**
 * Whether the Client is included in this group.
 * @type {boolean}
 */
ExperimentGroup.prototype.isClientIncluded = true;

/**
 * @param options
 *  @property {string} experimentId
 *  @property {string} [label]
 *  @property {Object} [demographics] - which part of the population should this group include.
 *                                      By default all users are included. In sharp contrast to
 *     golf clubs.
 *
 *  @property {Array.<Object>} [executors] - DOM manipulations that should be executed for this
 *                                           group participants.
 *      @property {string} name - of executor, such as 'style'.
 *      @property {string|Array.<string>} selectors - of the elements that should be manipulated by
 *     the executor.
 *      @property {Object} specs - extra options, such as ascending or descending sort.
 */
ExperimentGroup.prototype.options = function (options) {
    if (_.has(options, 'experimentId')) {
        this.experimentId = options.experimentId;
    } else {
        Logger.log(Level.INFO, 'ExperimentGroup: missing experimentId.');
    }
    this.label = '';
    if (_.has(options, 'label')) {
        this.label = options.label;
    }
    this.isClientIncluded = true;
    if (_.has(options, 'demographics')) {
        this.isClientIncluded = Demographics.included(options.demographics);
    }
    if (_.has(options, 'executors')) {
        this.executors = options.executors;
    }
};

/**
 * Expose the `ExperimentGroup` constructor.
 */
module.exports = ExperimentGroup;
