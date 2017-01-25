/**
 * Proudly created by ohad on 24/12/2016.
 */
let _         = require('./../../../common/util/wrapper'),
    Logger    = require('../../../common/log/logger'),
    Level     = require('../../../common/log/logger').Level,
    BaseError = require('../../../common/log/base.error'),
    Master    = require('../master');
exports.name  = 'inject';
Master.register(exports);
/**
 * Injects HTML content into target elements.
 * @param {Object} options
 *  @property {string} target
 *  @property {string} [position] - where to inject the html. If none given, replaces the html
 *  with the target inner html.
 *  @property {string} [html] - to inject.
 *  @property {string} [sourceSelector] - selector to source element, from which to copy html.
 */
exports.execute = function (options) {
  const target  = document.querySelector(options.target);
  let src, html = '';
  if (options.sourceSelector) {
    src  = document.querySelector(options.sourceSelector);
    html = src.innerHTML;
  } else if (options.html) html = options.html;

  if (options.position) {
    target.insertAdjacentHTML(options.position, html);
  } else {
    target.innerHTML = html;
  }
  if (options.toLog) {
    Logger.log(Level.INFO, 'Injected html to ' + options.target);
  }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  if (!document.querySelector(options.target)) {
    throw new BaseError('InjectExecutor : could not find target at ' + options.target);
  }
  if (_.has(options, 'position') && !_.isString(options.position)) {
    throw new BaseError('InjectExecutor : position must be nil or a string');
  }
  if (_.has(options, 'html') && !_.isString(options.html)) {
    throw new BaseError('InjectExecutor : html must be nil or a string');
  }
  if (_.has(options, 'sourceSelector')) {
    if (!_.isString(options.sourceSelector)) {
      throw new BaseError('InjectExecutor : sourceSelector must be nil or a string');
    }
    if (!document.querySelector(options.sourceSelector)) {
      throw new BaseError('InjectExecutor : could not find sourceSelector at ' +
                          options.sourceSelector);
    }
    if (_.has(options, 'html')) {
      throw new BaseError('InjectExecutor : cannot have both html and sourceSelector');
    }
  }
};