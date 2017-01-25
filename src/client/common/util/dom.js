/**
 * Proudly created by ohad on 18/12/2016.
 */
const _ = require('./prototype');

/**
 * Adds an event listener that is executed only when event.detail.id is missing or matches
 * detailOrId. By match we mean event.detail.id === detailOrId || event.detail.id === detailOrId.id
 * @param {string} event
 * @param {function} handler
 * @param {string|number|Object} [detailOrId] - for CustomEvent, if a string or a number are
 *  supplied they will be treated as the `id` within the event detail object. Empty objects are
 *  ignored.
 * @param {EventTarget|string} [target = document] - an event target or a selector.
 * @param {boolean} [useCapture = false] - for the addEventListener method.
 * @returns {function} the handler method used.
 */
exports.on = function (event, handler, detailOrId, target = document, useCapture = false) {
  if (!_.isString(event) || !event) {
    throw new Error('DomUtil: event is not a string or is empty.');
  }
  if (!_.isFunction(handler)) {
    throw new Error('DomUtil: handler is not a function.');
  }
  if (!_.isNil(detailOrId) && !_.isString(detailOrId) && !_.isNumber(detailOrId) &&
      !_.isObject(detailOrId)) {
    throw new Error('DomUtil: detail is illegal.');
  } else if (!_.isNil(detailOrId) && !_.isObject(detailOrId)) detailOrId = {id: detailOrId};
  if (_.isString(target)) target = document.querySelector(target);
  if (!(target instanceof EventTarget)) {
    throw new Error('DomUtil: target is not a proper event target.');
  }
  const wrapper = _.isEmpty(detailOrId) ? handler : function (ev) {
                                          if (!_.isNil(detailOrId.id) && ev.detail) {
                                            if (detailOrId.id !== ev.detail.id) {
                                              return;
                                            }
                                          }
                                          handler(ev);
                                        };
  target.addEventListener(event, wrapper, useCapture);
  return wrapper;
};

/**
 * Removes an event listener
 * @param {string} event
 * @param {function} handler
 * @param {EventTarget|string} [target = document] - an event target or a selector.
 * @param {boolean} [useCapture = false] - for the addEventListener method.
 * @returns {function} the handler method used.
 */
exports.off = function (event, handler, target = document, useCapture = false) {
  if (!_.isString(event) || !event) {
    throw new Error('DomUtil: event is not a string or is empty.');
  }
  if (!_.isFunction(handler)) {
    throw new Error('DomUtil: handler is not a function.');
  }
  if (_.isString(target)) target = document.querySelector(target);
  if (!(target instanceof EventTarget)) {
    throw new Error('DomUtil: target is not a proper event target.');
  }
  target.removeEventListener(event, handler, useCapture);
};

/**
 * Dispatches an event.
 * @param {string} event
 * @param {string|number|Object} [detailOrId] - for CustomEvent, if a string or a number are
 *  supplied they will be treated as the `id` within the event detail object.
 * @param {EventTarget|string} [target = document] - an event target or a selector.
 */
exports.trigger = function (event, detailOrId, target = document) {
  if (!_.isString(event) || !event) {
    throw new Error('DomUtil: event is not a string or is empty.');
  }
  if (!_.isNil(detailOrId) && !_.isString(detailOrId) && !_.isNumber(detailOrId) &&
      !_.isObject(detailOrId)) {
    throw new Error('DomUtil: detail is illegal.');
  } else if (!_.isNil(detailOrId) && !_.isObject(detailOrId)) detailOrId = {id: detailOrId};
  if (_.isString(target)) target = document.querySelector(target);
  if (!(target instanceof EventTarget)) {
    throw new Error('DomUtil: target is not a proper event target.');
  }
  if (!_.isEmpty(detailOrId)) {
    //noinspection JSCheckFunctionSignatures
    target.dispatchEvent(new CustomEvent(event, {detail: detailOrId}));
    return;
  }
  target.dispatchEvent(new Event(event));
};

/**
 * @param {Element} elem
 * @returns {boolean} whether the element is visible by the user.
 */
exports.isVisible = function (elem) {
  if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
  if (!elem.offsetWidth && !elem.offsetHeight) return false;
  const style = getComputedStyle(elem);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (Number.parseFloat(style.opacity) < 0.01) return false;
  const rect = elem.getBoundingClientRect();
  if (!rect.height && !rect.width) return false;
  const elemCenter = {
    x: rect.left + elem.offsetWidth / 2,
    y: rect.top + elem.offsetHeight / 2
  };
  if (elemCenter.x < 0) return false;
  if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
  if (elemCenter.y < 0) return false;
  if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
  let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
  do {
    if (pointContainer === elem) return true;
  } while (pointContainer = pointContainer.parentNode);
  return false;
};
