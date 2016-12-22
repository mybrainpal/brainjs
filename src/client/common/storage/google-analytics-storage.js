/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Saves data as google analytics events by stringify json objects.
 */
var _               = require('./../../common/util/wrapper'),
    Logger          = require('./../log/logger'),
    Level           = require('./../log/logger').Level,
    GoogleAnalytics = require('./../../integrations/google-analytics');
/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
exports.save = function save(subject) {
    var category = 'BrainPal:';
    var action   = JSON.stringify(subject);
    var label    = '';
    var value    = 0;
    try {
        if (_.has(subject, 'experiment')) {
            category += 'experiment:' + JSON.stringify(subject.experiment);
        }
        if (_.has(subject, 'exerimentGroup')) {
            category += 'experimentGroup:' + JSON.stringify(subject.group);
        }
        if (_.has(subject, 'client')) {
            category += 'client:' + JSON.stringify(subject.client);
        }
        if (_.has(subject, 'anchor')) {
            action = 'anchor:' + JSON.stringify(subject.anchor);
        }
        if (_.has(subject, 'subject')) {
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
 * @returns {boolean} whether #save is ready to be invoked.
 */
exports.isReady = function () {
    return GoogleAnalytics.isReady();
};

/**
 * Takes care of requirements for this storage.
 * @param {Object} [options]
 */
exports.init = function (options) {
    GoogleAnalytics.init(options);
};

/**
 * Runs handler as soon as the storage is ready.
 * @param {Function} handler
 */
exports.onReady = function (handler) {
    GoogleAnalytics.onReady(handler)
};
