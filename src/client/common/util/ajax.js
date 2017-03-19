/**
 * Proudly created by ohad on 20/03/2017.
 */
const _ = require('./prototype');

/**
 * Responsible for executing an AJAX request.
 * If the returned data is in JSON format, the function automatically decodes it.
 *
 * @param {string} url - The URL destination.
 * @param {function} callback - once a request had been successfully completed the callback is
 * called with the request.
 * @param {string} type - The request type (GET, POST). Defaults to 'POST'.
 * @param {string|Object|FormData} data - Additional HTTP parameters. Defaults to an empty string.
 * @param {boolean} async - whether to perform an async call.
 */
exports.ajax = function (url, data, callback, type = 'POST', async = true) {
  type = type.toUpperCase();
  _set(data, 'submit', 1);
  _set(data, 'ajax', 1);
  if (_csrf_token) _set(data, 'token', _csrf_token);

  let xhr = new XMLHttpRequest();
  if (type === 'POST' && !(data instanceof FormData) && !_.isString(data)) {
    data = exports.jsonToFormData(data);
  }
  xhr.withCredentials = true;
  if (type === 'GET') {
    xhr.open('GET', url + '?' + data, async);
    xhr.send();
  } else {
    xhr.open('POST', url, async);
    xhr.send(data);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
      _csrf_token = _get(xhr.response, 'csrf_token');
      callback(xhr);
    }
  }
};

/**
 * @param {string} key - of parameter within query.
 * @param {string} query - URL or query string. i.e. example.com?key1=val1&key2=val2
 * @returns {string} value of `key` parameter in query, or null if none was found.
 */
exports.getParameterFromQuery = function (key, query) {
  if (!query) query = window.location.href;
  key           = key.replace(/[\[\]]/g, '\\$&');
  const regex   = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(query);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * @param {string} query - URI or query string.
 * @param {string} key - of a parameter within query
 * @param {string} value - of key.
 * @returns {string} the new query with updated value of `key`. Old values are replaced.
 */
exports.updateQueryStringParameter = function (query, key, value) {
  const re        = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = query.indexOf('?') !== -1 ? "&" : "?";
  if (query.match(re)) {
    return query.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return query + separator + key + "=" + value;
  }
};

/**
 * @param {Object} json
 * @returns {FormData} form data of the flattened json that can be used in Ajax POST requests.
 */
exports.jsonToFormData = function (json) {
  const flattened = _.flatten(json);
  let formData    = new FormData();
  for (let p in flattened) {
    formData.append(p, flattened[p]);
  }
  return formData;
};

/**
 * Authentication token for our backend.
 * @type {string}
 * @private
 */
let _csrf_token = '';

/**
 * @param {string|Object|FormData} data
 * @param {string} key
 * @returns {*} all values associated with key of data.
 * @private
 */
function _get(data, key) {
  if (_.isString(data)) return exports.getParameterFromQuery(key, data);
  if (_.isNil(data) || !_.isObject(data)) return;
  if (data instanceof FormData) {
    //noinspection JSUnresolvedFunction
    return data.getAll(key);
  }
  return data[key];
}

/**
 * Sets `value` to be associated with `key` for data.
 * @param {string|Object|FormData} data
 * @param {string} key
 * @param {*} value
 * @private
 */
function _set(data, key, value) {
  if (_.isNil(data)) return;
  if (_.isString(data)) {
    exports.updateQueryStringParameter(query, key, value);
  } else if (data instanceof FormData) {
    //noinspection JSUnresolvedFunction
    data.set(key, value);
  } else {
    data[key] = value;
  }
}