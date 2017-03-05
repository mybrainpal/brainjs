/**
 * Proudly created by ohad on 10/01/2017.
 */

const _ = exports;

/**
 * @param {*} obj
 * @returns {boolean}
 */
exports.isNil = function (obj) {
  return obj === undefined || obj === null;
};

/**
 * @param {Object} obj
 * @returns {boolean}
 */
exports.isObject = function (obj) {
  return !_.isNil(obj) && typeof obj === 'object';
};

/**
 * @param {string} str
 * @returns {boolean}
 */
exports.isString = function (str) {
  return !_.isNil(str) && typeof str === 'string';
};

/**
 * @param {number} num
 * @returns {boolean}
 */
exports.isNumber = function (num) {
  return !_.isNil(num) && typeof num === 'number';
};

/**
 * @param {boolean} bool
 * @returns {boolean}
 */
exports.isBoolean = function (bool) {
  return !_.isNil(bool) && typeof bool === 'boolean';
};

/**
 * @param {function} fn
 * @returns {boolean}
 */
exports.isFunction = function (fn) {
  return !_.isNil(fn) && typeof fn === 'function';
};

/**
 * @param {*} obj
 * @returns {boolean} whether obj has no properties of its own.
 */
exports.isEmpty = function (obj) {
  // null and undefined are "empty"
  if (_.isNil(obj)) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (!_.isObject(obj)) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
};

/**
 * @param {Object} obj
 * @param {Array.<string>|string} props - a property name, or array of such.
 * @returns {*} the value of obj[props] or obj[props[0]][props[1]][...]
 * obj = {a: {b: {c: 1}}};
 * get(obj, 'a') == {b: {c: 1}}
 * get(obj, ['a']) == {b: {c: 1}}
 * get(obj, ['a', 'b', 'c']) == 1;
 */
exports.get = function (obj, props) {
  let val, i;
  if (typeof obj !== 'object') {
    throw new Error('Prototype:set - obj is not an object.');
  }
  if (_.isString(props) && !_.isNil(obj[props])) return obj[props];
  if (_.isString(props)) props = props.split('.');
  if (Array.isArray(props)) {
    if (props.length === 0) {
      throw new Error('Prototype:get - props.length is 0.');
    }
    val = obj;
    for (i = 0; i < props.length; i++) {
      if (_.isString(props[i])) {
        if (!_.isNil(val[props[i]])) {
          val = val[props[i]]
        } else {
          return;
        }
      } else {
        throw new Error('Prototype:get - props[' + i + '] is not a string');
      }
    }
    return val;
  }
  throw new Error('Prototype:get - props is not a string or array');
};

/**
 * assigns val to obj[props] or obj[props[0]][props[1]][...]
 * @param {Object} obj
 * @param {Array.<string>|string} props - a property name, or array of such.
 * @param {*} val
 * @returns {Object} the modified object
 * obj = {a: {b: {c: 1}}}
 * set(obj, 'a', 2) => obj = {a: 2}
 * set(obj, ['a'], 2) => obj = {a: 2}
 * set(obj, ['a', 'b', 'c'], 2) => obj = {a: {b: {c: 2}}}
 * set(obj, ['a', 'b', 'd'], 2) => obj = {a: {b: {c: 1, d: 2}}}
 */
exports.set = function (obj, props, val) {
  let i, prop;
  if (typeof obj !== 'object') {
    throw new Error('Prototype:set - obj is not an object.');
  }
  if (_.isString(props)) props = props.split('.');
  if (Array.isArray(props)) {
    if (props.length === 0) {
      throw new Error('Prototype:get - props.length is 0.');
    }
    prop = obj;
    for (i = 0; i < props.length - 1; i++) {
      if (_.isString(props[i])) {
        if (_.isNil(prop[props[i]]) || typeof prop[props[i]] !== 'object') {
          prop[props[i]] = {};
        }
        prop = prop[props[i]];
      } else {
        throw new Error('Prototype:set - props[' + i + '] is not a string');
      }
    }
    if (!_.isString(props[i])) {
      throw new Error('Prototype:set - props[' + i + '] is not a string');
    }
    // i === props.length - 1
    prop[props[i]] = val;
    return obj;
  }
  throw new Error('Prototype:set - props is not a string or array');
};

/**
 * @param obj
 * @param prop
 * @returns {boolean} whether obj[prop] is not nil
 */
exports.has = function (obj, prop) {
  return !_.isNil(obj[prop]);
};

/**
 * @param {*} val
 * @returns {boolean} whether the type needs special cloning.
 * @private
 */
function _isSpecificValue(val) {
  return val instanceof Date || val instanceof RegExp || val instanceof Node;
}

/**
 * @param {Date|RegExp|Node} val
 * @returns {Date|RegExp|Node} cloned version of val or a reference to it.
 * @private
 */
function _cloneSpecificValue(val) {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else if (val instanceof Node) {
    return val;
  } else {
    throw new Error('Prototype: Unexpected type');
  }
}

/**
 * @param {Array} arr
 * @returns {Array} recursive clone of arr.
 */
function _deepCloneArray(arr) {
  let clone = [];
  arr.forEach(function (item, index) {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = _deepCloneArray(item);
      } else if (_isSpecificValue(item)) {
        clone[index] = _cloneSpecificValue(item);
      } else {
        clone[index] = _.deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });
  return clone;
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
exports.deepExtend = function (/*obj_1, [obj_2], [obj_N]*/) {
  if (arguments.length < 1 || typeof arguments[0] !== 'object') return false;
  if (arguments.length < 2) return arguments[0];

  let target = arguments[0];
  // convert arguments to array and cut off target object
  let args   = Array.prototype.slice.call(arguments, 1);

  let val, src;

  args.forEach(function (obj) {
    // skip argument if it is array or isn't object
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach(function (key) {
      src = target[key]; // source value
      val = obj[key]; // new value

      // recursion prevention
      if (val === target) {
        /**
         * if new value isn't object then just overwrite by new value
         * instead of extending.
         */
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;
        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = _deepCloneArray(val);
        // custom cloning and overwrite for specific objects
      } else if (_isSpecificValue(val)) {
        target[key] = _cloneSpecificValue(val);
        // overwrite by new value if source isn't object or array
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = _.deepExtend({}, val);
        // source value and new value is objects both, extending...
      } else {
        target[key] = _.deepExtend(src, val);
      }
    });
  });

  return target;
};

/**
 * @param {*} val
 * @returns {Array} returns val or an array with val as its first value, dependent if val is an
 * array.
 */
exports.arrify = function (val) {
  if (_.isNil(val)) return [];
  return Array.isArray(val) ? val : [val];
};