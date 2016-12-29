/**
 * Proudly created by ohad on 23/12/2016.
 */
let _ = require('./../../common/util/wrapper'),
    EventFactory = require('./../../common/events/factory'),
    Logger       = require('../../common/log/logger'),
    Level        = require('../../common/log/logger').Level,
    StubExecutor = require('./stub');
/**
 * Creates and triggers events and custom events.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {Object|Array.<Object>} [listen] - listens to a certain event in order to trigger
 *   another one.
 *      @property {string} event
 *      @property {string} [selector] - event target, leave empty for window
 *  @property {boolean} [waitForAll = false] - whether to wait for all listen events to fire in
 *  order to execute trigger and create.
 *  @property {Object|Array.<Object>} [trigger] - dispatches a custom event
 *      @property {string} event
 *      @property {string} [selector] - event target, leave empty for window
 *      @property {Object} [detail] - to be passed to CustomEvent constructor.
 *  @property {Object|Array.<Object>} [create] - create a special event.
 *      @property {string} event
 *      @property {Object} [options] - for the event constructor.
 */
exports.execute = function (elements, specs) {
    let promises = [];
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('EventExecutor: Invalid input.');
    }
    if (specs.listen) {
        if (!_.isArray(specs.listen)) {
            specs.listen = [specs.listen];
        }
        _.forEach(specs.listen, function (listener) {
            let target = window;
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
                target.addEventListener(listener.event, function () {
                    resolve({event: listener.event, target: target});
                });
            }));
        });
        if (specs.waitForAll && specs.waitForAll) {
            Promise.all(promises).then(function () {
                _doFn(specs);
            });
        } else {
            Promise.race(promises).then(function () {
                _doFn(specs);
            });
        }
    } else {
        _doFn(specs);
    }
};
/**
 * @param {Array.<Element>|NodeList} elements - must be empty
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    let i, j, props = ['listen', 'create', 'trigger'];
    if (_.isEmpty(specs)) {
        return false;
    }
    if (specs.waitForAll && !_.isBoolean(specs.waitForAll)) {
        return false;
    } else if (specs.waitForAll && _.isEmpty(_.omit(_.clone(specs), 'waitForAll'))) {
        return false;
    }
    for (i = 0; i < props.length; i++) {
        if (specs[props[i]]) {
            if (_.isArray(specs[props[i]])) {
                for (j = 0; j < specs[props[i]].length; j++) {
                    if (!specs[props[i]][j].event ||
                        !_.isString(specs[props[i]][j].event)) {
                        return false;
                    }
                }
            } else if (!specs[props[i]].event || !_.isString(specs[props[i]].event) ||
                       !specs[props[i]].event) {
                return false;
            }
        }
    }
    if (_.isEmpty(specs.create) && _.isEmpty(specs.trigger)) {
        return false;
    }
    return StubExecutor.preconditions(elements, specs) && _.isEmpty(elements);
};

/**
 * @property {Object} specs - see {@link #execute}
 * @private
 */
function _doFn(specs) {
    specs.trigger = specs.trigger || [];
    if (!_.isArray(specs.trigger)) {
        specs.trigger = [specs.trigger];
    }
    _.forEach(specs.trigger, function (trigger) {
        let target = window;
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
    specs.create = specs.create || [];
    if (!_.isArray(specs.create)) {
        specs.create = [specs.create];
    }
    _.forEach(specs.create, function (creation) {
        EventFactory.create(creation.event, creation.options || {});
    });
}