/**
 * Proudly created by ohad on 04/12/2016.
 */
let _ = require('./../../common/util/wrapper'),
    Logger          = require('../../common/log/logger'),
    Level           = require('../../common/log/logger').Level,
    ExperimentGroup = require('./group');
/**
 * An experiment, such as A/B testing, that exists to test a hypothesis.
 * @param options
 * @class Experiment
 * @constructor
 */
function Experiment(options) {
    if (options) {
        this.options(options);
    } else {
        Logger.log(Level.WARNING, 'Experiment: missing options.');
    }
}

/**
 * Whether the Client is included in any of the experiment groups.
 * @type {boolean}
 */
Experiment.prototype.isClientIncluded = false;
/**
 * All the experiment groups that include the client.
 * @type {Array.<ExperimentGroup>}
 */
Experiment.prototype.clientGroups = [];
/**
 * All the groups in the experiment.
 * @type {Array.<ExperimentGroup>}
 */
Experiment.prototype.groups = [];

/**
 * @param options
 *  @property {string} id
 *  @property {string} [label] - used for logging.
 *  @property {Array.<Object>} groups - the various experiment groups, each one consists of
 *  demographics portraits (i.e. which part of the entire population of users using our
 *  customers website), and executors (i.e. what kind of DOM manipulations should the group
 *  participants experience).
 *  @property
 */
Experiment.prototype.options = function (options) {
    let i;
    if (options.id) {
        this.id = options.id;
    } else {
        Logger.log(Level.WARNING, 'Experiment: missing id.');
    }
    if (options.label) {
        this.label = options.label;
    }
    if (options.groups) {
        /**
         * All the groups in the experiment.
         * @type {Array.<ExperimentGroup>}
         */
        this.groups = options.groups.map(
            function (g) {return new ExperimentGroup(_.merge({experimentId: options.id}, g));});
        this.clientGroups = []; // makes sure `this` maintains its own clientGroups.
        for (i = 0; i < this.groups.length; i++) {
            if (this.groups[i].isClientIncluded) {
                this.isClientIncluded = true;
                this.clientGroups.push(this.groups[i]);
            }
        }
    } else {
        Logger.log(Level.WARNING, 'Experiment: missing groups.');
    }
};

/**
 * Expose the `Experiment` constructor.
 */
module.exports = Experiment;