/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
    // TODO(ohad): add `prepare` method that initiates external resource loading.
var _             = require('./../../common/util/wrapper'),
    Logger        = require('../../common/log/logger'),
    Level         = require('../../common/log/logger').Level,
    EventExecutor = require('./event'),
    FormExecutor  = require('./form'),
    ModalExecutor = require('./modal'),
    SortExecutor  = require('./sort'),
    StubExecutor  = require('./stub');

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
var _executorByName = {
    'event': EventExecutor,
    'form' : FormExecutor,
    'modal': ModalExecutor,
    'sort' : SortExecutor,
    'stub' : StubExecutor
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Array.<string>|string} [selectors] - of the target elements.
 * @param {Object} [options]
 *  @property {Object} [specs] - for the actual executor.
 *  @property {Function} [callback] - to execute once the executor is complete.
 *  @property {Function} [failureCallback] - to execute had the executor failed.
 * @returns {*} delegates returned value to the actual executor.
 */
exports.execute = function (name, selectors, options) {
    var elements;
    if (!_.has(_executorByName, name)) {
        Logger.log(Level.WARNING, 'Executor: executor ' + name + ' is nonexistent.');
        return;
    }
    options.specs = options.specs || {};
    elements      = [];
    selectors     = _.isString(selectors) ? [selectors] : selectors;
    _.forEach(selectors, function (selector) {
        _.forEach(document.querySelectorAll(selector), function (elem) {
            elements.push(elem);
        });
    });
    // TODO(ohad): propagate callback and failureCallback.
    return _executorByName[name].execute(elements, options.specs);
};
