/**
 * Proudly created by ohad on 23/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    $            = require('../../../common/util/dom'),
    BaseError    = require('../../../common/log/base.error'),
    EventFactory = require('../../../common/events/factory'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    Master       = require('../master');
exports.name     = 'event';
Master.register(exports);
/**
 * Creates and triggers events and custom events.
 * @param {Object} options
 *  @property {Object|Array.<Object>} [listen] - listens to a certain event in order to trigger
 *   another one.
 *      @property {string} event
 *      @property {Object} [detailOrId] - as supplied to the CustomEvent constructor. If missing,
 *     any
 *      `event` fired will be satisfactory.
 *      @property {string} [target] - event target, leave empty for document
 *  @property {boolean} [waitForAll = false] - whether to wait for all listen events to fire in
 *  order to execute trigger and create.
 *  @property {Object|Array.<Object>} [trigger] - dispatches a custom event
 *      @property {string} event
 *      @property {Object} [detailOrId] - for the CustomEvent constructor.
 *      @property {string} [target] - event target, leave empty for document
 *      @property {Object} [detailOrId] - to be passed to CustomEvent constructor.
 *  @property {function} [callback] - executes callback, once enough listeners had been invoked.
 *  @property {Object|Array.<Object>} [create] - create a special event.
 *      @property {string} event
 *      @property {Object} [options] - for the event constructor.
 */
exports.execute = function (options) {
  if (options.listen) {
    options.listen = _.arrify(options.listen);
    let promises   = [];
    options.listen.forEach(function (listener) {
      let target = document;
      if (listener.target) {
        target = $(listener.target);
        if (_.isNil(target)) {
          if (options.toLog) {
            Logger.log(Level.WARNING,
                       'EventExecutor: count not find listener target at ' +
                       listener.target);
          }
          return;
        }
      }
      promises.push(new Promise(function (resolve) {
        $.on(listener.event,
             () => {resolve({event: listener.event, target: target})},
             listener.detailOrId, target);
      }));
    });
    if (options.waitForAll) {
      Promise.all(promises).then(() => {
        _doFn(options);
      });
    } else {
      Promise.race(promises).then(() => {
        _doFn(options);
      });
    }
  } else {
    _doFn(options);
  }
};
/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  let i, j, props = ['listen', 'create', 'trigger'];
  if (!_.isNil(options.waitForAll) && !_.isBoolean(options.waitForAll)) {
    throw new BaseError('EventExecutor: waitForAll must be nil or a boolean.')
  }
  if (options.callback && !_.isFunction(options.callback)) {
    throw new BaseError('EventExecutor: callback must be nil or a function.')
  }
  for (i = 0; i < props.length; i++) {
    if (options[props[i]]) {
      for (j = 0; j < _.arrify(options[props[i]]).length; j++) {
        _validateProperty(_.arrify(options[props[i]])[j])
      }
    }
  }
  if (_.isEmpty(options.create) && _.isEmpty(options.trigger) && _.isNil(options.callback)) {
    throw new BaseError('EventExecutor: at least one of create, trigger or callback must not' +
                        ' be nil.');
  }

};

/**
 * Validates a property.
 * @param {Object} prop, an item within options.listen, options.create or options.trigger.
 */
function _validateProperty(prop) {
  if (!_.isNil(prop.detailOrId) && !_.isObject(prop.detailOrId) && !_.isString(prop.detailOrId) &&
      !_.isNumber(prop.detailOrId)) {
    throw new BaseError('EventExecutor: property has illegal detailOrId.');
  }
  if (!_.isString(prop.event) || !prop.event) {
    throw new BaseError('EventExecutor: event is empty or is not a string.');
  }
}
/**
 * @property {Object} options - see {@link #execute}
 * @private
 */
function _doFn(options) {
  if (options.callback) options.callback();
  options.trigger = _.arrify(options.trigger);
  for (let i = 0; i < options.trigger.length; i++) {
    let target = document;
    if (options.trigger[i].target) {
      target = $(options.trigger[i].target);
      if (_.isNil(target)) {
        if (options.toLog) {
          Logger.log(Level.WARNING, 'EventExecutor: count not find trigger target at ' +
                                    options.trigger[i].target);
        }
        continue;
      }
    }
    $.trigger(options.trigger[i].event, options.trigger[i].detailOrId, target);
  }
  options.create = _.arrify(options.create);
  for (let i = 0; i < options.create.length; i++) {
    EventFactory.create(options.create[i].event, options.create[i].options || {});
  }
  if (options.toLog) {
    let did = [];
    if (options.callback) did.push('callback');
    if (options.trigger.length) did.push(`triggered (${JSON.stringify(options.trigger)})`);
    if (options.create.length) did.push(`created (${JSON.stringify(options.create)})`);
    Logger.log(Level.INFO, `Finished _doFn for ${did.join(', ')}`);
  }
}