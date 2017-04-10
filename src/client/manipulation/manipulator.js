/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Manipulates the DOM to fill our customers pockets with 'em dollars.
 */
let _         = require('../common/util/wrapper'),
    Collector = require('../collection/collector'),
    Executor  = require('./execute/master'),
    Const     = require('../../common/const');

/**
 * Runs an experiment, or A/B test, in order to find out an improved versions of the customer's
 * web page.
 * @param {Experiment} experiment - describes way to manipulate the dom per various group of users.
 * experiment or experiment group.
 */
exports.manipulate = function (experiment) {
  if (!experiment || !experiment.included) return;
  // Logs participation or lack thereof in the experiment.
  Collector.collect({event: Const.EVENTS.PARTICIPATE, listen: false, experiment: experiment});

  if (!experiment.clientGroups.length && experiment.collect) {
    experiment.collect.forEach((col) => {
      Collector.collect(_.extend({experiment: experiment}, col));
    });
  }
  experiment.clientGroups.forEach((group) => {
    // Logs participation in the group.
    Collector.collect({
                        event          : Const.EVENTS.PARTICIPATE, listen: false,
                        experimentGroup: group, experiment: experiment
                      });
    experiment.collect.forEach((col) => {
      Collector.collect(_.extend(
        {experiment: experiment, experimentGroup: group}, col));
    });
    group.executors.forEach((executor) => {
      Executor.execute(executor.name, executor.options);
    });
  });
};
