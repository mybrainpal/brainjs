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
  let subjectOptions, i;
  options = options || {};
  if (options.subjectOptions && Array.isArray(options.subjectOptions)) {
    for (i = 0; i < options.subjectOptions.length; i++) {
      exports.experiment(experiment, {subjectOptions: options.subjectOptions[i]});
    }
    return;
  }
  subjectOptions = options.subjectOptions || {};
  subjectOptions = _.deepExtend({experiment: experiment}, subjectOptions);
  if (subjectOptions.anchor) {
    Collector.collect(subjectOptions);
  }
  let noAnchor = _.deepExtend({}, subjectOptions);
  delete noAnchor.anchor;
  Collector.collect(noAnchor);
  for (i = 0; i < experiment.clientGroups.length; i++) {
    let groupSubjectOptions = _.deepExtend({experimentGroup: experiment.clientGroups[i]},
                                           subjectOptions);
    if (groupSubjectOptions.anchor) {
      Collector.collect(groupSubjectOptions);
    }
    noAnchor = _.deepExtend({}, groupSubjectOptions);
    delete noAnchor.anchor;
    Collector.collect(noAnchor);
    for (let j = 0; j < experiment.clientGroups[i].executors.length; j++) {
      Executor.execute(experiment.clientGroups[i].executors[j].name,
                       experiment.clientGroups[i].executors[j].options);
    }
  }
};
