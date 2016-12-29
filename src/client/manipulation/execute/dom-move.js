/**
 * Proudly created by ohad on 25/12/2016.
 */
let _ = require('./../../common/util/wrapper'),
    Logger       = require('../../common/log/logger'),
    Level        = require('../../common/log/logger').Level,
    StubExecutor = require('./stub');
/**
 * Moves element within the DOM, to ensure the OCD-ness of the entire system.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string} [parentSelector] - css selector of parent element.
 *  @property {string} [nextSiblingSelector] - css selector of desired next sibling. If none
 *  provided or if failed to select, the element will be appended.
 */
exports.execute = function (elements, specs) {
    let nextSibling, parent;
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('DomMoveExecutor: Invalid input.');
    }
    if (specs.nextSiblingSelector) {
        nextSibling = document.querySelector(specs.nextSiblingSelector);
        if (!_.isElement(nextSibling)) {
            Logger.log(Level.ERROR, 'DomMoveExecutor: count not find next sibling at ' +
                                    specs.nextSiblingSelector);
        } else {
            nextSibling.parentNode.insertBefore(elements[0], nextSibling);
            return;
        }
    }
    // If code arrives here parent must exist.
    parent = document.querySelector(specs.parentSelector);
    parent.appendChild(elements[0]);
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string} [parentSelector]
 *  @property {string} [nextSiblingSelector]
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    let i, nextSibling, parent;
    if (!StubExecutor.preconditions(elements, specs) || elements.length !== 1) {
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
    if (!specs.parentSelector && !specs.nextSiblingSelector) {
        return false;
    }
    if (specs.parentSelector &&
        (!_.isString(specs.parentSelector) || _.isEmpty(specs.parentSelector))) {
        return false;
    }
    if (specs.nextSiblingSelector &&
        (!_.isString(specs.nextSiblingSelector) || _.isEmpty(specs.nextSiblingSelector))) {
        return false;
    }
    if (specs.nextSiblingSelector) {
        nextSibling = document.querySelector(specs.nextSiblingSelector);
    }
    if (specs.parentSelector) {
        parent = document.querySelector(specs.parentSelector);
    }
    if (!_.isElement(parent) && !_.isElement(nextSibling)) {
        return false;
    }
    return !(_.isElement(parent) && _.isElement(nextSibling) && nextSibling.parentNode !== parent);

};
