/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
    // TODO(ohad): add `prepare` method that initiates external resource loading.
let Logger = require('../../common/log/logger'),
    Level  = require('../../common/log/logger').Level;

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
let _executorByName = {};

/**
 * Registers an executor, and adds it to the _executorByName map.
 * @param name
 * @param {Object} module - the module.exports object of the executor.
 */
exports.register = function (name, module) {
    _executorByName[name] = module;
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Object} [options]
 *  @property {Object} [options] - for the actual executor.
 *  @property {function} [callback] - to execute once the executor is complete.
 *  @property {function} [failureCallback] - to execute had the executor failed.
 * @returns {*} delegates returned value to the actual executor.
 */
exports.execute = function (name, options) {
    if (!_executorByName[name]) {
        Logger.log(Level.WARNING, 'Executor: executor ' + name + ' is nonexistent.');
        return;
    }
    options.options = options.options || {};
    if (!_executorByName[name].preconditions(options.options)) {
        Logger.log(Level.WARNING, 'Executor: executor ' + name + ' preconditions failed.');
        return;
    }
    // TODO(ohad): propagate callback and failureCallback.
    return _executorByName[name].execute(options.options);
};
