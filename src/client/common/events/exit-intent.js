/**
 * Proudly created by ohad on 12/03/2017.
 */
const _         = require('../util/wrapper'),
      Logger    = require('../log/logger'),
      Level     = require('../log/logger').Level,
      BaseError = require('../log/base.error'),
      Factory   = require('./factory');

/**
 * Event that fires when the users intents to leave the page. Currently we employ two triggers:
 * 1) a scroll up.
 * 2) leave the page with your mouse.
 */
class ExitIntentEvent {
  /**
   * @returns {string} name of event.
   */
  static name() {return 'exit-intent'};

  /**
   * @param {Object} [options]
   *  @property {number} [waitTime = 5000] - (in ms) to wait before an exit intent can be triggered.
   *  @property {boolean} [fireOnce = true] - whether to fire only once.
   *  @property {Object|string|number} [detailOrId] - for triggering.
   */
  constructor(options) {
    if (!_.isObject(options)) throw new BaseError('ExitIntentEvent: options is invalid.');
    if (Number.isInteger(options.waitTime)) {
      if (options.waitTime > 0) {
        this.waitTime = options.waitTime;
      } else {
        throw new BaseError('ExitIntentEvent: waitTime must be positive.');
      }
    } else if (!_.isNil(options.waitTime)) {
      throw new BaseError('ExitIntentEvent: waitTime must be an integer.');
    } else {
      this.waitTime = 60000;
    }
    this.fireOnce = !_.has(options, 'fireOnce') || options.fireOnce;
    if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
        _.isString(options.detailOrId)) {
      this.detailOrId = options.detailOrId;
    } else if (!_.isNil(options.detailOrId)) {
      throw new BaseError('ExitIntentEvent: detailOrId is not an object, number or string.');
    }
    this._init();
  }

  /**
   * Initializes the event.
   * @private
   */
  _init() {
    this.timer = setTimeout(() => {this.start()}, this.waitTime);
  };

  /**
   * Starts the idle timer.
   */
  start() {
    const that              = this; // To use `this` in the setTimeout handler.
    this.handler            = {};
    this.handler.mouseleave = _.on('mouseleave', (e) => {
      if (e.clientY <= 0) {
        that.trigger();
      }
    }, this.detailOrId, document, true);
    this.lastY              = window.scrollY;
    this.ticking            = false;
    this.handler.scroll     = _.on('scroll', () => {
      if (that.lastY > window.scrollY) {
        if (!that.ticking) {
          window.requestAnimationFrame(function () {
            that.ticking = false;
            that.trigger();
          });
        }
        that.ticking = true;
      } else {
        that.ticking = false;
      }
      that.lastY = window.scrollY;
    }, this.detailOrId, document, true);
    return this;
  };

  /**
   * Triggers the event.
   */
  trigger() {
    _.trigger(Factory.eventName(ExitIntentEvent.name()), this.detailOrId);
    Logger.log(Level.INFO, `${Factory.eventName(ExitIntentEvent.name())} triggered${_.isNil(
      this.detailOrId) ? '' : ' for ' + this.detailOrId}.`);
    if (!_.has(this, 'fireOnce') || this.fireOnce) this.stop();
    return this;
  }

  /**
   * Clears the timer.
   */
  stop() {
    if (this.timer) clearTimeout(this.timer);
    for (let ev in this.handler) {
      _.off(ev, this.handler[ev], document, true);
    }
    return this;
  }
}

/**
 * Exposing the ExitIntentEvent constructor
 * @type {ExitIntentEvent}
 */
module.exports = ExitIntentEvent;
Factory.register(ExitIntentEvent);