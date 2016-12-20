/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
var Client   = require('../common/client'),
    Storage  = require('../common/storage/storage'),
    Logger   = require('../common/log/logger'),
    Level    = require('../common/log/logger').Level,
    _        = require('../common/util/wrapper');
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
exports.options = function (options) {
    if (_.has(options, 'storage')) {
        _storage = Storage.get(options.storage);
    }
};

/**
 * Collects data (subject) based on an event (i.e. anchor).
 * @param {Array<Object>} [subjectProps] - extra properties to attach to the event.
 *  @property {string} [name]
 *  @property {string} [selector] - of the element in the dom whose .text() contains a relevant
 *                                  piece of data
 * @param {Object} [anchor] - a container for event and collection of elements
 *  @property {string} [selector] - of collection of elements to listen for eventName.
 *  @property {string} [event] - to listen.
 * @param {Object} [options]
 *  @property {Object} [client] - container for Client properties to collect.
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 */
exports.collect = function (subjectProps, anchor, options) {
    var targets, subjectOptions, immediateEmit;
    if (anchor && _.has(anchor, 'selector') && _.has(anchor, 'event')) {
        _.forEach(document.querySelectorAll(anchor.selector), function (target) {
            if (target instanceof EventTarget) {
                target.addEventListener(anchor.event, function () {
                    var emitted;
                    subjectOptions = {
                        subjectProps: subjectProps,
                        anchor      : {
                            event   : anchor.event,
                            target  : target,
                            selector: anchor.selector
                        }
                    };
                    _.merge(subjectOptions, options);
                    emitted =  _createSubject(subjectOptions);
                    if (!_.isEmpty(emitted)) {
                        _storage.save(emitted);
                    }
                });
            }
        });
    } else {
        Logger.log(Level.FINE, 'Collector: could not use anchor.');
        subjectOptions = {subjectProps: subjectProps};
        _.merge(subjectOptions, options);
        immediateEmit =  _createSubject(subjectOptions);
        if (!_.isEmpty(immediateEmit)) {
            _storage.save(immediateEmit);
        }
    }
};

/**
 * @param {Object} options
 *  @property {Array<Object>} [subjectProps] - extra properties to attach to the event.
 *      @property {string} [name]
 *      @property {string} [selector] - of the element in the dom whose .text() contains a relevant
 *                                      piece of data
 *  @property {Object} [anchor] - a container for event and collection of elements
 *      @property {string} [selector] - used to select target.
 *      @property {EventTarget} [target] - that will be listened to save the subject.
 *      @property {string} [eventName] - to listen.
 *  @property {Object} [client] - container for Client properties to collect.
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 * @return {Object} that we want to attach to the event, upon saving.
 * @private
 */
function _createSubject(options) {
    var emittedSubject = {}, i, j, target, props, val;

    if (_.isEmpty(options)) {
        Logger.log(Level.WARNING, 'Collector: created an empty subject.');
        return {};
    }
    if (!_.isEmpty(options.subjectProps)) {
        emittedSubject.subject = {};
        for (i = 0; i < options.subjectProps.length; i++) {
            target = document.querySelector(options.subjectProps[i].selector);
            if (target) {
                emittedSubject.subject[options.subjectProps[i].name] = _.text(target);
            } else {
                Logger.log(Level.WARNING,
                           'Collector: failed to select ' + options.subjectProps[i].selector);
            }
        }
        if (_.isEmpty(emittedSubject.subject)) {
            delete emittedSubject.subject;
            Logger.log(Level.WARNING, 'Collector: subject is empty.');
        }
    }
    if (_.has(options, 'client')) {
        emittedSubject.client = {};
        if (_.has(options.client, 'properties')) {
            for (i = 0; i < options.client.properties.length; i++) {
                val = _.get(Client, options.client.properties[i]);
                if (val) {
                    _.set(emittedSubject.client, options.client.properties[i], val);
                }
            }
        }
        if (_.isEmpty(emittedSubject.client)) {
            Logger.log(Level.WARNING, 'Collector: client is empty.');
            delete emittedSubject.client;
        }
    }
    if (!_.isEmpty(options.anchor)) {
        emittedSubject.anchor = {};
        if (_.has(options.anchor, 'selector')) {
            emittedSubject.anchor.selector = options.anchor.selector;
        } else {
            Logger.log(Level.WARNING, 'Collector: anchor is missing a selector.');
        }
        if (_.has(options.anchor, 'event')) {
            emittedSubject.anchor.event = options.anchor.event;
        } else {
            Logger.log(Level.WARNING, 'Collector: anchor is missing a selector.');
        }
        if (_.has(options.anchor, 'target')) {
            emittedSubject.anchor.targetText = _.text(options.anchor.target);
        }
        if (_.isEmpty(emittedSubject.anchor)) {
            Logger.log(Level.WARNING, 'Collector: subject\'s anchor is empty.');
            delete emittedSubject.anchor;
        }
    }
    return emittedSubject;
}
