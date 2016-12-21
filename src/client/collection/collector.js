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
 * @param {Object} [options]
 *  @property {Array<Object>} [subjectProps] - extra properties to attach to the event.
 *      @property {string} [name]
 *      @property {string} [selector] - of the element in the dom whose .text() contains a relevant
 *                                      piece of data
 *  @property {Object} [anchor] - a container for event and collection of elements
 *      @property {string} [selector] - of collection of elements to listen for event.
 *      @property {string} [event] - to listen.
 *  @property {Object} [client] - container for Client properties to collect.
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 *  @property {Experiment} [experiment] - that encompasses this data collection.
 *  @property {ExperimentGroup} [experimentGroup] - that the client belongs to.
 */
exports.collect = function (options) {
    var targets, subjectOptions, immediateEmit;
    if (_.has(options, 'anchor') && _.has(options.anchor, 'selector') &&
        _.has(options.anchor, 'event')) {
        targets = document.querySelectorAll(options.anchor.selector);
        if (_.isEmpty(targets)) {
            Logger.log(Level.WARNING,
                       'Collector: failed to select anchor at ' + options.anchor.selector);
            return;
        }
        _.forEach(targets, function (target) {
            if (target instanceof EventTarget) {
                target.addEventListener(options.anchor.event, function () {
                    var emitted;
                    emitted = _createSubject(_.merge({anchor: {target: target}}, options));
                    if (!_.isEmpty(emitted)) {
                        _storage.save(emitted);
                    }
                });
            }
        });
    } else {
        immediateEmit = _createSubject(options);
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
 *  @property {Experiment} [experiment] - that encompasses this data collection.
 *  @property {ExperimentGroup} [experimentGroup] - that the client belongs to.
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
    if (_.has(options, 'experiment')) {
        emittedSubject.experiment = {};
        if (_.has(options.experiment, 'id')) {
            emittedSubject.experiment.id = options.experiment.id;
        }
        if (_.has(options.experiment, 'isClientIncluded')) {
            emittedSubject.experiment.isClientIncluded = options.experiment.isClientIncluded;
        }
        if (_.isEmpty(emittedSubject.experiment)) {
            Logger.log(Level.WARNING, 'Collector: experiment is empty.');
            delete emittedSubject.client;
        }
    }
    if (_.has(options, 'experimentGroup')) {
        emittedSubject.experimentGroup = {};
        if (_.has(options.experimentGroup, 'experimentId')) {
            emittedSubject.experimentGroup.experimentId = options.experimentGroup.experimentId;
        }
        if (_.has(options.experimentGroup, 'isClientIncluded')) {
            emittedSubject.experimentGroup.isClientIncluded =
                options.experimentGroup.isClientIncluded;
        }
        if (_.has(options.experimentGroup, 'label')) {
            emittedSubject.experimentGroup.label = options.experimentGroup.label;
        }
        if (_.isEmpty(emittedSubject.experiment)) {
            Logger.log(Level.WARNING, 'Collector: experiment is empty.');
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
