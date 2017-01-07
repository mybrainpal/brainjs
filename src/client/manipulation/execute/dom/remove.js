/**
 * Proudly created by ohad on 25/12/2016.
 */
let _      = require('./../../../common/util/wrapper'),
    Master = require('../master');
exports.name = 'remove';
Master.register(exports);

/**
 * Removes targets from the DOM, so it becomes leaner than a supermodel.
 * @param {Object} options
 *  @property {string} targets - css selectors of targets to remove.
 */
exports.execute = function (options) {
    _.forEach(document.querySelectorAll(options.targets),
              (elem) => { elem.parentNode.removeChild(elem); });
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    let targets;
    try {
        targets = document.querySelectorAll(options.targets);
        if (_.isEmpty(targets)) return false;
    } catch (e) { return false; }
    for (let i = 0; i < targets.length; i++) {
        if (targets[i] === document || targets[i] === document.documentElement ||
            targets[i] === window || !_.isElement(targets[i].parentNode) ||
            (targets[i] === document.querySelector('body')) ||
            (targets[i] === document.querySelector('head'))) {
            return false;
        }
    }
    return true;
};
