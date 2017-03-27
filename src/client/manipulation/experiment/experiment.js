/**
 * Proudly created by ohad on 04/12/2016.
 */
const _            = require('./../../common/util/wrapper'),
      BaseError    = require('../../common/log/base.error'),
      Group        = require('./group'),
      Demographics = require('./demographics');

class Experiment {
  /**
   * An experiment, such as A/B testing, that exists to test a hypothesis.
   * @param options
   *  @property {string|number} id
   *  @property {string} [label] - used for logging.
   *  @property {Array.<Object>} groups - the various experiment groups, each one consists of
   *  demographics portraits (i.e. which part of the entire population of users using our
   *  customers website), and executors (i.e. what kind of DOM manipulations should the group
   *  participants experience).
   *  @property {Array.<Object>|Object} [demographics] - the experiment demographics. By default the
   *  user is included.
   */
  constructor(options = {}) {
    if (!_.isString(options.id) && !_.isNumber(options.id)) {
      throw new BaseError('Experiment: id must be number or a string');
    }
    this.id = options.id;
    if (!_.isNil(options.label)) {
      if (!_.isString(options.label)) {
        throw new BaseError('Experiment: label must nil or a string');
      }
      this.label = options.label;
    }
    if (!Array.isArray(options.groups) || !options.groups.length) {
      throw new BaseError('Experiment: groups must be a non-empty array.');
    }
    /**
     * All the groups in the experiment.
     * @type {Array.<Group>}
     */
    this.groups = options.groups.map(
      function (g) {
        return new Group(_.extend({experimentId: options.id}, g));
      });
    this.clientGroups = this.groups.filter(function (g) {return g.included});
    this.included     = true;
    if (!_.isNil(options.demographics)) {
      this.included = Demographics.included(options.demographics);
    }
  }
}

/**
 * Expose the `Experiment` constructor.
 */
module.exports = Experiment;