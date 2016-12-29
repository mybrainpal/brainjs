/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
let Client   = require('../common/client'),
    Storage  = require('../common/storage/storage'),
    Logger   = require('../common/log/logger'),
    Level    = require('../common/log/logger').Level,
    _        = require('../common/util/wrapper');
/**
 * Used to save data.
 * @type {Object}
 * @private
 */
let _storage = Storage.getDefault();

/**
 * @param {Object} options
 *  @property {string} storage
 */
exports.options = function (options) {
    if (options.storage) {
        _storage = Storage.get(options.storage);
    }
};

/**
 * Collects data (subject) based on an event (i.e. anchor).
 * @param {Object} [options] - can be an array.
 *  @property {Array<Object>} [dataProps] - extra properties to attach to the event.
 *      @property {string} [name]
 *      @property {string} [selector] - of the element in the dom whose .text() contains a relevant
 *          piece of data
 *  @property {Object} [anchor] - a container for event and collection of elements
 *      @property {string} [selector] - of collection of elements to listen for event.
 *      @property {string} [event] - to listen.
 *  @property {Object} [client] - container for Client properties to collect.
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 *  @property {Experiment} [experiment] - that encompasses this data collection.
 *  @property {ExperimentGroup} [experimentGroup] - that the client belongs to.
 *  @property {string} iterSelector - used to iterate over repetitive things in the page.
 *      Whenever used, all other selectors are used with relation to it.
 *      Consider a page with multiple products, that each has an identical layout, and we want
 *      to capture all of them.
 *  @property {Node} [rootNode = document] - the node from which to execute all selectors.
 */
exports.collect = function (options) {
    let targets, immediateEmit, iterRoots;
    if (_.isArray(options)) {
        _.forEach(options, function (item) {
            exports.collect(item);
        });
        return;
    }
    if (!options.rootNode) {
        options.rootNode = document;
    }
    if (options.iterSelector) {
        iterRoots = document.querySelectorAll(options.iterSelector);
        delete options.iterSelector;
        if (_.isEmpty(iterRoots)) {
            Logger.log(Level.WARNING,
                       'Collector: failed to select iterSelector at ' + options.anchor.selector);
            return;
        }
        _.forEach(iterRoots, function (rootNode) {
            exports.collect(_.merge(_.clone(options), {rootNode: rootNode}));
        });
        return;
    }
    if (options.anchor && options.anchor.selector &&
        options.anchor.event) {
        targets = options.rootNode.querySelectorAll(options.anchor.selector);
        if (_.isEmpty(targets)) {
            Logger.log(Level.WARNING,
                       'Collector: failed to select anchor at ' + options.anchor.selector);
            return;
        }
        _.forEach(targets, function (target) {
            if (target instanceof EventTarget) {
                target.addEventListener(options.anchor.event, function () {
                    let emitted;
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
 * @param {Object} options - similar to {@link #collect}
 * @return {Object} that we want to attach to the event, upon saving.
 * @private
 */
function _createSubject(options) {
    let emittedSubject = {}, i, target, val;

    if (_.isEmpty(options)) {
        Logger.log(Level.WARNING, 'Collector: created an empty subject.');
        return {};
    }
    if (!_.isEmpty(options.dataProps)) {
        emittedSubject.subject = {};
        for (i = 0; i < options.dataProps.length; i++) {
            target = options.rootNode.querySelector(options.dataProps[i].selector);
            if (target) {
                emittedSubject.subject[options.dataProps[i].name] = _.text(target);
            } else {
                Logger.log(Level.WARNING,
                           'Collector: failed to select ' + options.dataProps[i].selector);
            }
        }
        if (_.isEmpty(emittedSubject.subject)) {
            delete emittedSubject.subject;
            Logger.log(Level.WARNING, 'Collector: subject is empty.');
        }
    }
    if (options.client) {
        emittedSubject.client = {};
        if (options.client.properties) {
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
    if (options.experiment) {
        emittedSubject.experiment = {};
        if (options.experiment.id) {
            emittedSubject.experiment.id = options.experiment.id;
        }
        if (options.experiment.isClientIncluded) {
            emittedSubject.experiment.isClientIncluded = options.experiment.isClientIncluded;
        }
        if (_.isEmpty(emittedSubject.experiment)) {
            Logger.log(Level.WARNING, 'Collector: experiment is empty.');
            delete emittedSubject.client;
        }
    }
    if (options.experimentGroup) {
        emittedSubject.experimentGroup = {};
        if (options.experimentGroup.experimentId) {
            emittedSubject.experimentGroup.experimentId = options.experimentGroup.experimentId;
        }
        if (options.experimentGroup.isClientIncluded) {
            emittedSubject.experimentGroup.isClientIncluded =
                options.experimentGroup.isClientIncluded;
        }
        if (options.experimentGroup.label) {
            emittedSubject.experimentGroup.label = options.experimentGroup.label;
        }
        if (_.isEmpty(emittedSubject.experiment)) {
            Logger.log(Level.WARNING, 'Collector: experiment is empty.');
            delete emittedSubject.client;
        }
    }
    if (!_.isEmpty(options.anchor)) {
        emittedSubject.anchor = {};
        if (options.anchor.selector) {
            emittedSubject.anchor.selector = options.anchor.selector;
        } else {
            Logger.log(Level.WARNING, 'Collector: anchor is missing a selector.');
        }
        if (options.anchor.event) {
            emittedSubject.anchor.event = options.anchor.event;
        } else {
            Logger.log(Level.WARNING, 'Collector: anchor is missing a selector.');
        }
        if (options.anchor.target) {
            emittedSubject.anchor.targetText = _.text(options.anchor.target);
        }
        if (_.isEmpty(emittedSubject.anchor)) {
            Logger.log(Level.WARNING, 'Collector: subject\'s anchor is empty.');
            delete emittedSubject.anchor;
        }
    }
    return emittedSubject;
}
