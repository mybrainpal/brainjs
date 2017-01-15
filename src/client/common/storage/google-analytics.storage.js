/**
 * Proudly created by ohad on 09/12/2016.
 *
 * Saves data as google analytics events by stringify json objects.
 */
let Logger = require('./../log/logger'),
    Level           = require('./../log/logger').Level,
    GoogleAnalytics = require('./../../integrations/google-analytics');
/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
exports.save = function save(subject) {
    let category = 'BrainPal:';
    let action   = JSON.stringify(subject);
    let label    = '';
    let value    = 0;
    try {
        if (subject.experiment) {
            category += 'experiment:' + JSON.stringify(subject.experiment);
        }
        if (subject.exerimentGroup) {
            category += 'experimentGroup:' + JSON.stringify(subject.group);
        }
        if (subject.client) {
            category += 'client:' + JSON.stringify(subject.client);
        }
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

