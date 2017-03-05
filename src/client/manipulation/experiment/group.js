/**
 * Proudly created by ohad on 05/12/2016.
 */
const _         = require('../../common/util/wrapper'),
      BaseError = require('../../common/log/base.error'),
      Demographics = require('./demographics');

/**
 * A group of users having fun participating in an experiment.
 */
class Group {
  /**
   * @param options
   *  @property {string|number} experimentId - should not be supplied by a customer configuration.
   *  @property {string} [label]
   *  @property {Array.<Object>|Object} [demographics] - which part of the population should this
   *  group
   *  include. By default all users are included. In sharp contrast to golf clubs.
   *  @property {Array.<Object>|Object} [executors] - DOM manipulations that should be executed for
   *  this group participants.
   *    @property {string} name - of executor, such as 'style'.
   *    @property {Object} options - extra options for the executors.
   */
  constructor(options = {}) {
    if (_.isNil(options.experimentId)) {
      throw new BaseError('Group: experimentId cannot be missing');
    }
    this.experimentId = options.experimentId;
    if (!_.isNil(options.label)) {
      if (!_.isString(options.label)) {
        throw new BaseError('Group: label must be nil or a string.');
      }
      this.label = options.label;
    }
    this.included = true;
    if (options.demographics) {
      this.included = Demographics.included(options.demographics);
    }
    this.executors = _.arrify(options.executors);
  }
}

/**
 * Expose the `Group` constructor.
 */
module.exports = Group;
