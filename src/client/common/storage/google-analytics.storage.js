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
 * Logs an entry on subject.
 * @param {Object} subject
 */
exports.save = function save(subject) {
  let category = process.env.NODE_ENV === Const.ENV.PROD ? '' : (process.env.NODE_ENV + ': ');
  category += JSON.stringify(subject);
  let action   = '';
  let label    = '';
  let value    = 0;
  try {
    if (subject.anchor) {
      action = 'anchor:' + JSON.stringify(subject.anchor);
    }
    if (subject.subject) {
      label = JSON.stringify(subject.subject);
      value = subject.subject.price || subject.subject.count || value;
    }
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

