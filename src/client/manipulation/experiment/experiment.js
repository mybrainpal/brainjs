/**
 * Proudly created by ohad on 04/12/2016.
 */
const _            = require('./../../common/util/wrapper'),
      BaseError    = require('../../common/log/base.error'),
      Collector    = require('../../collection/collector'),
      Group        = require('./group'),
      Demographics = require('./demographics');

class Experiment {
  /**
   * An experiment, such as A/B testing, that exists to test a hypothesis.
   * @param options
   *  @property {string|number} id
   *  @property {Array.<Object>} groups - the various experiment groups, each one consists of
   *  demographics (i.e. which part of the entire population of users using our customers
   *  website), and executors (i.e. what kind of DOM manipulations should the group participants
   *  experience).
   *  @property {Array.<Object>|Object} [demographics] - the experiment demographics. By default all
   *  users are included.
   *  @property {Array.<Object>|Object} [collect] - we are talking about the juice here brother
   *  (or sister, when we surpass 1k employees it'll be an issue). Normally, it'll be the
   *  event that yields to conversion.
   *  The object (or the array elements) should match the options of {@link Collector#collect}
   */
  constructor(options = {}) {
    if (!_.isString(options.id) && !_.isNumber(options.id)) {
      throw new BaseError('Experiment: id must be number or a string');
    }
    this.id = options.id;
    if (!Array.isArray(options.groups) || !options.groups.length) {
      throw new BaseError('Experiment: groups must be a non-empty array.');
    }
    /**
     * All the groups in the experiment.
     * @type {Array.<Group>}
     */
    this.groups = _.arrify(options.groups).map(
      function (g) {
        return new Group(_.extend({experimentId: options.id}, g));
      });
    this.clientGroups = this.groups.filter(function (g) {return g.included});
    this.included     = true;
    if (!_.isNil(options.demographics)) {
      this.included = Demographics.included(options.demographics);
    }
    _.arrify(options.collect).forEach((col) => {Collector.preconditions(col)});
    this.collect = _.arrify(options.collect);
  }
}

/**
 * Expose the `Experiment` constructor.
 */
module.exports = Experiment;