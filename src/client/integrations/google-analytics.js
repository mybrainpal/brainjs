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
var Logger                   = require('./../common/log/logger'),
    Level = require('./../common/log/logger').Level;

/**
 * Initializes Google Analytics script.
 * @param options
 *  @property {string} [trackerName=BrainPal]
 *  @property {string} [trackingId=UA-88758826-1]
 */
module.exports.init = function (options) {
    (function (window, document, scriptTagName, src, name, gaScript, firstScript) {
        window['GoogleAnalyticsObject'] = name;
        window[name]   = window[name] || function () {
                (window[name].q = window[name].q || []).push(arguments)
            };
        window[name].l = 1 * new Date();
        gaScript       = document.createElement(scriptTagName);
        firstScript    = document.getElementsByTagName(scriptTagName)[0];
        gaScript.async = 1;
        gaScript.src   = src;
        firstScript.addEventListener('onload', _onload);
        firstScript.parentNode.insertBefore(gaScript, firstScript);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    if (options.hasOwnProperty('trackerName')) {
        _updateTrackerName(options.trackerName);
    }
    if (options.hasOwnProperty('trackerId')) {
        _updateTrackingId(options.trackerId);
    }
    if (options.hasOwnProperty('cookieDomain')) {
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
var _trackerName = 'BrainPal';
module.exports.tracketName   = _trackerName;

/**
 * Updates internal and exported track names.
 * @param {string} trackerName
 * @private
 */
function _updateTrackerName(trackerName) {
    if (typeof trackerName === 'string') {
        _trackerName               = trackerName;
        module.exports.tracketName = _trackerName;
    }
}

/**
 * Google Analytics tracker ID, so that BrainPal events are logged into BrainPal Google
 * Analytics accounts.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#trackingId
 * @type {string}
 * @private
 */
var _trackingId = 'UA-88758826-1';
module.exports.trackingId    = _trackingId;

/**
 * Updates internal and exported track names.
 * @param {string} trackingId
 * @private
 */
function _updateTrackingId(trackingId) {
    if (typeof trackingId === 'string') {
        _trackingId               = trackingId;
        module.exports.trackingId = _trackingId;
    }
}

/**
 * Cookies domain. 'none' is for localhost, and 'auto' for the publisher's.
 * @type {string}
 * @private
 */
var _cookieDomain = 'auto';
module.exports.cookieDomain  = _cookieDomain;
/**
 * Updates internal and exported cookieDomain.
 * @param {string} cookieDomain
 * @private
 */
function _updateCookieDomain(cookieDomain) {
    if (typeof cookieDomain === 'string') {
        _cookieDomain               = cookieDomain;
        module.exports.cookieDomain = cookieDomain;
    }
}

/**
 * Ready event name. Fires when Google Analytics script is loaded.
 * @type {string}
 * @private
 */
var _loadEventName           = 'google-analytics-loaded';
module.exports.loadEventName = _loadEventName;

/**
 * Fires a load event.
 * @private
 */
function _onload() {
    var event = new window.CustomEvent(
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
module.exports.isReady = isReady;

/**
 * Runs handler as soon as Google Analytics is loaded.
 * @param handler
 */
module.exports.onReady = function (handler) {
    if (isReady()) {
        ga(handler);
    }
    window.addEventListener(_loadEventName, function () {
        ga(handler);
    });
};