/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Google Analytics integration with BrainPal, I get the feeling this is going to be a short
 * friendship.
 * <p>
 * This module includes:
 * <ul>
 *     <li> Insertion of GA script tag.</li>
 *     <li> OnLoad event for GA script.</li>
 * </ul>
 */
/**
 * Initializes Google Analytics script.
 * @param options
 *  @property {string} [trackerName=BrainPal]
 *  @property {string} [trackingId=UA-91064115-1]
 */
exports.init = function (options) {
  (function (window, document, scriptTagName, src, name, gaScript, firstScript) {
    window['GoogleAnalyticsObject'] = name;
    window[name]                    = window[name] || function () {
        (window[name].q = window[name].q || []).push(arguments)
      };
    window[name].l                  = 1 * new Date();
    gaScript                        = document.createElement(scriptTagName);
    firstScript                     = document.getElementsByTagName(scriptTagName)[0];
    gaScript.async                  = 1;
    gaScript.src                    = src;
    firstScript.addEventListener('onload', _onload);
    firstScript.parentNode.insertBefore(gaScript, firstScript);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  if (options.trackerName) {
    _updateTrackerName(options.trackerName);
  }
  if (options.trackingId) {
    _updateTrackingId(options.trackingId);
  }
  if (options.cookieDomain) {
    _updateCookieDomain(options.cookieDomain);
  }

  ga('create', {
    trackingId  : _trackingId,
    cookieDomain: _cookieDomain,
    name        : _trackerName
  });
  ga(_trackerName + '.send', 'pageview');
};

/**
 * Google Analytics tracker name, so that BrainPal events are distinguished from the publisher's
 * ones.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers#naming_trackers
 * @type {string}
 * @private
 */
let _trackerName    = 'BrainPal';
exports.trackerName = _trackerName;

/**
 * Updates internal and exported track names.
 * @param {string} trackerName
 * @private
 */
function _updateTrackerName(trackerName) {
  if (typeof trackerName === 'string') {
    _trackerName        = trackerName;
    exports.trackerName = _trackerName;
  }
}

/**
 * Google Analytics tracker ID, so that BrainPal events are logged into BrainPal Google
 * Analytics accounts.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#trackingId
 * @type {string}
 * @private
 */
let _trackingId = 'UA-91064115-1';
exports.trackingId = _trackingId;

/**
 * Updates internal and exported track names.
 * @param {string} trackingId
 * @private
 */
function _updateTrackingId(trackingId) {
  if (typeof trackingId === 'string') {
    _trackingId        = trackingId;
    exports.trackingId = _trackingId;
  }
}

/**
 * Cookies domain. 'none' is for localhost, and 'auto' for the publisher's.
 * @type {string}
 * @private
 */
let _cookieDomain    = 'auto';
exports.cookieDomain = _cookieDomain;
/**
 * Updates internal and exported cookieDomain.
 * @param {string} cookieDomain
 * @private
 */
function _updateCookieDomain(cookieDomain) {
  if (typeof cookieDomain === 'string') {
    _cookieDomain        = cookieDomain;
    exports.cookieDomain = cookieDomain;
  }
}

/**
 * Ready event name. Fires when Google Analytics script is loaded.
 * @type {string}
 * @private
 */
let _loadEventName    = 'google-analytics-loaded';
exports.loadEventName = _loadEventName;

/**
 * Fires a load event.
 * @private
 */
function _onload() {
  let event = new window.CustomEvent(
    _loadEventName,
    {
      detail    : {
        time: new Date()
      },
      bubbles   : false,
      cancelable: true
    }
  );
  window.dispatchEvent(event);
}

/**
 * @returns {boolean} whether Google Analytics is loaded
 */
function isReady() {
  return typeof ga === 'function';
}
exports.isReady = isReady;

/**
 * Runs handler as soon as Google Analytics is loaded.
 * @param handler
 */
exports.onReady = function (handler) {
  if (isReady()) {
    ga(handler);
  }
  window.addEventListener(_loadEventName, () => {
    ga(handler);
  });
};