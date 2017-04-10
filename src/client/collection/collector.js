/**
 * Proudly created by ohad on 02/12/2016.
 *
 * Collects data on events, use with curiosity!
 */
let Storage   = require('../common/storage/storage'),
    Logger    = require('../common/log/logger'),
    Level     = require('../common/log/logger').Level,
    _         = require('../common/util/wrapper'),
    $         = require('../common/util/dom'),
    BaseError = require('../common/log/base.error'),
    Const     = require('../../common/const');

/**
 * Collects data (subject) based on an event (i.e. anchor).
 * @param {Object} options - can be an array.
 *  @property {string} event - to listen.
 *  @property {string} [selector] - of collection of elements to listen for event.
 *  @property {string|number} [state] - of session that is changed following the event (i.e.
 *  conversion).
 *  @property {boolean} [once = true] - whether to collect data on this anchor more than once.
 *  @property {boolean} [listen = true] - whether to listen to a DOM event, or log the event as is.
 *  @property {Experiment} [experiment] - that encompasses this data collection.
 *  @property {Group} [experimentGroup] - that the client belongs to.
 */
exports.collect = function (options) {
  exports.preconditions(options);
  if (_.isNil(options.listen) || options.listen) {
    const targets = options.selector ? $.all(options.selector) : [document];
    if (_.isEmpty(targets)) {
      Logger.log(Level.WARNING, 'Collector: failed to select at ' + options.selector);
      return;
    }
    targets.forEach((target) => {
      if (_.is(target, EventTarget)) {
        const handler = $.on(options.event, () => {
          _saveEventMessage(options);
          if (!_.has(options, 'once') || options.once) {
            $.off(options.event, handler, target, true);
          }
        }, {}, target, true);
      }
    });
  } else {
    _saveEventMessage(options);
  }
};

exports.preconditions = function (options) {
  if (_.isEmpty(options)) {
    throw new BaseError('Collector: options must be a non-empty object.');
  }
  if (!_.isString(options.event) || !options.event) {
    throw new BaseError('Collector: event must be a non-empty string.');
  }
  if (!_.isNil(options.state) && !_.isString(options.state) && !_.isNumber(options.state)) {
    throw new BaseError('Collector: state must be nil, a string or a number.');
  }
  if (_.isNil(options.listen) || options.listen) {
    if (!_.isNil(options.selector) && !_.isString(options.selector)) {
      throw new BaseError('Collector: selector must be a non-empty string when listen = true.');
    }
  }
};

/**
 * @param {Object} options - similar to {@link #collect}
 * @return {Object} that we want to attach to the event, upon saving.
 * @private
 */
function _saveEventMessage(options) {
  let emitted = {};

  if (_.isEmpty(options)) {
    Logger.log(Level.WARNING, 'Collector: created an empty subject.');
    return emitted;
  }
  if (options.experiment && !_.isNil(options.experiment.id)) {
    emitted.experimentId = options.experiment.id;
  }
  if (options.experimentGroup && !_.isNil(options.experimentGroup.id)) {
    emitted.experimentGroupId = options.experimentGroup.id;
  }
  if (options.selector) {
    emitted.selector = options.selector;
  }
  if (options.event) {
    emitted.event = options.event;
  } else {
    Logger.log(Level.WARNING, 'Collector: missing an event.');
  }
  emitted.backendUrl = Const.BACKEND_URL.EVENT;
  Storage.save(emitted);
  // If state is mentioned, then the session should be updated.
  if (!_.isNil(options.state)) {
    emitted = {
      backendUrl: Const.BACKEND_URL.UPDATE,
      state     : options.state
    };
    Storage.save(emitted);
  }
}
