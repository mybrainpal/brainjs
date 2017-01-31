/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
  // TODO(ohad): add `prepare` method that initiates external resource loading.
let _            = require('../../common/util/wrapper'),
    Logger = require('../../common/log/logger'),
    Level  = require('../../common/log/logger').Level,
    EventFactory = require('../../common/events/factory'),
    BaseError    = require('../../common/log/base.error');

/**
 * Registers an executor, and adds it to the _executorByName map.
 * @param {Object} module - the module.exports object of the executor.
 */
exports.register = function (module) {
  if (module.name) {
    _executorByName[module.name] = module;
  } else {
    throw new BaseError('Executor: module is missing a name, can we call it brainpal? :-)');
  }
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Object} options
 *  @property {string|number} [id]
 *  @property {boolean} [toLog = (process.env.NODE_ENV !== 'test')] - whether to log the executor
 *  flow.
 *  @property {string|boolean} [on] - event name to execute on. use `true` to execute on
 *  `_.on(eventName(name), .. , id)`
 * @returns {Object} this module.
 */
exports.execute = function (name, options = {}) {
  if (!_preconditions(name, options)) return exports;
  let executeHandler;
  if (options.on) {
    executeHandler = _.on(options.on.event,
                          () => {_executorByName[name].execute(options)},
                          options.id,
                          options.on.target);
    if (options.off) {
      _.on(options.off.event,
           () => {_.off(options.on.event, executeHandler, options.on.target)},
           options.off.id, options.off.target);
    }
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
    throw new BaseError('Executor: executor ' + name + ' is nonexistent.');
  }
  if (!_.isNil(options.id) && !_.isString(options.id) && !_.isNumber(options.id)) {
    throw new BaseError('Executor: id must be a string or a number.');
  }
  if (!_.isNil(options.on) && !_.isString(options.on) && !_.isBoolean(options.on) &&
      !_.isObject(options.on)) {
    throw new BaseError('Executor: on must be a string, a boolean, or an object');
  }
  if (options.on === true) options.on = exports.eventName(name);
  if (_.isString(options.on)) options.on = {event: options.on};
  if (!_.isNil(options.off) && !_.isString(options.off) && !_.isBoolean(options.off) &&
      !_.isObject(options.off)) {
    throw new BaseError('Executor: off must be a string, a boolean, or an object');
  } else if (!_.isNil(options.off) && _.isNil(options.on)) {
    Logger.log(Level.WARNING,
               'Executor: options.off should only exist when options.on do.');
  }
  if (_.isString(options.off)) options.off = {event: options.off};
  if (!_.has(options, 'toLog')) {
    options.toLog = process.env.NODE_ENV !== 'test';
  } else if (_.has(options, 'toLog') && !_.isBoolean(options.toLog)) {
    throw new BaseError('Executor: toLog must be nil or a boolean.');
  }
  _executorByName[name].preconditions(options);
  return true;
}
