/**
 * Proudly created by ohad on 05/12/2016.
 *
 * Modifies the DOM, but in a good way.
 */
    // TODO(ohad): add `prepare` method that initiates external resource loading.
let _               = require('./../../common/util/wrapper'),
    Logger          = require('../../common/log/logger'),
    Level           = require('../../common/log/logger').Level,
    EventExecutor   = require('./interaction/event'),
    FormExecutor    = require('./dom/form'),
    GalleryExecutor = require('./media/gallery'),
    InjectExecutor  = require('./dom/inject'),
    SwalExecutor    = require('./interface/sweetalert'),
    MoveExecutor    = require('./dom/move'),
    RemoveExecutor  = require('./dom/remove'),
    SortExecutor    = require('./dom/sort'),
    StubExecutor    = require('./stub'),
    TyperExecutor   = require('./interface/typer');

/**
 * All existing executors keyed by their names.
 * @type {{string, Object}}
 * @private
 */
let _executorByName = {
    'event'  : EventExecutor,
    'form'   : FormExecutor,
    'gallery': GalleryExecutor,
    'inject' : InjectExecutor,
    'move'   : MoveExecutor,
    'remove' : RemoveExecutor,
    'sort'   : SortExecutor,
    'stub'   : StubExecutor,
    'swal'   : SwalExecutor,
    'typer'  : TyperExecutor
};

/**
 * Executes the next big thing.
 * @param {string} name - of the desired executor.
 * @param {Array.<string>|string} [selectors] - of the target elements.
 * @param {Object} [options]
 *  @property {Object} [options] - for the actual executor.
 *  @property {Function} [callback] - to execute once the executor is complete.
 *  @property {Function} [failureCallback] - to execute had the executor failed.
 * @returns {*} delegates returned value to the actual executor.
 */
exports.execute = function (name, selectors, options) {
    let elements;
    if (!_executorByName[name]) {
        Logger.log(Level.WARNING, 'Executor: executor ' + name + ' is nonexistent.');
        return;
    }
    options.options = options.options || {};
    elements      = [];
    selectors     = _.isString(selectors) ? [selectors] : selectors;
    _.forEach(selectors, function (selector) {
        _.forEach(document.querySelectorAll(selector), function (elem) {
            elements.push(elem);
        });
    });
    // TODO(ohad): propagate callback and failureCallback.
    return _executorByName[name].execute(elements, options.options);
};
