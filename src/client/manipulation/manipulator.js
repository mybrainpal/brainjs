/**
 * Proudly created by ohad on 03/12/2016.
 */
/**
 * Manipulates the DOM to fill our customers pockets with them dollars.
 * @param {Object} options
 * @constructor
 */
function Manipulator(options) {
    this.options(options);
}

/**
 * @param options
 *  @property {string} storage
 */
Manipulator.prototype.options = function (options) {
    if (options.hasOwnProperty('storage')) {
        this.storage = window.BrainPal.storage.create(options.storage);
    } else {
        window.BrainPal.errorLogger.log('Collector: missing storage.');
    }
};

/**
 * Manipulates elements with action and then logs relevant data on subject.
 * @param {Experiment} experiment
 * @param {Object} [options]
 *  @property {Array} anchors - for event logging
 */
Manipulator.prototype.experiment = function (experiment, options) {
    if (experiment.client.included) {
        this.storage.save('experiment:id-' + experiment.id +
                          (experiment.hasOwnProperty('name') ? ',name-' + experiment.name : ''));
        for (var group in experiment.client.groups) {
            this.storage.save('experiment:id-' + experiment.id + ',group:name-' + group.name);
            group.executor.execute(options.hasOwnProperty('executor') ?
                                   options && options.executor : {});
            if (options && options.hasOwnProperty('anchors')) {
                for (var i = 0; i < options.anchors.length; i++) {
                    window.BrainPal.collector.collect(
                        options.anchors[i],
                        'anchor:experiment:id-' + experiment.id + ',group:name-' + group.name);
                }
            }
        }
    }
};