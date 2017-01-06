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
 * @param {string|number|Object} [detail] - for CustomEvent, if a string or a number are
 *  supplied they will be treated as the `id` within the event detail object. Empty objects are
 *  ignored.
 * @param {EventTarget|string} [target = document] - an event target or a selector.
 * @param {boolean} [useCapture = false] - for the addEventListener method.
 * @returns {function} the handler method used.
 */
exports.on = function (event, handler, detail, target = document, useCapture = false) {
    if (!_.isString(event) || !event) {
        throw new TypeError('DomUtil: event is not a string or is empty.');
    }
    if (!_.isFunction(handler)) {
        throw new TypeError('DomUtil: handler is not a function.');
    }
    if (!_.isNil(detail) && !_.isString(detail) && !_.isNumber(detail) && !_.isObject(detail)) {
        throw new TypeError('DomUtil: detail is illegal.');
    } else if (!_.isNil(detail) && !_.isObject(detail)) detail = {id: detail};
    if (target && !(target instanceof EventTarget) && !_.isString(target)) {
        throw new TypeError('DomUtil: target is not a proper event target.');
    } else if (_.isString(target)) target = document.querySelector(target);
    const wrapper = _.isEmpty(detail) ? handler : function (ev) {
                                          if (!_.isEmpty(detail) && ev.detail) {
                                              if (!_.isEqual(detail, ev.detail) &&
                                                  detail !== ev.detail.id) {
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
 * @param {string|number|Object} [detail] - for CustomEvent, if a string or a number are
 *  supplied they will be treated as the `id` within the event detail object.
 * @param {EventTarget|string} [target = document] - an event target or a selector.
 */
exports.trigger = function (event, detail, target = document) {
    if (!_.isString(event) || !event) {
        throw new TypeError('DomUtil: event is not a string or is empty.');
    }
    if (!_.isNil(detail) && !_.isString(detail) && !_.isNumber(detail) && !_.isObject(detail)) {
        throw new TypeError('DomUtil: detail is illegal.');
    } else if (!_.isNil(detail) && !_.isObject(detail)) detail = {id: detail};
    if (target && !(target instanceof EventTarget) && !_.isString(target)) {
        throw new TypeError('DomUtil: target is not a proper event target.');
    } else if (_.isString(target)) target = document.querySelector(target);
    if (!_.isEmpty(detail)) {
        //noinspection JSCheckFunctionSignatures
        target.dispatchEvent(new CustomEvent(event, {detail: detail}));
        return;
    }
    target.dispatchEvent(new Event(event));
};