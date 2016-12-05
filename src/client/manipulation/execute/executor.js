/**
 * Proudly created by ohad on 05/12/2016.
 */
/**
 * Describes an executor with specification.
 * @param options
 * @constructor
 */
function Executor(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {string} [name=stub]
 *  @property {Array} [descriptors]
 *  @property {Object} [specs]
 */
Executor.prototype.options = function(options) {
    if (options.hasOwnProperty('name')) {
        if (!this.executors.hasOwnProperty(options.name)) {
            window.BrainPal.Error.log('Executor: executor ' + name + ' is nonexistent.');
            return;
        }
        this.name = options.name;
    } else {
        this.name = 'stub';
    }
    if (options.hasOwnProperty('descriptors')) {
        this.elements = options.descriptors.map(function(desc) {
            return (new Descriptor(desc)).locate();
        });
    }
    if (options.hasOwnProperty('specs')) {
        this.specs = options.specs;
    }
    // Validates preconditions.
    if (!this.executors[this.name].preconditions(this.elements, options)) {
        window.BrainPal.errorLogger.log('Executor: preconditions failed for ' + options);
    }
};

Executor.prototype.executors = {
    'stub': new StubExecutor(),
    'swap': new SwapExecutor()
};

/**
 * Executes this.executors[this.name]
 * @param {Object} [options]
 * @returns {*} delegates returned value to the executor#execute implementation
 */
Executor.prototype.execute = function (options) {
    return this.executors[this.name].execute(this.elements, options);
};