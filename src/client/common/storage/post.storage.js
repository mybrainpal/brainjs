/**
 * Proudly created by ohad on 14/02/2017.
 *
 * Send data to the server using http requests.
 */
const Client = require('../client'),
      _      = require('../util/wrapper'),
      Const           = require('../../../common/const'),
      Storage         = require('./storage');
/**
 * Sends a HTTP request with message.
 * @param {Object} message
 */
exports.save = function save(message) {
  message = _enrich(message);
  const backendUrl = message.backendUrl;
  delete message.backendUrl;
  _.http.ajax(process.env.BACKEND_HOST + '/' + backendUrl, message);
};

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 * @param {function} onReady
 */
exports.init = function (options, onReady) {
  // Waiting for google analytics, so that Client.id exists.
  // Client.init(() => {
    let userMessage = {
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
  //   Storage.save(userMessage);
  // // });
  // onReady();
  _.http.ajax(Const.BACKEND_URL.CLIENT, userMessage, onReady)
};

/**
 * Enriches message with additional properties.
 * @param {Object} message
 * @private
 */
function _enrich(message) {
  return _.deepExtend(message, {
    timestamp: new Date().getTime(),
    // client   : {
    //   id     : Client.id,
    //   created: Client.created
    // },
    // url      : window.location.href,
    tracker  : Client.tracker
  });
}
