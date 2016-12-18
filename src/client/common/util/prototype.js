/**
 * Proudly created by ohad on 18/12/2016.
 */
/**
 * @param {*} obj
 * @returns {boolean} whether obj has no properties of its own.
 */
module.exports.isEmpty = function (obj) {
    var key;
    // null and undefined are "empty"
    if (obj === null || obj === undefined) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (key in obj) {
        if (obj.hasOwnProperty(key)) return false;
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
module.exports.get = function (obj, props) {
    var val, i;
    if (typeof obj !== 'object') {
        throw new TypeError('BrainPal Prototype.set - obj is not an object.');
    }
    if (typeof props === 'string' && obj.hasOwnProperty(props)) {
        return obj[props];
    }
    if (props instanceof Array) {
        if (props.length === 0) {
            throw new RangeError('BrainPal Prototype.get - props.length is 0.');
        }
        val = obj;
        for (i = 0; i < props.length; i++) {
            if (typeof props[i] === 'string') {
                if (val.hasOwnProperty(props[i])) {
                    val = val[props[i]]
                } else {
                    return;
                }
            } else {
                throw new TypeError('BrainPal Prototype.get - props[' + i + '] is not a string');
            }
        }
        return val;
    }
    throw new TypeError('BrainPal Prototype.get - props is not a string or array');
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
module.exports.set = function (obj, props, val) {
    var i, prop;
    if (typeof obj !== 'object') {
        throw new TypeError('BrainPal Prototype.set - obj is not an object.');
    }
    if (typeof props === 'string') {
        obj[props] = val;
        return obj;
    } else if (props instanceof Array) {
        if (props.length === 0) {
            throw new RangeError('BrainPal Prototype.get - props.length is 0.');
        }
        prop = obj;
        for (i = 0; i < props.length - 1; i++) {
            if (typeof props[i] === 'string') {
                if (!prop.hasOwnProperty(props[i]) || typeof prop[props[i]] !== 'object') {
                    prop[props[i]] = {};
                }
                prop = prop[props[i]];
            } else {
                throw new TypeError('BrainPal Prototype.set - props[' + i + '] is not a string');
            }
        }
        if (typeof props[i] !== 'string') {
            throw new TypeError('BrainPal Prototype.set - props[' + i + '] is not a string');
        }
        // i === props.length - 1
        prop[props[i]] = val;
        return obj;
    } else {
        throw new TypeError('BrainPal Prototype.set - props is not a string or array');
    }
};