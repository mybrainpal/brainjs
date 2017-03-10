/**
 * Proudly created by ohad on 10/03/2017.
 */
const _         = require('../../../common/util/wrapper'),
      Logger    = require('../../../common/log/logger'),
      Level     = require('../../../common/log/logger').Level,
      BaseError = require('../../../common/log/base.error.js'),
      Master    = require('../master');
exports.name    = 'animate';
Master.register(exports);

/**
 * Manipulates form elements, for the good of society.
 * @param {Object} options
 *  @property {string} target - css selector
 *  @property {string} animationName - name of animation, as found in
 *  https://daneden.github.io/animate.css/
 */
exports.execute = function (options) {
  const target = document.querySelector(options.target);
  require.ensure('animate.css', function (require) {
    if (!_loaded) _.css.load(require('animate.css'));
    target.classList.add(options.animationName, 'animated');
    setTimeout(() => {
      if (getComputedStyle(target).animationName !== options.animationName) {
        Logger.log(Level.WARNING, `AnimateInterface: ${options.target} wasn't animated.`);
      } else if (options.toLog) {
        Logger.log(Level.WARNING, `AnimateInterface: ${options.target} was animated, woo-hoo!`);
      }
    }, 10);
    _.on('animationend', () => {
      target.classList.remove(options.animationName, 'animated');
    }, options.id, target);
  })
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  if (!document.querySelector(options.target)) {
    throw new BaseError('AnimateInterface: could not find target at ' + options.target);
  }
  if (!_.isString(options.animationName)) {
    throw new BaseError('AnimateInterface: animationName must be a string.');
  }
};

/**
 * Indicates whether animate.css was loaded.
 * @type {boolean}
 * @private
 */
let _loaded = false;