/**
 * Proudly created by ohad on 14/02/2017.
 *
 * Send data to the server using http requests.
 */

/**
 * Sends a HTTP request with message.
 * @param {Object} message
 */
exports.save = function save(message) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', process.env.STORAGE_ROUTE, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(message));
};
