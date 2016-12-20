/**
 * Proudly created by ohad on 04/12/2016.
 */
var _               = require('./../../common/util/wrapper'),
    Logger          = require('../../common/log/logger'),
    Level           = require('../../common/log/logger').Level,
    ExperimentGroup = require('./group');
/**
 * Describes an experiment on window.
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
 * @param options
 *  @property {string} id
 *  @property {string} [name]
 *  @property {Array} groups
 */
Experiment.prototype.options = function (options) {
    var i;
    if (_.has(options, 'id')) {
        this.id = options.id;
    } else {
        Logger.log(Level.WARNING, 'Experiment: missing id.');
    }
    if (_.has(options, 'name')) {
        this.name = options.name;
    }
    this.isClientIncluded = false;
    this.clientGroups     = [];
    if (_.has(options, 'groups')) {
        this.groups = options.groups.map(function (g) {return new ExperimentGroup(g);});
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