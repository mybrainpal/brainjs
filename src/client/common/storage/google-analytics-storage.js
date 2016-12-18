/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Saves data as google analytics events by stringify json objects.
 */
var Logger          = require('./../log/logger'),
    Level           = require('./../log/logger').Level,
    GoogleAnalytics = require('./../../integrations/google-analytics');
/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
module.exports.save = function save(subject) {
    var category = 'BPStorage:';
    var action   = JSON.stringify(subject);
    var label    = '';
    var value    = 0;
    try {
        if (subject.hasOwnProperty('client')) {
            category += 'client:' + JSON.stringify(subject.client);
        }
        if (subject.hasOwnProperty('anchor')) {
            action = 'anchor:' + JSON.stringify(subject.anchor);
        }
        if (subject.hasOwnProperty('subject')) {
            label = JSON.stringify(subject.subject);
            value = subject.subject.price || subject.subject.count || value;
        }
        ga(GoogleAnalytics.tracketName + '.send', 'event', {
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
 * @returns {boolean} whether #save is ready to be invoked.
 */
module.exports.isReady = function () {
    return GoogleAnalytics.isReady();
};

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 */
module.exports.init = function (options) {
    GoogleAnalytics.init(options);
};

/**
 * Runs handler as soon as the storage is ready.
 * @param {Function} handler
 */
module.exports.onReady = function (handler) {
    GoogleAnalytics.onReady(handler)
};
