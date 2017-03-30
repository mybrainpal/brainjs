/**
 * Proudly created by ohad on 27/01/2017.
 */
const _         = require('../util/wrapper'),
      $         = require('../util/dom'),
      Logger    = require('../log/logger'),
      Level     = require('../log/logger').Level,
      BaseError = require('../log/base.error'),
      Factory   = require('./factory');

class VisibilityEvent {
  /**
   * @returns {string} name of event.
   */
  static name() {return 'visibility'};

  /**
   * @param {Object} options
   *  @property {Element|string} target - event target, must be an element.
   *  @property {number} [frequency = 100] - (in ms) to check whether the element is visible.
   *  @property {boolean} [stopOnVisible = true] - whether to fire only a single time, once the
   *  target is visible. Otherwise the event will fire every time the visibility of target is
   *  changed.
   *  @property {Object|string|number} [detailOrId] - for triggering.
   */
  constructor(options) {
    if (!_.isObject(options)) throw new BaseError('VisibilityEvent: options is invalid.');
    this.stopOnVisible = !_.has(options, 'stopOnVisible') || options.stopOnVisible;
    if (options.target) {
      if (_.isString(options.target)) {
        this.target = $(options.target);
        if (!this.target) {
          throw new BaseError('VisibilityEvent: could not find target at ' + options.target);
        }
      } else {
        this.target = options.target;
      }
      if (!(_.is(this.target, Element))) {
        throw new BaseError('VisibilityEvent: target must be an element');
      }
    } else {
      throw new BaseError('VisibilityEvent: target is missing.');
    }
    if (Number.isInteger(options.frequency)) {
      if (options.frequency > 0) {
        this.frequency = options.frequency;
      } else {
        throw new BaseError('VisibilityEvent: frequency must be positive.');
      }
    } else if (!_.isNil(options.frequency)) {
      throw new BaseError('VisibilityEvent: frequency must be an integer.');
    } else {
      this.frequency = 100;
    }
    if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
        _.isString(options.detailOrId)) {
      this.detailOrId = options.detailOrId;
    } else if (!_.isNil(options.detailOrId)) {
      throw new BaseError('VisibilityEvent: detailOrId is not an object, number or string.');
    }
    this._init();
  }

  /**
   * Initializes the interval.
   * @private
   */
  _init() {
    this.visible  = false;
    this.interval = _.interval.call(this, () => {
      if ($.isVisible(this.target) !== this.visible) this.fire();
    }, this.frequency);
  };

  /**
   * Fires the event, and stops the interval if necessary.
   */
  fire() {
    $.trigger(Factory.eventName(VisibilityEvent.name()), this.detailOrId, this.target);
    Logger.log(
      Level.INFO,
      `Visibility event ${this.detailOrId} fired for ${this.visible ? 'hidden' : 'shown'}`);
    if (this.stopOnVisible) {
      clearInterval(this.interval);
    } else {
      this.visible = !this.visible;
    }
    return this;
  }

  /**
   * Clears the interval.
   */
  stop() {
    if (this.interval) clearTimeout(this.interval);
    return this;
  }
}

/**
 * Exposing the VisibilityEvent constructor
 * @type {VisibilityEvent}
 */
module.exports = VisibilityEvent;
Factory.register(VisibilityEvent);