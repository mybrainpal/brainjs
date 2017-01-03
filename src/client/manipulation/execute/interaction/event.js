/**
 * Proudly created by ohad on 23/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    EventFactory = require('./../../../common/events/factory'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    StubExecutor = require('./../stub');
/**
 * Creates and triggers events and custom events.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {Object|Array.<Object>} [listen] - listens to a certain event in order to trigger
 *   another one.
 *      @property {string} event
 *      @property {Object} [detail] - as supplied to the CustomEvent constructor. If missing, any
 *      `event` fired will be satisfactory.
 *      @property {string} [selector] - event target, leave empty for document
 *  @property {boolean} [waitForAll = false] - whether to wait for all listen events to fire in
 *  order to execute trigger and create.
 *  @property {Object|Array.<Object>} [trigger] - dispatches a custom event
 *      @property {string} event
 *      @property {Object} [detail] - for the CustomEvent constructor.
 *      @property {string} [selector] - event target, leave empty for document
 *      @property {Object} [detail] - to be passed to CustomEvent constructor.
 *  @property {Object|Array.<Object>} [create] - create a special event.
 *      @property {string} event
 *      @property {Object} [options] - for the event constructor.
 */
exports.execute = function (elements, options) {
    let promises = [];
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('EventExecutor: Invalid input.');
    }
    if (options.listen) {
        if (!_.isArray(options.listen)) {
            options.listen = [options.listen];
        }
        _.forEach(options.listen, function (listener) {
            let target = document;
            if (listener.selector) {
                target = document.querySelector(listener.selector);
                if (!_.isElement(target)) {
                    Logger.log(Level.ERROR,
                               'EventExecutor: count not find listener target at ' +
                               listener.selector);
                    return;
                }
            }
            promises.push(new Promise(function (resolve) {
                target.addEventListener(listener.event, function (ev) {
                    if (!_.has(listener, 'detail') ||
                        (ev.detail && _.isEqual(ev.detail, listener.detail))) {
                        resolve({event: listener.event, target: target});
                    }
                });
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
 * @param {Array.<Element>|NodeList} elements - must be empty
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    let i, j, props = ['listen', 'create', 'trigger'];
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (_.isEmpty(options)) return false;
    if (options.waitForAll && !_.isBoolean(options.waitForAll)) {
        return false;
    } else if (options.waitForAll &&
               _.isEmpty(_.omit(_.clone(options), 'waitForAll'))) {
        return false;
    }
    for (i = 0; i < props.length; i++) {
        if (options[props[i]]) {
            if (_.isArray(options[props[i]])) {
                for (j = 0; j < options[props[i]].length; j++) {
                    if (!_isPropertyValid(options[props[i]][j])) return false;
                }
            } else if (!_isPropertyValid(options[props[i]])) return false;
        }
    }
    if (_.isEmpty(options.create) && _.isEmpty(options.trigger)) return false;
    return _.isEmpty(elements);
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
    options.trigger = options.trigger || [];
    if (!_.isArray(options.trigger)) {
        options.trigger = [options.trigger];
    }
    _.forEach(options.trigger, function (trigger) {
        let target = document;
        if (trigger.selector) {
            target = document.querySelector(trigger.selector);
            if (!_.isElement(target)) {
                Logger.log(Level.ERROR,
                           'EventExecutor: count not find trigger target at ' + trigger.selector);
                return;
            }
        }
        target.dispatchEvent(new CustomEvent(trigger.event, {detail: trigger.detail || {}}));
    });
    options.create = options.create || [];
    if (!_.isArray(options.create)) {
        options.create = [options.create];
    }
    _.forEach(options.create, function (creation) {
        EventFactory.create(creation.event, creation.options || {});
    });
}