/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Saves data as google analytics events by stringify json objects.
 */
let Logger          = require('../log/logger'),
    Level           = require('../log/logger').Level,
    GoogleAnalytics = require('../../integrations/google-analytics'),
    Const           = require('../../../common/const');
/**
 * Saves an entry as an event to Google Analytics.
 * @param {Object} message
 */
exports.save = function save(message) {
  let category = process.env.NODE_ENV === Const.ENV.PROD ? '' : (process.env.NODE_ENV + ': ');
  category += JSON.stringify(message);
  let action   = '';
  let label    = '';
  let value    = 0;
  try {
    ga(GoogleAnalytics.trackerName + '.send', 'event', {
      eventCategory: category,
      eventAction  : action,
      eventLabel   : label,
      eventValue   : value
    });
  } catch (e) {
    Logger.log(Level.ERROR, 'GoogleAnalyticsStorage: ' + JSON.stringify(e));
  }
};

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 * @param {function} onReady
 */
exports.init = function (options, onReady) {
  GoogleAnalytics.init(options);
  GoogleAnalytics.onReady(onReady);
};