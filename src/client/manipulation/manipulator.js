/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Manipulates the DOM to fill our customers pockets with 'em dollars.
 */
let _         = require('./../common/util/wrapper'),
    Collector = require('./../collection/collector'),
    Executor  = require('./execute/master');

/**
 * Runs an experiment, or A/B test, in order to find out an improved versions of the customer's
 * web page.
 * @param {Experiment} experiment - describes way to manipulate the dom per various group of users.
 * @param {Object} [options]
 *  @property {Object|Object[]} [subjectOptions] - options for {@link Collector#collect}
 */
exports.experiment = function (experiment, options) {
    let subjectOptions;
    options = options || {};
    if (options.subjectOptions && _.isArray(options.subjectOptions)) {
        _.forEach(options.subjectOptions, function (item) {
            exports.experiment(experiment, {subjectOptions: item});
        });
        return;
    }
    subjectOptions = options.subjectOptions || {};
    subjectOptions = _.merge({experiment: experiment}, subjectOptions);
    if (subjectOptions.anchor) {
        Collector.collect(subjectOptions);
    }
    Collector.collect(_.omit(_.clone(subjectOptions), 'anchor'));
    _.forEach(experiment.clientGroups, function (group) {
        let groupSubjectOptions = _.merge({experimentGroup: group}, subjectOptions);
        if (groupSubjectOptions.anchor) {
            Collector.collect(groupSubjectOptions);
        }
        Collector.collect(_.omit(_.clone(groupSubjectOptions), 'anchor'));
        _.forEach(group.executors, function (executor) {
            Executor.execute(executor.name, executor.selectors, {
                options: executor.options
            });
        });
    });
};
