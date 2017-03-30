/**
 * Proudly created by ohad on 25/12/2016.
 */
let _         = require('./../../../common/util/wrapper'),
    $         = require('./../../../common/util/dom'),
    BaseError = require('../../../common/log/base.error'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    Master    = require('../master');
exports.name  = 'move';
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
      target = $(options.target);
  if (options.nextSiblingSelector) {
    nextSibling = $(options.nextSiblingSelector);
    if (_.isNil(nextSibling)) {
      Logger.log(Level.ERROR, 'MoveExecutor: count not find next sibling at ' +
                              options.nextSiblingSelector);
    }
  }
  if (options.parentSelector) {
    parent = $(options.parentSelector);
    if (_.isNil(parent)) {
      Logger.log(Level.ERROR, 'MoveExecutor: count not find parent at ' +
                              options.parentSelector);
    }
  }
  toInsert = _prepare(target, parent, options.copy);
  _insert(toInsert, parent, nextSibling);
  if (options.toLog) {
    setTimeout(() => {
      if (toInsert.parentNode &&
          (parent && toInsert.parentNode === parent ||
           nextSibling && toInsert.nextElementSibling === nextSibling) &&
          $.isVisible(toInsert)) {
        Logger.log(Level.INFO, `${options.target} moved.`);
      } else {
        Logger.log(Level.WARNING, `Failed to move ${options.target}.`);
      }
    });
  }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  let nextSibling, parent, target;
  if (!_.isString(options.target) || !$(options.target)) {
    throw new BaseError('MoveExecutor : could not find target at ' + options.target);
  }
  target = $(options.target);
  if (_.isNil(target.parentNode)) {
    throw new BaseError('MoveExecutor : target must have a parent node.');
  }
  if (_.has(options, 'copy') && !_.isBoolean(options.copy)) {
    throw new BaseError('MoveExecutor : copy must be nil or a boolean.');
  }
  if (options.parentSelector && !_.isString(options.parentSelector)) {
    throw new BaseError('MoveExecutor : parentSelector must be nil or a string.');
  } else if (options.parentSelector) {
    parent = $(options.parentSelector);
    if (!parent) {
      throw new BaseError('MoveExecutor : could not find parent at ' +
                          options.parentSelector);
    }
  }
  if (options.nextSiblingSelector && !_.isString(options.nextSiblingSelector)) {
    throw new BaseError('MoveExecutor : nextSiblingSelector must be nil or a string.');
  } else if (options.nextSiblingSelector) {
    nextSibling = $(options.nextSiblingSelector);
    if (!nextSibling) {
      throw new BaseError('MoveExecutor : could not find next sibling at ' +
                          options.nextSiblingSelector);
    }
  }
  if (_.isNil(parent) && _.isNil(nextSibling)) {
    throw new BaseError('MoveExecutor : must have parent or next sibling.');
  }
  if (!_.isNil(parent) && !_.isNil(nextSibling) && nextSibling.parentNode !== parent) {
    throw new BaseError('MoveExecutor : oh boy! next sibling parent should the new parent.');
  }
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
