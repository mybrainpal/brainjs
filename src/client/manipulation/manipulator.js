/**
 * Proudly created by ohad on 03/12/2016.
 */
/**
 * Manipulates the DOM to fill our customers pockets with them dollars.
 * @param {Object} options
 * @constructor
 */
function Manipulator(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {Logger} logger
 */
Manipulator.prototype.options = function(options) {
    if (options.logger) {
        this.logger = options.logger;
    }
};

Manipulator.prototype.executors = {
    'swap': new SwapExecutor()
};

/**
 * Executes actionName manipulation on anchors.
 * @param {string} name
 * @param {Array} anchors
 * @param {Object} options
 *  @field
 */
Manipulator.prototype.getExecutor = function(name, elements, options) {
    if (!Executor.prototype.executors.hasOwnProperty(name)) {
        console.log('BrainPal-Executor-error: illegal executor name(' + name + ').');
        return;
    }
    if (this.executors[name].preconditions(anchors, options)) {
        return this.executors[name]
    }
    console.log('BrainPal-Executor-error: preconditions failed for ' + name + '.');
    return;
};

/**
 * Manipulates elements with action and then logs relevant data on subject.
 * @param {Experiment} experiment
 * @param {Object} options
 *  @property {Object} [executor]
 */
Manipulator.prototype.manipulate = function(experiment, options) {

};