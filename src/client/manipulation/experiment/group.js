/**
 * Proudly created by ohad on 05/12/2016.
 */
/**
 * A group of users having fun participating in an experiment
 * @param options
 * @constructor
 */
function ExperimentGroup(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {string} experimentId
 *  @property {string} label
 *  @property {Object} demographics
 *  @property {Object} executor
 */
ExperimentGroup.prototype.options = function(options) {
    if (options.hasOwnProperty('experimentId')) {
        this.experimentId = options.experimentId;
    } else {
        window.BrainPal.errorLogger.log('ExperimentGroup: missing experimentId.');
    }
    if (options.hasOwnProperty('label')) {
        this.label = options.label;
    }
    this.client = {};
    this.client.included = true;
    if (options.hasOwnProperty('demographics')) {
        this.demographics = new Demographics(options.demographics);
        this.client.included = this.demographics.included(window.BrainPal.Client);
    }
    if (options.hasOwnProperty('executor')) {
        this.executor = new Executor(options.executor);
    } else {
        this.executor = new Executor();
    }
};
