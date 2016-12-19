/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
var Logger       = require('../../common/log/logger'),
    Level        = require('../../common/log/logger').Level,
    FormExecutor = require('./form'),
    SortExecutor = require('./sort'),
    StubExecutor = require('./stub');

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
var _executorByName = {
    'form': FormExecutor,
    'sort': SortExecutor,
    'stub': StubExecutor
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Array.<string>} [selectors] - of the target elements.
 * @param {Object} [specs] - for the actual executor.
 * @returns {*} delegates returned value to the actual executor.
 */
module.exports.execute = function (name, selectors, specs) {
    var elements;
    if (!_executorByName.hasOwnProperty(name)) {
        Logger.log(Level.INFO, 'Executor: executor ' + name + ' is nonexistent.');
        return;
    }
    specs    = specs || {};
    elements = [];
    if (selectors) {
        elements = selectors.map(function (sel) {
            return document.querySelector(sel);
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
