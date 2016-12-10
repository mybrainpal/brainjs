/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Manipulates the DOM to fill our customers pockets with them dollars.
 */
var Logger = require('../common/log/logger'),
    Level = require('../common/log/logger').Level,
    Collector = require('../collection/collector'),
    Executor = require('./execute/executor');

/**
 * Runs an experiment.
 * @param {Experiment} experiment
 * @param {Object} [options]
 *  @property {Array} [anchors] - for event logging
 */
module.exports.experiment = function (experiment, options) {
    var group;
    var i, j;
    Collector.collect(_createSubject(experiment));
    if (experiment.isClientIncluded) {
        for (i = 0; i < experiment.clientGroups.length; i++) {
            group = experiment.clientGroups[i];
            Collector.collect(_createSubject(experiment, group));
            for (j = 0; j < group.executors.length; j++) {
                //noinspection JSUnresolvedVariable
                Executor.execute(group.executors[j].name || '',
                                 group.executors[j].descriptions || [],
                                 group.executors[j].specs || {});
            }
        }
    }
    if (options) {
        if (options.hasOwnProperty('anchors')) {
            for (j = 0; j < options.anchors.length; j++) {
                Collector.collect(_createSubject(experiment), options.anchors[j]);
            }
        }
    }
};

/**
 * @param {Experiment} experiment
 * @param {ExperimentGroup} [group]
 * @returns {Object} of option content, while truncating some of its properties.
 * @private
 */
function _createSubject(experiment, group) {
    var subject = {};
    subject.experiment = {};
    if (experiment.hasOwnProperty('id')) {
        subject.experiment.id = experiment.id;
    }
    if (experiment.hasOwnProperty('name')) {
        subject.experiment.name = experiment.name;
    }
    subject.experiment.participates = experiment.isClientIncluded;
    if (group) {
        subject.experiment.group = {};
        if (group.hasOwnProperty('label')) {
            subject.experiment.group.label = group.label;
        }
    }
    return subject;
}
