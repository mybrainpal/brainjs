/**
 * Proudly created by ohad on 25/12/2016.
 */
let _      = require('./../../../common/util/wrapper'),
    Logger = require('../../../common/log/logger'),
    Level  = require('../../../common/log/logger').Level,
    Master = require('../master');
exports.name = 'move';
Master.register(exports);

/**
 * Appending a class to a copied element, so that it is easy to differentiate from the original.
 * @type {string}
 */
exports.copiedClass = 'brainpal-copy';

/**
 * Moves element within the DOM, to ensure the OCD-ness of the entire system.
 * @param {Object} options
 *  @property {string} target - as css selector.
 *  @property {string} [parentSelector] - css selector of parent element.
 *  @property {string} [nextSiblingSelector] - css selector of desired next sibling. If none
 *  provided or if failed to select, the element will be appended.
 *  @property {boolean} [copy = false] - whether to copy target.
 */
exports.execute = function (options) {
    let nextSibling, parent, toInsert,
        target = document.querySelector(options.target);
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
    toInsert = _prepare(target, parent, options.copy);
    _insert(toInsert, parent, nextSibling);
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    let nextSibling, parent, target;
    try {
        target = document.querySelector(options.target);
        if (!target) return false;
    } catch (e) { return false; }
    if (target === document || target === document.documentElement ||
        target === window || !_.isElement(target.parentNode) ||
        (target === document.querySelector('body')) ||
        (target === document.querySelector('head'))) {
        return false;
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
    if (parent && parent.nodeName === 'UL' && elem.nodeName !== 'LI') {
        prepared = document.createElement('li');
        prepared.appendChild(elem);
    } else {
        prepared = elem;
    }
    if (copy) prepared.classList.add(exports.copiedClass);
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
