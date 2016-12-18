/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
var Client    = require('../common/client'),
    Storage   = require('../common/storage/storage'),
    Logger    = require('../common/log/logger'),
    Level     = require('../common/log/logger').Level,
    DomUtils  = require('../common/util/dom'),
    Prototype = require('../common/util/prototype');
/**
 * Used to save data.
 * @type {Object}
 * @private
 */
var _storage  = Storage.getDefault();
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
 * @param {Array<Object>} [subjects]
 *  @property {string} [name]
 *  @property {string} [selector]
 * @param {Object} [anchor]
 *  @property {string} [selector]
 *  @property {string} [event]
 * @param {Object} [options]
 *  @property {Object} [client]
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 *
 */
module.exports.collect = function (subjects, anchor, options) {
    var emittedSubject = {}, i, j, target, props, prop = {}, val;
    if (subjects) {
        emittedSubject.subject = {};
        for (i = 0; i < subjects.length; i++) {
            target = document.querySelector(subjects[i].selector);
            if (target) {
                emittedSubject.subject[subjects[i].name] = DomUtils.text(target);
            } else {
                Logger.log(Level.WARNING, 'Collector: failed to select ' + subjects[i].selector);
            }
        }
        if (Prototype.isEmpty(emittedSubject.subject)) {
            delete emittedSubject.subject;
            Logger.log(Level.WARNING, 'Collector: subject is empty.');
        }
    }
    if (options) {
        if (options.hasOwnProperty('client')) {
            emittedSubject.client = {};
            if (options.client.hasOwnProperty('properties')) {
                for (i = 0; i < options.client.properties.length; i++) {
                    props = options.client.properties[i].split('.');
                    val   = Prototype.get(Client, props);
                    if (val) {
                        Prototype.set(emittedSubject.client, props, val);
                    }
                }
            }
            if (Prototype.isEmpty(emittedSubject.client)) {
                Logger.log(Level.WARNING, 'Collector: client is empty.');
                delete emittedSubject.client;
            }
        }
    }
    if (anchor && !Prototype.isEmpty(anchor)) {
        if (anchor.hasOwnProperty('selector')) {
            target = document.querySelector(anchor.selector);
            if (target) {
                if (anchor.hasOwnProperty('event')) {
                    emittedSubject.anchor = {
                        event     : anchor.event,
                        target    : anchor.selector,
                        targetText: DomUtils.text(target)
                    };
                    target.addEventListener(anchor.event, function () {
                        _storage.save(emittedSubject);
                    });
                } else {
                    Logger.log(Level.WARNING, 'Collector: anchor is missing an event name.');
                }
            } else {
                Logger.log(Level.WARNING,
                           'Collector: could not find anchor\'s target at ' + anchor.selector);
            }
        } else {
            Logger.log(Level.WARNING, 'Collector: anchor is missing a selector.');
        }
    } else if (!Prototype.isEmpty(emittedSubject)) {
        Logger.log(Level.FINE, 'Collector: anchor is missing.');
        _storage.save(emittedSubject);
    }
};
