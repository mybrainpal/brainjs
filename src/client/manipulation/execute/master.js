/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
    // TODO(ohad): add `prepare` method that initiates external resource loading.
let _             = require('../../common/util/wrapper'),
    EventFactory = require('../../common/events/factory'),
    Logger        = require('../../common/log/logger'),
    Level         = require('../../common/log/logger').Level;

/**
 * Registers an executor, and adds it to the _executorByName map.
 * @param {Object} module - the module.exports object of the executor.
 */
exports.register = function (module) {
    _executorByName[module.name] = module;
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Object} options
 *  @property {string|number} [id]
 *  @property {string|boolean} [on] - event name to execute on. use `true` to execute on
 *  `_.on(eventName(name), .. , id)`
 *  @property {function} [callback] - to execute once the executor is complete.
 *  @property {function} [failureCallback] - to execute had the executor failed.
 * @returns {Object} this module.
 */
exports.execute = function (name, options = {}) {
    if (!_preconditions(name, options)) return exports;
    if (options.on === true) options.on = exports.eventName(name);
    if (options.on) {
        _.on(options.on, () => {_executorByName[name].execute(options)}, options.id);
    } else {
        _executorByName[name].execute(options);
    }
    return exports;
};

exports.eventName = EventFactory.eventName;

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
let _executorByName = {};

/**
 * Makes sure the executor will be able to run smoothly.
 * @param {string} name - of executor
 * @param options - for the executor
 * @returns {boolean} whether the executor is fit to run.
 * @private
 */
function _preconditions(name, options) {
    if (!_executorByName[name]) {
        throw new Error('Executor: executor ' + name + ' is nonexistent.');
    }
    if (!_.isNil(options.id) && !_.isString(options.id) && !_.isNumber(options.id)) {
        throw new Error('Executor: id must be a string or a number.');
    }
    if (!_.isNil(options.on) && !_.isString(options.on) && !_.isBoolean(options.on)) {
        throw new Error('Executor: on must be a string or a boolean.');
    }
    if (!_.isNil(options.callback) && !_.isFunction(options.callback)) {
        throw new Error('Executor: callback must be a function.');
    }
    if (!_.isNil(options.failureCallback) && !_.isFunction(options.failureCallback)) {
        throw new Error('Executor: callback must be a function.');
    }
    if (!_executorByName[name].preconditions(options)) {
        Logger.log(Level.WARNING, 'Executor: executor ' + name + ' preconditions failed.');
        if (options.failureCallback) options.failureCallback(options);
        return false;
    }
    return true;
}
