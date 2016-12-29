/**
 * Proudly created by ohad on 25/12/2016.
 */
let _ = require('./../../common/util/wrapper'),
    StubExecutor = require('./stub');
/**
 * Removes elements from the DOM, so it becomes leaner than a supermodel.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 */
exports.execute = function (elements, specs) {
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('DomRemoveExecutor: Invalid input.');
    }
    _.forEach(elements, function (elem) {
        elem.parentNode.removeChild(elem);
    });
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    let i;
    if (!StubExecutor.preconditions(elements, specs) || !elements.length) {
        return false;
    }
    for (i = 0; i < elements.length; i++) {
        if (elements[i] === document || elements[i] === document.documentElement ||
            elements[i] === window || !_.isElement(elements[i].parentNode) ||
            (document.querySelector('body') && elements[i] === document.querySelector('body')) ||
            (document.querySelector('head') && elements[i] === document.querySelector('head'))) {
            return false;
        }
    }
    return _.isEmpty(specs);
};
