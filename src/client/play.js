/**
 * Proudly created by ohad on 25/01/2017.
 */
let _           = require('./common/util/wrapper'),
    $           = require('./common/util/dom'),
    Client      = require('./common/client'),
    BaseError   = require('./common/log/base.error'),
    Logger      = require('./common/log/logger'),
    Level       = require('./common/log/logger').Level,
    Storage     = require('./common/storage/storage'),
    Collector   = require('./collection/collector'),
    Manipulator = require('./manipulation/manipulator'),
    Experiment  = require('./manipulation/experiment/experiment');

/**
 * Plays the whole thing.
 * @param {Object} configuration
 *  @property {Object[]} [collect] - subjects to collect data about.
 *  @property {Object[]} [experiments] - experiments to execute.
 *      @property {Object} experiment
 *      @property {Object} options
 *  @property {Object} storage - the preferred method of storing data in our backend.
 *  @property {string|number} trackerId - as identifier for our awesome customer.
 */
module.exports = function (configuration) {
  if (!Client.canRunBrainPal()) {
    Logger.log(Level.WARNING, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
    exports.shutDown();
    return;
  }
  if (_.isNil(configuration)) {
    throw new BaseError('Play: missing configuration.');
  }
  if (!_.isObject(configuration)) {
    throw new BaseError('Play: configuration must be an object.');
  }
  if (!_.isAlphaNum(configuration.trackerId)) {
    throw new BaseError('Play: missing trackerId.');
  }
  Client.trackerId   = configuration.trackerId;
  Client.experiments = _.arrify(configuration.experiments).map((experimentOptions) => {
    return new Experiment(experimentOptions);
  });
  if (configuration.storage && configuration.storage.name) {
    Storage.set(configuration.storage.name, configuration.storage.options);
    _run(configuration);
  } else {
    Logger.log(Level.WARNING, 'configuration: missing storage.');
    _run(configuration)
  }
};

/**
 * Runs the entire thing.
 * @param {Object} configuration
 * @private
 */
function _run(configuration) {
  Client.init();
  Logger.log(Level.INFO, 'BrainPal: game on!');
  _.arrify(configuration.collect).forEach((subject) => {
    Collector.collect(subject);
  });
  Client.experiments.forEach((experiment) => {
    Manipulator.manipulate(experiment);
  });
}

/**
 * Clean all BrainPal presence on the webpage.
 */
exports.shutDown = function () {
  // Clean all injected styles.
  $.all('style[' + $.identifyingAttribute + ']')
   .forEach(function (styleElement) {
     styleElement.parentNode.removeChild(styleElement);
   });
};