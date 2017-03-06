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
const _         = require('../common/util/wrapper'),
      BaseError = require('../common/log/base.error'),
      Const     = require('../../common/const');
/**
 * Initializes Google Analytics script.
 * @param options
 *  @property {string} [trackerName=BrainPal]
 *  @property {string} [trackingId=UA-91064115-1]
 */
exports.init = function (options = {}) {
  if (exports.isReady()) return;
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
    firstScript.parentNode.insertBefore(gaScript, firstScript);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  if (!_.isNil(options.trackerName)) {
    if (!_.isString(options.trackerName)) {
      throw new BaseError('GoogleAnalytics: trackerName must be empty or a string');
    } else {
      exports.trackerName = options.trackerName;
    }
  }
  if (!_.isNil(options.trackingId)) {
    if (!_.isString(options.trackingId)) {
      throw new BaseError('GoogleAnalytics: trackingId must be empty or a string');
    } else {
      exports.trackingId = options.trackingId;
    }
  }
  if (!_.isNil(options.cookieDomain)) {
    if (!_.isString(options.cookieDomain)) {
      throw new BaseError('GoogleAnalytics: trackerName must be empty or a string');
    } else {
      exports.cookieDomain = options.cookieDomain;
    }
  }
  window.ga('create', {
    trackingId  : exports.trackingId,
    cookieDomain: exports.cookieDomain,
    name        : exports.trackerName
  });
  if (process.env.NODE_ENV === Const.ENV.PROD) {
    window.ga(exports.trackerName + '.send', 'pageview');
  }
};

/**
 * Google Analytics tracker name, so that BrainPal events are distinguished from the publisher's
 * ones.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers#naming_trackers
 * @type {string}
 */
exports.trackerName = 'BrainPal';

/**
 * Google Analytics tracker ID, so that BrainPal events are logged into BrainPal Google
 * Analytics accounts.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#trackingId
 * @type {string}
 */
exports.trackingId = 'UA-91064115-1';

/**
 * Cookies domain. 'none' is for localhost, and 'auto' for the publisher's.
 * @type {string}
 */
exports.cookieDomain = 'auto';//process.env.NODE_ENV === Const.ENV.PROD ? 'auto' : 'none';

/**
 * @returns {boolean} whether Google Analytics is loaded
 */
exports.isReady = function () {
  if (!_.isFunction(window.ga)) return false;
  if (!_.isFunction(window.ga.getAll)) return false;
  //noinspection JSUnresolvedFunction
  const trackers = window.ga.getAll();
  for (let i = 0; i < trackers.length; i++) {
    if (trackers[i].get('name') === exports.trackerName) return true;
  }
  return false;
};

/**
 * Runs handler as soon as Google Analytics tracker is initialized.
 * @param {function} handler
 */
exports.onReady = function (handler) {
  window.ga = window.ga || function () {
      (window.ga.q = window.ga.q || []).push(arguments)
    };
  window.ga(handler);
};
