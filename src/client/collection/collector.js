/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
var Storage  = require('../common/storage/storage'),
    Logger   = require('../common/log/logger'),
    Level    = require('../common/log/logger').Level;
/**
 * Used to save data.
 * @type {Object}
 * @private
 */
var _storage = Storage.getDefault();
/**
 * @param {Object} options
 *  @property {string} storage
 */
module.exports.options = function (options) {
    if (options.hasOwnProperty('storage')) {
        _storage = Storage.get(options.storage);
    }
};

/**
 * Collects data on subject based on anchor.
 * @param {Object} subject
 * @param {Anchor} [anchor]
 */
module.exports.collect = function (subject, anchor) {
    if (anchor) {
        if (!anchor.target) {
            Logger.log(Level.INFO, 'Collector: refused collection because anchor has no target');
            return;
        }
        anchor.eventNames.map(function (eventName) {
            var storeFn = function () {
                if (typeof subject === 'string') {
                    subject += ',eventName:' + eventName + ',anchor:' + anchor.label;
                } else {
                    subject.eventName   = eventName;
                    subject.anchorLabel = anchor.label;
                }
                _storage.save(subject);
            };
            anchor.target.addEventListener(eventName, storeFn);
        });
        return;
    }
    _storage.save(subject);
};
