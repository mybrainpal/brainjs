/**
 * Proudly created by ohad on 25/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    Logger       = require('../../../common/log/logger'),
    Level        = require('../../../common/log/logger').Level,
    StubExecutor = require('./../stub');
/**
 * Moves element within the DOM, to ensure the OCD-ness of the entire system.
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {string} [parentSelector] - css selector of parent element.
 *  @property {string} [nextSiblingSelector] - css selector of desired next sibling. If none
 *  provided or if failed to select, the element will be appended.
 *  @property {boolean} [copy = false] - whether to copy the source element (i.e. elements[0]).
 */
exports.execute = function (elements, options) {
    let nextSibling, parent, toInsert;
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('DomMoveExecutor: Invalid input.');
    }
    if (options.nextSiblingSelector) {
        nextSibling = document.querySelector(options.nextSiblingSelector);
        if (!_.isElement(nextSibling)) {
            Logger.log(Level.ERROR, 'DomMoveExecutor: count not find next sibling at ' +
                                    options.nextSiblingSelector);
        }
    }
    if (options.parentSelector) {
        parent = document.querySelector(options.parentSelector);
        if (!_.isElement(parent)) {
            Logger.log(Level.ERROR, 'DomMoveExecutor: count not find parent at ' +
                                    options.parentSelector);
        }
    }
    toInsert = _prepare(elements[0], parent, options.copy);
    _insert(toInsert, parent, nextSibling);
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {string} [parentSelector]
 *  @property {string} [nextSiblingSelector]
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    let i, nextSibling, parent;
    if (!StubExecutor.preconditions(elements, options) || elements.length !== 1) {
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
    if (!options.parentSelector && !options.nextSiblingSelector) {
        return false;
    }
    if (options.parentSelector &&
        (!_.isString(options.parentSelector) || _.isEmpty(options.parentSelector))) {
        return false;
    }
    if (_.has(options, 'copy') && !_.isBoolean(options.copy)) return false;
    if (options.nextSiblingSelector &&
        (!_.isString(options.nextSiblingSelector) || _.isEmpty(options.nextSiblingSelector))) {
        return false;
    }
    if (options.nextSiblingSelector) {
        nextSibling = document.querySelector(options.nextSiblingSelector);
    }
    if (options.parentSelector) {
        parent = document.querySelector(options.parentSelector);
    }
    if (!_.isElement(parent) && !_.isElement(nextSibling)) {
        return false;
    }
    return !(_.isElement(parent) && _.isElement(nextSibling) && nextSibling.parentNode !== parent);

};

/**
 * Prepares elem to be inserted to DOM.
 * @param {Element} elem
 * @param {Element} parent
 * @param {boolean} copy
 * @returns {Element} an element to insert to the DOM.
 * @private
 */
function _prepare(elem, parent, copy) {
    let prepared;
    elem = copy ? elem.cloneNode(true) : elem;
    if (parent && parent.nodeName.toLowerCase() === 'ul' && elem.nodeName.toLowerCase() !== 'li') {
        prepared = document.createElement('li');
        prepared.appendChild(elem);
    } else {
        prepared = elem;
    }
    return prepared;
}

/**
 * Inserts elem to the DOM.
 * @param {Element} elem
 * @param {Element} parent
 * @param {Element} nextSibling
 * @private
 */
function _insert(elem, parent, nextSibling) {
    if (nextSibling) {
        nextSibling.parentNode.insertBefore(elem, nextSibling);
        return;
    }
    parent.appendChild(elem);
}
