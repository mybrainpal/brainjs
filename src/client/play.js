/**
 * Proudly created by ohad on 25/01/2017.
 */
let Client      = require('./common/client'),
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
 *  @property {string} tracker - as identifier for our awesome customer.
 */
module.exports = function (configuration) {
  if (!Client.canRunBrainPal()) {
    Logger.log(Level.WARNING, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
    exports.shutDown(configuration);
    return;
  }
  Client.tracker = configuration.tracker;
  if (configuration.storage && configuration.storage.name) {
    Storage.set(configuration.storage.name, configuration.storage.options || {},
                () => {_run(configuration)});
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
  Client.init(() => {
    Logger.log(Level.INFO, 'BrainPal: game on!');
    if (configuration.hasOwnProperty('collect')) {
      for (let i = 0; i < configuration.collect.length; i++) {
        Collector.collect(configuration.collect[i]);
      }
    }
    if (configuration.hasOwnProperty('experiments')) {
      for (let i = 0; i < configuration.experiments.length; i++) {
        let experiment = new Experiment(configuration.experiments[i].experiment);
        if (experiment.included) {
          Manipulator.experiment(experiment, configuration.experiments[i].options);
        }
      }
    }
  });
}

/**
 * Shuts the entire BrainPal presence.
 * @param {Object} configuration
 */
exports.shutDown = function (configuration) {

};