/**
 * Proudly created by ohad on 23/12/2016.
 */
let _            = require('../../../common/util/wrapper'),
    EventFactory = require('../../../common/events/factory'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    Master       = require('../master');
exports.name = 'event';
Master.register(exports);
/**
 * Creates and triggers events and custom events.
 * @param {Object} options
 *  @property {Object|Array.<Object>} [listen] - listens to a certain event in order to trigger
 *   another one.
 *      @property {string} event
 *      @property {Object} [detail] - as supplied to the CustomEvent constructor. If missing, any
 *      `event` fired will be satisfactory.
 *      @property {string} [target] - event target, leave empty for document
 *  @property {boolean} [waitForAll = false] - whether to wait for all listen events to fire in
 *  order to execute trigger and create.
 *  @property {Object|Array.<Object>} [trigger] - dispatches a custom event
 *      @property {string} event
 *      @property {Object} [detail] - for the CustomEvent constructor.
 *      @property {string} [target] - event target, leave empty for document
 *      @property {Object} [detail] - to be passed to CustomEvent constructor.
 *  @property {function} [callback] - executes callback, once all the listeners had been invoked.
 *  @property {Object|Array.<Object>} [create] - create a special event.
 *      @property {string} event
 *      @property {Object} [options] - for the event constructor.
 */
exports.execute = function (options) {
    if (options.listen) {
        if (!_.isArray(options.listen)) {
            options.listen = [options.listen];
        }
        let promises = [];
        _.forEach(options.listen, function (listener) {
            let target = document;
            if (listener.target) {
                target = document.querySelector(listener.target);
                if (!_.isElement(target)) {
                    Logger.log(Level.ERROR,
                               'EventExecutor: count not find listener target at ' +
                               listener.target);
                    return;
                }
            }
            promises.push(new Promise(function (resolve) {
                _.on(listener.event,
                     () => {resolve({event: listener.event, target: target});},
                     listener.detail, target);
            }));
        });
        if (options.waitForAll) {
            Promise.all(promises).then(function () {
                _doFn(options);
            });
        } else {
            Promise.race(promises).then(function () {
                _doFn(options);
            });
        }
    } else {
        _doFn(options);
    }
};
/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    let i, j, props = ['listen', 'create', 'trigger'];
    if (options.waitForAll && !_.isBoolean(options.waitForAll)) {
        return false;
    } else if (options.waitForAll &&
               _.isEmpty(_.omit(_.clone(options), 'waitForAll'))) {
        return false;
    }
    if (options.callback && !_.isFunction(options.callback)) return false;
    for (i = 0; i < props.length; i++) {
        if (options[props[i]]) {
            if (_.isArray(options[props[i]])) {
                for (j = 0; j < options[props[i]].length; j++) {
                    if (!_isPropertyValid(options[props[i]][j])) return false;
                }
            } else if (!_isPropertyValid(options[props[i]])) return false;
        }
    }
    return !_.isEmpty(options.create) || !_.isEmpty(options.trigger) || !_.isNil(options.callback);

};

/**
 * @param {Object} prop, an item within options.listen, options.create or options.trigger.
 * @returns {boolean} whether prop is valid for execution.
 */
function _isPropertyValid(prop) {
    if (_.has(prop, 'id') && !_.isObject(prop.detail)) return false;
    return (prop.event && _.isString(prop.event));
}
/**
 * @property {Object} options - see {@link #execute}
 * @private
 */
function _doFn(options) {
    if (options.callback) options.callback();
    options.trigger = options.trigger || [];
    if (!_.isArray(options.trigger)) {
        options.trigger = [options.trigger];
    }
    _.forEach(options.trigger, function (trigger) {
        let target = document;
        if (trigger.target) {
            target = document.querySelector(trigger.target);
            if (!_.isElement(target)) {
                Logger.log(Level.ERROR,
                           'EventExecutor: count not find trigger target at ' + trigger.target);
                return;
            }
        }
        _.trigger(trigger.event, trigger.detail, target);
    });
    options.create = options.create || [];
    if (!_.isArray(options.create)) {
        options.create = [options.create];
    }
    _.forEach(options.create, function (creation) {
        EventFactory.create(creation.event, creation.options || {});
    });
}