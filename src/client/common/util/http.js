/**
 * Proudly created by ohad on 20/03/2017.
 */
const _ = require('./prototype');

/**
 * Responsible for executing an AJAX request.
 * If the returned data is in JSON format, the function automatically parses it.
 *
 * @param {string} url - The URL destination.
 * @param {string|Object|FormData} data - Additional HTTP parameters. Defaults to an empty string.
 * @param {function} callback - once a request had been successfully completed the callback is
 * called with the request.
 * @param {string} [type = POST] - The request type (GET, POST).
 * @param {boolean} [async = true] - Whether to perform an async call.
 */
exports.ajax = function (url, data, callback, type = 'POST', async = true) {
  type = type.toUpperCase();
  data = _set(data, 'submit', 1);
  data = _set(data, 'ajax', 1);
  if (exports.csrf_token) data = _set(data, 'token', exports.csrf_token);

  let xhr             = new XMLHttpRequest();
  xhr.withCredentials = true;
  if (type === 'GET') {
    if (!_.isString(data)) {
      data = _toQueryString(data);
    }
    xhr.open('GET', url + '?' + data, async);
    xhr.send();
  } else if (type === 'POST') {
    if (!_.is(data, FormData)) {
      data = exports.toFormData(data);
    }
    xhr.open('POST', url, async);
    xhr.send(data);
  } else {
    throw new Error(`HttpUtil: unknown request type (${type}).`);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200 && _get(xhr, 'success')) {
        if (_get(xhr, 'csrf_token')) {
          exports.csrf_token = _get(xhr, 'csrf_token').toString();
        }
        let responseData = xhr.response;
        if (_get(xhr, 'json') && xhr.getResponseHeader('Content-Type') === 'application/json') {
          responseData = JSON.parse(xhr.response);
        }
        if (_.isFunction(callback)) callback(null, responseData);
      } else {
        if (_.isFunction(callback)) callback(xhr.responseText || xhr.status);
      }
    }
  }
};

/**
 * @param {string} [query] - URL or query string. i.e. example.com?key1=val1&key2=val2
 * @param {string|number} key - name or index (zero based) of parameter within query.
 * parameter (if any) is returned.
 * @returns {string|Object} if `key` is string, then returns the value of `key` parameter in
 * query. Otherwise (i.e. key is an integer) a pair of (name, value) of the key-th parameter. If
 * no parameter matches either criteria, undefined is returned.
 */
exports.getQueryParam = function (query, key) {
  let regex, results;
  if (!query) query = window.location.href;
  if (_.isString(key)) {
    key     = key.replace(/[\[\]]/g, '\\$&');
    regex   = new RegExp(`[?&](?:${key}|${encodeURIComponent(key)})(?:=([^&#]*)|&|#|$)`);
    results = regex.exec(query);
    if (!results || !_.isString(results[1])) return;
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  } else if (Number.isInteger(key) && key >= 0) {
    // const prefix = ``;
    regex   = new RegExp(`(?:[?&][^=]+=(?:[^&#]*)|&|#){${key}}[?&]([^=]+)=(?:([^&#]*)|&|#|$)`);
    results = regex.exec(query);
    if (!results || !_.isString(results[1]) || !_.isString(results[2])) return;
    return {
      key  : decodeURIComponent(results[1].replace(/\+/g, ' ')),
      value: decodeURIComponent(results[2].replace(/\+/g, ' '))
    };
  } else {
    throw new Error('HttpUtil: key must be a string or a non-negative integer.');
  }
};

/**
 * @param {string} query - URI or query string.
 * @param {string} key - of a parameter within query
 * @param {string} value - of key.
 * @returns {string} the new query with updated value of `key`. Old values are replaced.
 */
exports.setQueryParam = function (query, key, value) {
  const re        = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = query.indexOf('?') !== -1 ? '&' : '?';
  if (query.match(re)) {
    return query.replace(re, '$1' + key + '=' + encodeURIComponent(value) + '$2');
  }
  else {
    return query + separator + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
};

/**
 * @param {Object|string} src - json or a query string.
 * @returns {FormData} form data of the flattened json that can be used in Ajax POST requests.
 */
exports.toFormData = function (src) {
  let formData = new FormData();
  if (_.isString(src)) {
    let i = 0;
    let pair;
    while (pair = exports.getQueryParam(src, i)) {
      i++;
      formData.append(pair.key, pair.value);
    }
  } else {
    const flattened = _.flatten(src);
    for (let p in flattened) {
      formData.append(p, flattened[p]);
    }
  }
  return formData;
};

/**
 * @param {Object|FormData} src
 * @returns {string} query string with the flattened json values, or with the FormData entries.
 * Note that duplicated parameter names will overwrite one another, in an unstable fashion.
 * @private
 */
function _toQueryString(src) {
  let query = '';
  if (_.is(src, FormData)) {
    for (let pair of src.entries()) {
      query = exports.setQueryParam(query, pair[0], pair[1]);
    }
  } else {
    const flattened = _.flatten(src);
    for (let p in flattened) {
      query = exports.setQueryParam(query, p, flattened[p]);
    }
  }
  return query;
}

/**
 * Authentication token for our backend.
 * PHP naming convention is used for consistency purposes.
 * @type {string}
 * @private
 */
exports.csrf_token = '';

/**
 * @param {XMLHttpRequest} xhr
 * @param {string} key
 * @returns {string} a value associated with `key` of `xhr` response. If the response is not a
 * json or a query string, then nothing is returned.
 * @private
 */
function _get(xhr, key) {
  if (_.isEmpty(xhr.response)) return;
  if (xhr.getResponseHeader('Content-Type') === 'application/json') {
    return JSON.parse(xhr.response)[key];
  }
  if (_.isString(xhr.response)) return exports.getQueryParam(xhr.response, key);
}

/**
 * Sets `value` to be associated with `key` for data.
 * @param {string|Object|FormData} data
 * @param {string} key
 * @param {*} value
 * @returns {string|Object|FormData} updated `data`
 * @private
 */
function _set(data, key, value) {
  if (!data) data = '';
  if (_.isString(data)) {
    data = exports.setQueryParam(data, key, value);
  } else if (data instanceof FormData) {
    //noinspection JSUnresolvedFunction
    data.set(key, value);
  } else {
    data[key] = value;
  }
  return data;
}