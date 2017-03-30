/**
 * Proudly created by ohad on 29/12/2016.
 *
 * An event that's fired after the user had been idle.
 */
const _         = require('../util/wrapper'),
      $         = require('../util/dom'),
      Logger    = require('../log/logger'),
      Level     = require('../log/logger').Level,
      BaseError = require('../log/base.error'),
      Factory   = require('./factory');

class IdleEvent {
  /**
   * @returns {string} name of event.
   */
  static name() {return 'idle'};

  /**
   * @param {Object} [options]
   *  @property {number} [waitTime = 60000] - (in ms) to wait until idle event is dispatched.
   *  @property {boolean} [fireOnce = true] - whether to fire the idle event every waitTime ms,
   *     or just once.
   *  @property {EventTarget|string} [target = document] - event target.
   *  @property {Object|string|number} [detailOrId] - for triggering.
   */
  constructor(options) {
    if (!_.isObject(options)) throw new BaseError('IdleEvent: options is invalid.');
    if (Number.isInteger(options.waitTime)) {
      if (options.waitTime > 0) {
        this.waitTime = options.waitTime;
      } else {
        throw new BaseError('IdleEvent: waitTime must be positive.');
      }
    } else if (!_.isNil(options.waitTime)) {
      throw new BaseError('IdleEvent: waitTime must be an integer.');
    } else {
      this.waitTime = 60000;
    }
    this.fireOnce = !_.has(options, 'fireOnce') || options.fireOnce;
    if (options.target) {
      this.target = _.isString(options.target) ? $(options.target) :
                    options.target;
      if (!(_.is(this.target, EventTarget))) {
        throw new BaseError('IdleEvent: could not find target at ' + options.target);
      }
    } else {
      this.target = document;
    }
    if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
        _.isString(options.detailOrId)) {
      this.detailOrId = options.detailOrId;
    } else if (!_.isNil(options.detailOrId)) {
      throw new BaseError('IdleEvent: detailOrId is not an object, number or string.');
    }
    this._init();
  }

  /**
   * Initializes the idle timer.
   * @private
   */
  _init() {
    this.start();
    for (let i = 0; i < _activeEvents.length; i++) {
      // useCapture is used so that every event will trigger reset.
      $.on.call(this, _activeEvents[i], () => {this.reset()}, {}, this.target, true);
    }
  };

  /**
   * Resets the idle timer.
   */
  reset() {
    this.stop();
    this.start();
    return this;
  };

  /**
   * Starts the idle timer.
   */
  start() {
    this.timer = _.delay.call(this, () => {
      $.trigger(Factory.eventName(IdleEvent.name()), this.detailOrId, this.target);
      Logger.log(Level.INFO, `${Factory.eventName(IdleEvent.name())} triggered${_.isNil(
        this.detailOrId) ? '' : ' for ' + this.detailOrId}.`);
      if (_.has(this, 'fireOnce') && !this.fireOnce) this.reset();
    }, this.waitTime);
    return this;
  };

  /**
   * Clears the timer.
   */
  stop() {
    if (this.timer) clearTimeout(this.timer);
    return this;
  }
}

/**
 * Events that should reset the idle timer.
 * @type {string[]}
 * @private
 */
const _activeEvents = ['mousemove', 'mousedown', 'click', 'touchstart', 'scroll', 'keypress'];

/**
 * Exposing the IdleEvent constructor
 * @type {IdleEvent}
 */
module.exports = IdleEvent;
Factory.register(IdleEvent);