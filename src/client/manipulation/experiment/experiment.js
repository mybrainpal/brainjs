/**
 * Proudly created by ohad on 04/12/2016.
 */
/**
 * Describes an experiment on window.
 * @param options
 * @constructor
 */
function Experiment(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {string} id
 *  @property {string} [name]
 *  @property {Array} groups
 */
Experiment.prototype.options = function (options) {
    if (options.hasOwnProperty('id')) {
        this.id = options.id;
        this.experiments[this.id] = this;
    } else {
        window.BrainPal.errorLogger.log('Experiment: missing id.');
    }
    if (options.hasOwnProperty('name')) {
        this.name = options.name;
    }
    this.client = {};
    this.client.included = false;
    this.client.groups = {};
    if (options.hasOwnProperty('groups')) {
        this.groups = options.groups.map(function (g) {return new ExperimentGroup(g);});
        for (var group in this.groups) {
            if (group.client.included) {
                this.client.included = true;
                this.client.groups.push(group);
            }
        }
    } else {
        window.BrainPal.errorLogger.log('Experiment: missing groups.');
    }
};

Experiment.prototype.experiments = {};