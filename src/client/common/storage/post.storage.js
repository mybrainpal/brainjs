/**
 * Proudly created by ohad on 14/02/2017.
 *
 * Send data to the server using http requests.
 */
const Client = require('../client'),
      _      = require('../util/wrapper'),
      Const  = require('../../../common/const');
/**
 * Sends a HTTP request with message.
 * @param {Object} message
 * @param {function} callback - to execute once the request had been completed successfully.
 */
exports.save = function save(message, callback) {
  message   = _enrich(message);
  const url = process.env.BACKEND_HOST + '/' + message.backendUrl;
  delete message.backendUrl;
  _.http.ajax(url, message, callback);
};

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 * @param {function} onReady
 */
exports.init = function (options, onReady) {
  let userMessage = {
    backendUrl: Const.BACKEND_URL.CLIENT,
    client    : {
      agent         : Client.agent,
      cookiesEnabled: Client.cookiesEnabled,
      screen        : {
        height: window.innerHeight,
        width : window.innerWidth
      }
    }
  };
  if (window.screen) {
    userMessage.client.screen.availHeight = window.screen.availHeight;
    userMessage.client.screen.availWidth  = window.screen.availWidth;
  }
  exports.save(userMessage, onReady);
};

/**
 * Enriches message with additional properties.
 * @param {Object} message
 * @private
 */
function _enrich(message) {
  return _.extend(message, {
    timestamp: new Date().getTime(),
    tracker  : Client.tracker
  });
}
