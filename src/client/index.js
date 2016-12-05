/**
 * Proudly created by ohad on 02/12/2016.
 */
window.BrainPal = (function (window, undefined) {
    var BrainPal = {};

    BrainPal.errorLogger = new ErrorLogger();
    BrainPal.storage = new Storage();
    BrainPal.client = new Client();
    BrainPal.collector = new Collector({storage: 'local'});
    BrainPal.manipulator = new Manipulator({storage: 'local'});

    /**
     * Bootstraps the whole thing.
     * @param {Object} customerConfiguration
     *  @property {Array} collect - anchors and subjects to collect data about.
     *      @property {Object} anchor
     *      @property {Object} subject
     *  @property {Array} experiments - experiments to execute.
     *      @property {Object} experiment
     *      @property {Object} options
     */
    function initialize(customerConfiguration) {
        if (customerConfiguration.hasOwnProperty('collect')) {
            for (var i = 0; i < customerConfiguration.collect.length; i++) {
                BrainPal.collector.collect(customerConfiguration.collect[i].anchor,
                                           customerConfiguration.collect[i].subject);
            }
        }
        if (customerConfiguration.hasOwnProperty('experiments')) {
            for (var j = 0; j < customerConfiguration.experiments.length; j++) {
                var obj = customerConfiguration.experiments[j];
                BrainPal.manipulator.experiment(obj.experiment,
                                                obj.hasOwnProperty('options') ? obj.options : {});
            }
        }
    }
    initialize({});

    return BrainPal;
})(window);