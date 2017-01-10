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