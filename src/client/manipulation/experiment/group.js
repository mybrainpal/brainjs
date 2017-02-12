/**
 * Proudly created by ohad on 05/12/2016.
 */
let Logger = require('../../common/log/logger'),
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
ExperimentGroup.prototype.included = true;

/**
 * @param options
 *  @property {string} experimentId - should not be supplied by a customer configuration.
 *  @property {string} [label]
 *  @property {Object} [demographics] - which part of the population should this group include.
 *                                      By default all users are included. In sharp contrast to
 *                                      golf clubs.
 *  @property {Array.<Object>} [executors] - DOM manipulations that should be executed for this
 *                                           group participants.
 *      @property {string} name - of executor, such as 'style'.
 *      @property {Object} options - extra options for the executors.
 */
ExperimentGroup.prototype.options = function (options) {
  if (options.experimentId) {
    this.experimentId = options.experimentId;
  } else {
    Logger.log(Level.INFO, 'ExperimentGroup: missing experimentId.');
  }
  this.label = '';
  if (options.label) {
    this.label = options.label;
  }
  this.included = true;
  if (options.demographics) {
    this.included = Demographics.included(options.demographics);
  }
  if (options.executors) {
    this.executors = options.executors;
  }
};

/**
 * Expose the `ExperimentGroup` constructor.
 */
module.exports = ExperimentGroup;
