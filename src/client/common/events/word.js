/**
 * Proudly created by ohad on 07/01/2017.
 *
 * An event that's fired once the user had typed a word.
 * The following will make the event fire:
 * 1) A space was typed.
 * 2) The input is idle for 2 seconds.
 */
const _         = require('../util/wrapper'),
      $         = require('../util/dom'),
      BaseError = require('../log/base.error'),
      Logger    = require('../log/logger'),
      Level     = require('../log/logger').Level,
      IdleEvent = require('./idle'),
      Factory   = require('./factory');

class WordEvent {
  /**
   * @returns {string} name of event.
   */
  static name() {return 'word'};

  /**
   * @returns {string} a class name that is added to the target whenever it matches the regex.
   */
  static matchesRegex() { return 'brainpal-match'}

  /**
   * @returns {string} a class name that is added to the target whenever it mismatches the regex.
   */
  static mismatchesRegex() { return 'brainpal-mismatch'}

  /**
   * @param {Object} options
   *  @property {Element|string} target - event target, can be a css selector.
   *  @property {number} [waitTime = 2000] - (in ms) to wait until firing the event if the
   *  input field is idle.
   *  @property {RegExp} [regex = /^[^\s]+\s$/] - a regular expression that should match
   *  target.value.
   *  @property {boolean} [fireOnRegex = false] - whether to fire once target.value matches regex.
   *  @property {boolean} [enforceRegex = false] - whether to fire only when target.value matches
   *  regex.
   *  @property {boolean} [fireOnEmpty = false] - whether to fire on empty input.
   *  @property {boolean} [fireOnEnter = true] - whether to fire once the enter key is pressed.
   *  @property {boolean} [fireOnce = true]
   *  @property {Object|string|number} [detailOrId] - for triggering.
   */
  constructor(options) {
    if (!_.isObject(options)) throw new BaseError('WordEvent: options is invalid.');
    if (Number.isInteger(options.waitTime)) {
      if (options.waitTime > 0) {
        this.waitTime = options.waitTime;
      } else {
        throw new BaseError('WordEvent: waitTime must be positive.');
      }
    } else if (!_.isNil(options.waitTime)) {
      throw new BaseError('WordEvent: waitTime must be an integer.');
    } else {
      this.waitTime = 2000;
    }
    this.fireOnRegex  = _.has(options, 'fireOnRegex') && options.fireOnRegex;
    this.enforceRegex = _.has(options, 'enforceRegex') && options.enforceRegex;
    this.fireOnEmpty  = _.has(options, 'fireOnEmpty') && options.fireOnEmpty;
    this.fireOnEnter  = !_.has(options, 'fireOnEnter') || options.fireOnEnter;
    this.fireOnce     = !_.has(options, 'fireOnce') || options.fireOnce;
    if (_.is(options.regex, RegExp)) {
      this.regex = options.regex;
    } else if (_.isNil(options.regex)) {
      this.regex = /^[^\s]+\s$/;
    } else {
      throw new BaseError('WordEvent: regex must be a RegExp.');
    }
    if (this.enforceRegex && _.isNil(this.regex)) {
      throw new BaseError('WordEvent: regex must exist when enforceRegex is true.');
    }
    if (options.target) {
      this.target = _.isString(options.target) ? document.querySelector(options.target) :
                    options.target;
      if (!(_.is(this.target, EventTarget))) {
        throw new BaseError('WordEvent: could not find target at ' + options.target);
      }
    } else {
      throw new BaseError('WordEvent: target is missing.');
    }
    if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
        _.isString(options.detailOrId)) {
      this.detailOrId = options.detailOrId;
    } else if (!_.isNil(options.detailOrId)) {
      throw new BaseError('WordEvent: detailOrId is not an object.');
    }
    this._init();
  }

  /**
   * Initializes the event.
   * @private
   */
  _init() {
    this.actualInputHandler = $.on.call(this, 'input', () => {this.inputHandler()}, {},
                                        this.target);
    this.actualKeyupHandler =
      $.on.call(this, 'keyup', (event) => {this.keyupHandler(event)}, {}, this.target);
    this._updateClass();
  };

  /**
   * Updates the target classes, according to the regex.
   * @param {string} [enforcedClass] - if provided, it will be assigned regardless of the regex.
   * @private
   */
  _updateClass(enforcedClass) {
    this.target.classList.remove(WordEvent.matchesRegex(), WordEvent.mismatchesRegex());
    if (enforcedClass) {
      this.target.classList.add(enforcedClass);
      return;
    }
    if (this.regex) {
      this.target.classList.add(
        this.regex.test(this.target.value) ? WordEvent.matchesRegex() :
        WordEvent.mismatchesRegex());
      this.target.classList.add(
        this.regex.test(this.target.value) ? WordEvent.matchesRegex() :
        WordEvent.mismatchesRegex());
    }
  }

  /**
   * Stops this word event.
   */
  stop() {
    if (this.idleEvent) this.idleEvent.stop();
    $.off('input', this.actualInputHandler, this.target);
    $.off('keyup', this.actualKeyupHandler, this.target);
    this.fired = false;
  }

  /**
   * Handles inputs.
   */
  inputHandler() {
    this._updateClass();
    if (this.regex && this.fireOnRegex && this.regex.test(this.target.value)) {
      if (this.fireIfShould()) return;
    }
    if (this.idleEvent) {
      this.idleEvent.reset();
    } else {
      $.on.call(this, Factory.eventName(IdleEvent.name()), () => {this.fireIfShould()},
                this.detailOrId,
                this.target);
      this.idleEvent = new IdleEvent({
        waitTime: this.waitTime, target: this.target, detailOrId: this.detailOrId
      });
    }
  }

  /**
   * Handles key presses.
   * @param {KeyboardEvent} event
   */
  keyupHandler(event) {
    this._updateClass();
    if (!this.fireOnEnter) return;
    if (_.isNil(event.key)) return;
    if (_fireKeyCodes.indexOf(event.key) !== -1) this.fireIfShould();
  }

  /**
   * Fires event if all conditions are met.
   * @returns {boolean} whether the event was fired
   */
  fireIfShould() {
    if (/^\s*$/.test(this.target.value) && !this.fireOnEmpty) return false;
    if (this.fired && this.fireOnce) return false;
    if (this.enforceRegex && this.regex && !this.regex.test(this.target.value)) return false;
    this._updateClass(WordEvent.matchesRegex());
    if (this.idleEvent) this.idleEvent.stop();
    this.fired = true;
    $.trigger(Factory.eventName(WordEvent.name()), this.detailOrId, this.target);
    Logger.log(Level.INFO, `${Factory.eventName(WordEvent.name())} triggered${_.isNil(
      this.detailOrId) ? '' : ' for ' + this.detailOrId}.`);
    return true;
  }
}

/**
 * Key codes to fire on, whenever fireOnEnter is enabled.
 * @type {[string]}
 * @private
 */
const _fireKeyCodes = ['Enter', 'Escape', 'ArrowDown', 'ArrowUp', 'Tab'];
/**
 * Exposing the WordEvent constructor
 * @type {WordEvent}
 */
module.exports = WordEvent;
Factory.register(WordEvent);