/**
 * Proudly created by ohad on 18/12/2016.
 */
const _ = require('lodash');
/**
 * @param {Node|string} elem
 * @returns {string} returns the text contents of the specified element.
 */
exports.text = function (elem) {
    let res = '', i;
    if (_.isString(elem)) {
        elem = document.querySelector(elem);
    }

    if (elem && elem.nodeType === Node.TEXT_NODE) {
        res += elem.textContent;
    } else if (elem && elem.childNodes && elem.nodeType !== Node.COMMENT_NODE) {
        for (i = 0; i < elem.childNodes.length; i++) {
            res += exports.text(elem.childNodes[i]);
        }
    }

    return res;
};

/**
 * Adds an event listener, if its detail are missing or match the provided detail.
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
        throw new TypeError('DomUtil: event is not a string or is empty.');
    }
    if (!_.isFunction(handler)) {
        throw new TypeError('DomUtil: handler is not a function.');
    }
    if (!_.isNil(detailOrId) && !_.isString(detailOrId) && !_.isNumber(detailOrId) &&
        !_.isObject(detailOrId)) {
        throw new TypeError('DomUtil: detail is illegal.');
    } else if (!_.isNil(detailOrId) && !_.isObject(detailOrId)) detailOrId = {id: detailOrId};
    if (target && !(target instanceof EventTarget) && !_.isString(target)) {
        throw new TypeError('DomUtil: target is not a proper event target.');
    } else if (_.isString(target)) target = document.querySelector(target);
    const wrapper = _.isEmpty(detailOrId) ? handler : function (ev) {
                                              if (!_.isEmpty(detailOrId) && ev.detail) {
                                                  if (!_.isEqual(detailOrId, ev.detail) &&
                                                      detailOrId !== ev.detail.id) {
                                                  return;
                                              }
                                          }
                                          handler(ev);
                                      };
    target.addEventListener(event, wrapper, useCapture);
    return wrapper;
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
        throw new TypeError('DomUtil: event is not a string or is empty.');
    }
    if (!_.isNil(detailOrId) && !_.isString(detailOrId) && !_.isNumber(detailOrId) &&
        !_.isObject(detailOrId)) {
        throw new TypeError('DomUtil: detail is illegal.');
    } else if (!_.isNil(detailOrId) && !_.isObject(detailOrId)) detailOrId = {id: detailOrId};
    if (target && !(target instanceof EventTarget) && !_.isString(target)) {
        throw new TypeError('DomUtil: target is not a proper event target.');
    } else if (_.isString(target)) target = document.querySelector(target);
    if (!_.isEmpty(detailOrId)) {
        //noinspection JSCheckFunctionSignatures
        target.dispatchEvent(new CustomEvent(event, {detail: detailOrId}));
        return;
    }
    target.dispatchEvent(new Event(event));
};