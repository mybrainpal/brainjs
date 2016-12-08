/**
 * Proudly created by ohad on 02/12/2016.
 */
var Client = require('./common/client'),
    Logger = require('./common/log/logger'),
    Level = require('./common/log/logger').Level,
    Anchor = require('./common/anchor'),
    Collector = require('./collection/collector'),
    Manipulator = require('./manipulation/manipulator'),
    Experiment = require('./manipulation/experiment/experiment'),
    BPReadyEvent = require('./common/events/brainpal-ready');

//noinspection JSUnusedLocalSymbols
window.BrainPal = (function (window, undefined) {
    var readyEvent;
    var customerConfiguration;
    var brainPal = window.BrainPal || {};
    if (!Client.canRunBrainPal()) {
        Logger.log(Level.ERROR, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
        return;
    }

    /**
     * Plays the whole thing.
     * @param {Object} customerConfiguration
     *  @property {Object[]} [collect] - anchors and subjects to collect data about.
     *      @property {Object} anchor
     *      @property {Object} [subject]
     *  @property {Object[]} [experiments] - experiments to execute.
     *      @property {Object} experiment
     *      @property {Object} options
     *          @property {Object[]} anchors
     *  @property {string} storage
     */
    function play(customerConfiguration) {
        var anchors;
        var j;
        var i;
        Logger.log(Level.INFO, 'BrainPal: game on!');
        Client.init();
        if (customerConfiguration.hasOwnProperty('storage')) {
            Collector.options({storage: customerConfiguration.storage});
        } else {
            Logger.log(Level.WARNING, 'customerConfiguration: missing storage.');
            return;
        }
        if (customerConfiguration.hasOwnProperty('collect')) {
            for (i = 0; i < customerConfiguration.collect.length; i++) {
                Collector.collect(customerConfiguration.collect[i].subject,
                                  new Anchor(customerConfiguration.collect[i].anchor));
            }
        }
        if (customerConfiguration.hasOwnProperty('experiments')) {
            for (j = 0; j < customerConfiguration.experiments.length; j++) {
                if (customerConfiguration.experiments[j].options &&
                    customerConfiguration.experiments[j].options.hasOwnProperty('anchors')) {
                    anchors = customerConfiguration.experiments[j].options.anchors.map(
                        function (anchor) {
                            return new Anchor(anchor);
                        }
                    );
                }
                Manipulator.experiment(
                    new Experiment(customerConfiguration.experiments[j].experiment),
                    {anchors: anchors});
            }
        }
    }

    customerConfiguration = {};

    if (customerConfiguration.hasOwnProperty('storage')) {
        Logger.options({storage: customerConfiguration.storage});
    }
    readyEvent = new BPReadyEvent();
    // Let the games begin.
    window.addEventListener(readyEvent.eventName, function () { play(customerConfiguration); });

    return brainPal;
})(window);
