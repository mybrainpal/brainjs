/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
let Client  = require('../common/client'),
    Storage = require('../common/storage/storage'),
    Logger  = require('../common/log/logger'),
    Level   = require('../common/log/logger').Level,
    _       = require('../common/util/wrapper');

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
 *      @property {boolean} [once = true] - whether to collect data on this anchor more than once.
 *  @property {Object} [client] - container for Client properties to collect.
 *      @property {Array.<string>} [properties] - 'agent.os' for `Client.agent.os`
 *  @property {Experiment} [experiment] - that encompasses this data collection.
 *  @property {Group} [experimentGroup] - that the client belongs to.
 *  @property {string} iterSelector - used to iterate over repetitive things in the page.
 *      Whenever used, all other selectors are used with relation to it.
 *      Consider a page with multiple products, that each has an identical layout, and we want
 *      to capture all of them.
 *  @property {Node} [rootNode = document] - the node from which to execute all selectors.
 */
exports.collect = function (options) {
  let targets, immediateEmit, iterRoots, i;
  if (Array.isArray(options)) {
    for (i = 0; i < options.length; i++) exports.collect(options[i]);
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
    for (i = 0; i < iterRoots.length; i++) {
      let newOptions = _.deepExtend({}, options, {rootNode: iterRoots[i]});
      delete newOptions.iterSelector;
      exports.collect(newOptions);
    }
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
    targets.forEach((target) => {
      if (target instanceof EventTarget) {
        const handler = _.on(options.anchor.event, () => {
          let emitted;
          emitted = _createSubject(_.deepExtend({anchor: {target: target}}, options));
          if (!_.isEmpty(emitted)) {
            Storage.save(emitted);
          }
          if (!_.has(options.anchor, 'once') || options.anchor.once) {
            _.off(options.anchor.event, handler, target, true);
          }
        }, {}, target, true);
      }
    });
  } else {
    immediateEmit = _createSubject(options);
    if (!_.isEmpty(immediateEmit)) {
      Storage.save(immediateEmit);
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
  if (!_.isNil(options.dataProps) && !Array.isArray(options.dataProps)) {
    options.dataProps = [options.dataProps];
  }
  if (!_.isEmpty(options.dataProps)) {
    emittedSubject.subject = {};
    for (i = 0; i < options.dataProps.length; i++) {
      target = options.rootNode.querySelector(options.dataProps[i].selector);
      if (target) {
        emittedSubject.subject[options.dataProps[i].name] = target.textContent;
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
  if (!_.isNil(options.experiment)) {
    emittedSubject.experiment = {};
    if (!_.isNil(options.experiment.id)) {
      emittedSubject.experiment.id = options.experiment.id;
    }
    if (!_.isNil(options.experiment.label)) {
      emittedSubject.experiment.label = options.experiment.label;
    }
    if (!_.isNil(options.experiment.included)) {
      emittedSubject.experiment.included = options.experiment.included;
    }
    if (_.isEmpty(emittedSubject.experiment)) {
      Logger.log(Level.WARNING, 'Collector: experiment is empty.');
      delete emittedSubject.client;
    }
  }
  if (!_.isNil(options.experimentGroup)) {
    emittedSubject.experimentGroup = {};
    if (!_.isNil(options.experimentGroup.experimentId)) {
      emittedSubject.experimentGroup.experimentId = options.experimentGroup.experimentId;
    }
    if (!_.isNil(options.experimentGroup.included)) {
      emittedSubject.experimentGroup.included =
        options.experimentGroup.included;
    }
    if (!_.isNil(options.experimentGroup.label)) {
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
      emittedSubject.anchor.targetText = options.anchor.target.textContent;
    }
    if (_.isEmpty(emittedSubject.anchor)) {
      Logger.log(Level.WARNING, 'Collector: subject\'s anchor is empty.');
      delete emittedSubject.anchor;
    }
  }
  return emittedSubject;
}
