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
 *  @property {Object[]} [collect] - anchors and subjects to collect data about.
 *  @property {Object[]} [experiments] - experiments to execute.
 *      @property {Object} experiment
 *      @property {Object} options
 *  @property {string} storage
 */
module.exports = function (configuration) {
  if (!Client.canRunBrainPal()) {
    Logger.log(Level.ERROR, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
    exports.shutDown(configuration);
    return;
  }
  let i;
  Logger.log(Level.INFO, 'BrainPal: game on!');
  if (configuration.storage && configuration.storage.name) {
    Storage.set(configuration.storage.name, configuration.storage.options || {});
  } else {
    Logger.log(Level.WARNING, 'configuration: missing storage.');
  }
  if (configuration.hasOwnProperty('collect')) {
    for (let i = 0; i < configuration.collect.length; i++) {
      Collector.collect(configuration.collect[i]);
    }
  }
  if (configuration.hasOwnProperty('experiments')) {
    for (i = 0; i < configuration.experiments.length; i++) {
      Manipulator.experiment(
        new Experiment(configuration.experiments[i].experiment),
        configuration.experiments[i].options);
    }
  }
};

/**
 * Shuts the entire BrainPal presence.
 * @param {Object} configuration
 */
exports.shutDown = function (configuration) {

};