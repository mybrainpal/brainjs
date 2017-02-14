/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Saves data as google analytics events by stringify json objects.
 */
const Logger          = require('./../log/logger'),
      Level           = require('./../log/logger').Level,
      GoogleAnalytics = require('./../../integrations/google-analytics');
/**
 * Logs an entry on message.
 * @param {Object} message
 */
exports.save = function save(message) {
  let category = 'BrainPal:';
  let action = JSON.stringify(message);
  let label    = '';
  let value    = 0;
  try {
    if (message.experiment) {
      category += 'experiment:' + JSON.stringify(message.experiment);
    }
    if (message.exerimentGroup) {
      category += 'experimentGroup:' + JSON.stringify(message.group);
    }
    if (message.client) {
      category += 'client:' + JSON.stringify(message.client);
    }
    if (message.anchor) {
      action = 'anchor:' + JSON.stringify(message.anchor);
    }
    if (message.subject) {
      label = JSON.stringify(message.subject);
      value = message.subject.price || message.subject.count || value;
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

