/**
 * Proudly created by ohad on 25/12/2016.
 */
let _         = require('./../../../common/util/wrapper'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    BaseError = require('../../../common/log/base.error'),
    Master    = require('../master');
exports.name  = 'remove';
Master.register(exports);

/**
 * Removes targets from the DOM, so it becomes leaner than a supermodel.
 * @param {Object} options
 *  @property {string} targets - css selectors of targets to remove.
 */
exports.execute = function (options) {
    document.querySelectorAll(options.targets)
            .forEach((elem) => { if (elem.parentNode) elem.parentNode.removeChild(elem) });
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    let targets = document.querySelectorAll(options.targets);
    if (_.isEmpty(targets)) {
        throw new BaseError('RemoveExecutor: could not find targets at ' + options.targets);
    }
    for (let i = 0; i < targets.length; i++) {
        if (_.isNil(targets[i].parentNode)) {
            throw new BaseError('RemoveExecutor: target must have a parent node.')
        }
    }
};
