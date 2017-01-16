/**
 * Proudly created by ohad on 02/12/2016.
 */
let Client        = require('./common/client'),
    configuration = require('../customers/hotels.co.il/configuration'),
    Logger        = require('./common/log/logger'),
    Level         = require('./common/log/logger').Level,
    Storage       = require('./common/storage/storage'),
    Collector     = require('./collection/collector'),
    Manipulator   = require('./manipulation/manipulator'),
    Experiment    = require('./manipulation/experiment/experiment'),
    BPReadyEvent  = require('./common/events/brainpal-ready');

//noinspection JSUnusedLocalSymbols
window.BrainPal = (function (window, undefined) {
    let readyEvent, options;
    let brainPal = window.BrainPal || {};
    if (!Client.canRunBrainPal()) {
        Logger.log(Level.ERROR, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
        return;
    }

    /**
     * Plays the whole thing.
     * @param {Object} configuration
     *  @property {Object[]} [collect] - anchors and subjects to collect data about.
     *      @property {Object} [subjectOptions] - see {@link Collector#collect}
     *  @property {Object[]} [experiments] - experiments to execute.
     *      @property {Object} experiment
     *      @property {Object} options
     *          @property {Object[]} anchors
     *  @property {string} storage
     */
    function play(configuration) {
        let j;
        let i;
        Logger.log(Level.INFO, 'BrainPal: game on!');
        Client.init();
        if (configuration.hasOwnProperty('collect')) {
            for (i = 0; i < configuration.collect.length; i++) {
                Collector.collect(configuration.collect[i]);
            }
        }
        if (configuration.hasOwnProperty('experiments')) {
            for (j = 0; j < configuration.experiments.length; j++) {
                Manipulator.experiment(
                    new Experiment(configuration.experiments[j].experiment),
                    configuration.experiments[j].options);
            }
        }
    }

    if (configuration.hasOwnProperty('storage')) {
        if (configuration.storage.hasOwnProperty('name')) {
            options = {};
            if (configuration.storage.hasOwnProperty('options')) {
                options = configuration.storage.options;
            }
            Storage.set(configuration.storage.name, options);
        }
    } else {
        Logger.log(Level.WARNING, 'configuration: missing storage.');
        return;
    }
    readyEvent = new BPReadyEvent();
    // Let the games begin.
    window.addEventListener(readyEvent.eventName, function () { play(configuration); });

    return brainPal;
})(window);
