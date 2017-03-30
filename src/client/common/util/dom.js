/**
 * Proudly created by ohad on 18/12/2016.
 */
const _ = require('./prototype'),
      $ = module.exports;

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
$.on = function (event, handler, detailOrId, target = document, useCapture = false) {
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
  if (!(_.is(target, EventTarget))) {
    throw new Error('DomUtil: target is not a proper event target.');
  }
  const that    = this;
  const wrapper = (ev) => {
    if (!_.isEmpty(detailOrId) && !_.isNil(detailOrId.id) && ev.detail) {
      if (detailOrId.id !== ev.detail.id) {
        return;
      }
    }
    handler.call(that, ev);
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
$.off = function (event, handler, target = document, useCapture = false) {
  if (!_.isString(event) || !event) {
    throw new Error('DomUtil: event is not a string or is empty.');
  }
  if (!_.isFunction(handler)) {
    throw new Error('DomUtil: handler is not a function.');
  }
  if (_.isString(target)) target = document.querySelector(target);
  if (!(_.is(target, EventTarget))) {
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
$.trigger = function (event, detailOrId, target = document) {
  if (!_.isString(event) || !event) {
    throw new Error('DomUtil: event is not a string or is empty.');
  }
  if (!_.isNil(detailOrId) && !_.isString(detailOrId) && !_.isNumber(detailOrId) &&
      !_.isObject(detailOrId)) {
    throw new Error('DomUtil: detail is illegal.');
  } else if (!_.isNil(detailOrId) && !_.isObject(detailOrId)) detailOrId = {id: detailOrId};
  if (_.isString(target)) target = document.querySelector(target);
  if (!(_.is(target, EventTarget))) {
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
 * @returns {boolean} whether the element's center or one of its corners are visible by the user.
 */
$.isVisible = function (elem) {
  if (!(_.is(elem, Element))) throw Error('DomUtil: elem is not an element.');
  if (!elem.offsetWidth && !elem.offsetHeight) return false;
  const style = getComputedStyle(elem);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (Number.parseFloat(style.opacity) < 0.01) return false;
  const rect = elem.getBoundingClientRect();
  if (!rect.height && !rect.width) return false;
  const points = [
    // center
    {
      x: rect.left + elem.offsetWidth / 2,
      y: rect.top + elem.offsetHeight / 2
    },
    // corners
    {
      x: rect.left + 1,
      y: rect.top + 1
    },
    {
      x: rect.right - 1,
      y: rect.top + 1
    },
    {
      x: rect.left + 1,
      y: rect.bottom - 1
    },
    {
      x: rect.right - 1,
      y: rect.bottom - 1
    }
  ];
  for (let i = 0; i < points.length; i++) {
    if (_isPointVisible(elem, points[i])) return true;
  }
  return false;
};

/**
 * @param {Element} elem
 * @param point
 *  @property {number} x - X coordinate of point in the screen.
 *  @property {number} y - Y coordinate of point in the screen.
 * @returns {boolean} whether the visible element at `point` is `elem` or is a descendant of it.
 * @private
 */
function _isPointVisible(elem, point) {
  if (point.x < 0) return false;
  if (point.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
  if (point.y < 0) return false;
  if (point.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
  let pointContainer = document.elementFromPoint(point.x, point.y);
  do {
    if (pointContainer === elem) return true;
  } while (pointContainer = pointContainer.parentNode);
  return false;
}

/**
 * Non-native attributes that should be assigned.
 * @type {[string]}
 * @private
 */
const _attributeExceptions = ['width', 'height', 'class'];

/**
 * Namespace of <svg>.
 * @type {string}
 */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Appends children entities to el.
 * @param {Element} el
 * @param {Array<*>} children
 */
function appendArray(el, children) {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      appendArray(el, child);
    } else if (_.is(child, Element)) {
      el.appendChild(child);
    } else if (_.isString(child) || _.isNumber(child)) {
      el.insertAdjacentHTML('beforeend', child);
    }
  });
}

/**
 * Sets style attributes for el. To delete/remove an attribute give it a nil value.
 * @param {Element} el
 * @param {Object} styles
 */
$.style = function (el, styles) {
  Object.keys(styles).forEach((styleName) => {
    if (styleName in el.style) {
      el.style[styleName] = _.isNil(styles[styleName]) ? '' : styles[styleName];
    } else {
      throw new Error(
        `DomUtil: ${styleName} is not a valid style for a <${el.tagName.toLowerCase()}>`);
    }
  });
};

/**
 * Sets data attributes for el.
 * @param {Element} el
 * @param {Object} dataAttributes
 */
function setDataAttributes(el, dataAttributes) {
  Object.keys(dataAttributes).forEach((dataAttribute) => {
    // jsdom doesn't support element.dataset, so set them as named attributes
    el.setAttribute(dataAttribute.startsWith('data-') ? dataAttribute : `data-${dataAttribute}`,
                    dataAttributes[dataAttribute]);
  });
}

/**
 * @param {string} type
 * @returns {boolean} whether the given type is SVG.
 */
function isSvg(type) {
  return ['path', 'svg', 'circle'].includes(type);
}

/**
 *
 * @param {string} type - the tag name of the created element.
 * @param {*} [props] - of the created element.
 * @param {...*} [extra] - children or properties to append to the created element.
 * @returns {Element} created with props, text and children specified by the provided arguments.
 */
$.create = function (type, props, ...extra) {
  if (!_.isString(type)) throw new Error('type must be a string');
  const el = isSvg(type)
    ? document.createElementNS(SVG_NAMESPACE, type)
    : document.createElement(type);

  if (Array.isArray(props)) {
    appendArray(el, props);
  } else if (_.is(props, Element)) {
    el.appendChild(props);
  } else if (_.isString(props) || _.isNumber(props)) {
    el.insertAdjacentHTML('beforeend', props);
  } else if (_.isObject(props)) {
    Object.keys(props).forEach((propName) => {
      if (propName in el || _attributeExceptions.includes(propName) ||
          propName.startsWith('data-')) {
        const value = props[propName];
        if (propName === 'style') {
          $.style(el, value);
        } else if (propName === 'dataset') {
          setDataAttributes(el, value);
        } else if (propName.startsWith('data-')) {
          let dataAttribute       = {};
          dataAttribute[propName] = value;
          setDataAttributes(el, dataAttribute);
        } else if (_.isFunction(value) || propName === 'className') {
          el[propName] = value; // e.g. onclick
        } else if (propName === 'class') {
          if (_.isString(value)) {
            el.classList.add(value);
          } else if (Array.isArray(value)) {
            value.forEach((className) => {
              if (!_.isString(className)) {
                throw new Error(
                  'DomUtil: class is an array with non-string values, such as ' + className);
              }
              el.classList.add(className);
            });
          } else {
            throw new Error(
              `DomUtil: Illegal class value (${value ? value.toString() : 'undefined'}).`);
          }
        } else if (value) {
          el.setAttribute(propName, value); // need this for SVG elements
        }
      } else {
        throw new Error(`DomUtil: ${propName} is not a valid property of a <${type}>`);
      }
    });
  }

  if (extra) appendArray(el, extra);

  return el;
};

/**
 * Creates an anchor element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLAnchorElement}
 */
$.a = (...args) => $.create('a', ...args);
/**
 * Creates a div element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLDivElement}
 */
$.div = (...args) => $.create('div', ...args);
/**
 * Creates an image element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLImageElement}
 */
$.img = (...args) => $.create('img', ...args);
/**
 * Creates a p element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLParagraphElement}
 */
$.p = (...args) => $.create('p', ...args);
/**
 * Creates a span element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLSpanElement}
 */
$.span = (...args) => $.create('span', ...args);
/**
 * Creates a ul element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLUListElement}
 */
$.ul = (...args) => $.create('ul', ...args);
/**
 * Creates an li element.
 * @param {...*} [args] - to be passed to {@link #$.create}
 * @returns {HTMLLIElement}
 */
$.li = (...args) => $.create('li', ...args);

/**
 * Identifies the owner Node of a stylesheet loaded by programmatically by brainjs.
 * @type {string}
 */
$.identifyingAttribute = 'data-brainpal-style';
/**
 * Loads css styles into a new stylesheet.
 * @param {Object|string} css - css text or the object provided by using require on css files.
 * @returns {Element} the created style element.
 */
$.load = function (css) {
  let styleElement  = document.createElement('style'),
      entry         = document.getElementsByTagName('script')[0];
  styleElement.type = 'text/css';
  if (!$.loadable(css)) throw Error('DomUtil: css is of invalid type.');
  if (_.isString(css)) {
    styleElement.textContent = css;
  } else {
    styleElement.textContent = css[css.length - 1][1];
  }
  styleElement.setAttribute($.identifyingAttribute, 'true');
  entry.parentNode.insertBefore(styleElement, entry);
  return styleElement;
};

/**
 * @param {Object|string} css - css text or the object provided by using require on css files.
 */
$.loadable = function (css) {
  if (_.isString(css)) return true;
  return Array.isArray(css) && css.length && Array.isArray(css[css.length - 1]) &&
         css[css.length - 1].length === 4 &&
         _.isString(css[css.length - 1][1]);

};