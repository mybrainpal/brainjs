/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Manipulates the DOM to fill our customers pockets with 'em dollars.
 */
var _         = require('./../common/util/wrapper'),
    Logger    = require('./../common/log/logger'),
    Level     = require('./../common/log/logger').Level,
    Collector = require('./../collection/collector'),
    Executor  = require('./execute/executor');

/**
 * Runs an experiment, or A/B test, in order to find out an improved versions of the customer's
 * web page.
 * @param {Experiment} experiment - describes way to manipulate the dom per various group of users.
 * @param {Object} [options]
 *  @property {Object[]} [anchors] - a container for event and collection of elements
 *      @property {string} selector - of collection of elements to listen for event.
 *      @property {string} event - to listen
 *  @property {Object} [subjectOptions] - additional options to pass to {@link Collector#collect}
 */
exports.experiment = function (experiment, options) {
    var subjectOptions;
    options        = options || {};
    subjectOptions = _.merge({experiment: experiment}, options.subjectOptions);
    _.forEach(options.anchors, function (anchor) {
        Collector.collect(_.merge({anchor: anchor}, subjectOptions));
    });
    Collector.collect(subjectOptions);
    _.forEach(experiment.clientGroups, function (group) {
        var groupSubjectOptions = _.merge({experimentGroup: group}, subjectOptions);
        Collector.collect(groupSubjectOptions);
        _.forEach(group.executors, function (executor) {
            Executor.execute(executor.name, executor.selector, {
                specs          : executor.specs
            });
        });
    });
};
