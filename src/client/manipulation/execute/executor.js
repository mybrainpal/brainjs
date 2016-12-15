/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
var Logger  = require('../../common/log/logger'),
    Level   = require('../../common/log/logger').Level,
    Locator = require('../../common/locator'),
    StubExecutor = require('./stub-executor'),
    SwapExecutor = require('./swap-executor');

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
var _executorByName = {
    'stub': StubExecutor,
    'swap': SwapExecutor
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Array.<string>} [descriptions] - of the target elements.
 * @param {Object} [specs] - for the actual executor.
 * @returns {*} delegates returned value to the actual executor.
 */
module.exports.execute = function (name, descriptions, specs) {
    var elements;
    if (!_executorByName.hasOwnProperty(name)) {
        Logger.log(Level.INFO, 'Executor: executor ' + name + ' is nonexistent.');
        return;
    }
    specs = specs || {};
    elements = [];
    if (descriptions) {
        elements = descriptions.map(function (desc) {
            return Locator.locate(desc);
        }).filter(function (node) {
            return node instanceof Node;
        });
    }
    // Validates preconditions.
    if (!_executorByName[name].preconditions(elements, specs)) {
        Logger.log(Level.INFO, 'Executor: preconditions failed for ' + name);
        return;
    }
    return _executorByName[name].execute(elements, specs);
};
