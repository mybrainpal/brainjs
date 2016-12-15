/**
 * Proudly created by ohad on 05/12/2016.
 */
var Logger       = require('../../common/log/logger'),
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
 * @param options
 *  @property {string} experimentId
 *  @property {string} [label]
 *  @property {Object} [demographics] - by default all users are included.
 *  @property {Array.<Object>} [executors] - array of objects that will be used for execution
 *                                           later.
 */
ExperimentGroup.prototype.options = function (options) {
    if (options.hasOwnProperty('experimentId')) {
        this.experimentId = options.experimentId;
    } else {
        Logger.log(Level.INFO, 'ExperimentGroup: missing experimentId.');
    }
    this.label = '';
    if (options.hasOwnProperty('label')) {
        this.label = options.label;
    }
    this.isClientIncluded = true;
    if (options.hasOwnProperty('demographics')) {
        this.demographics     = new Demographics(options.demographics);
        this.isClientIncluded = this.demographics.included;
    }
    if (options.hasOwnProperty('executors')) {
        this.executors = options.executors;
    }
};

/**
 * Expose the `ExperimentGroup` constructor.
 */
module.exports = ExperimentGroup;
