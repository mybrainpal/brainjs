/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Manipulates the DOM to fill our customers pockets with 'em dollars.
 */
let _         = require('../common/util/wrapper'),
    BaseError = require('../common/log/base.error'),
    Collector = require('../collection/collector'),
    Executor  = require('./execute/master');

/**
 * Runs an experiment, or A/B test, in order to find out an improved versions of the customer's
 * web page.
 * @param {Experiment} experiment - describes way to manipulate the dom per various group of users.
 * @param {Object} [subject] - options for {@link Collector#collect}, should NOT contain
 * experiment or experiment group.
 */
exports.experiment = function (experiment, subject) {
  // Logs participation or lack thereof in the experiment.
  Collector.collect({experiment: experiment});
  if (!experiment.included) return;
  if (subject && (subject.experiment || subject.experimentGroup)) {
    throw new BaseError('Manipulator: subject cannot contain experiment or experiment group.');
  }
  if (!experiment.clientGroups.length && subject) {
    Collector.collect(_.extend({experiment: experiment}, subject));
  }
  for (let i = 0; i < experiment.clientGroups.length; i++) {
    // Logs participation in the group.
    Collector.collect({experimentGroup: experiment.clientGroups[i], experiment: experiment});
    if (subject) {
      Collector.collect(_.extend(
        {experiment: experiment, experimentGroup: experiment.clientGroups[i]}, subject));
    }
    for (let j = 0; j < experiment.clientGroups[i].executors.length; j++) {
      Executor.execute(experiment.clientGroups[i].executors[j].name,
                       experiment.clientGroups[i].executors[j].options);
    }
  }
};
