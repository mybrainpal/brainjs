/**
 * Proudly created by ohad on 07/01/2017.
 *
 * An event that's fired once the user had typed a word.
 * The following will make the event fire:
 * 1) A space was typed.
 * 2) The input is idle for 2 seconds.
 */
const _         = require('../util/wrapper'),
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
        if (!_.isObject(options)) throw new Error('WordEvent: options is invalid.');
        if (Number.isInteger(options.waitTime)) {
            if (options.waitTime > 0) {
                this.waitTime = options.waitTime;
            } else {
                throw new Error('WordEvent: waitTime must be positive.');
            }
        } else if (!_.isNil(options.waitTime)) {
            throw new Error('WordEvent: waitTime must be an integer.');
        } else {
            this.waitTime = 2000;
        }
        this.fireOnRegex  = _.has(options, 'fireOnRegex') && options.fireOnRegex;
        this.enforceRegex = _.has(options, 'enforceRegex') && options.enforceRegex;
        this.fireOnEmpty  = _.has(options, 'fireOnEmpty') && options.fireOnEmpty;
        this.fireOnEnter  = !_.has(options, 'fireOnEnter') || options.fireOnEnter;
        this.fireOnce     = !_.has(options, 'fireOnce') || options.fireOnce;
        if (options.regex instanceof RegExp) {
            this.regex = options.regex;
        } else if (_.isNil(options.regex)) {
            this.regex = /^[^\s]+\s$/;
        } else {
            throw new Error('WordEvent: regex must be a RegExp.');
        }
        if (this.enforceRegex && _.isNil(this.regex)) {
            throw new Error('WordEvent: regex must exist when enforceRegex is true.');
        }
        if (options.target) {
            this.target = _.isString(options.target) ? document.querySelector(options.target) :
                          options.target;
            if (!(this.target instanceof EventTarget)) {
                throw new Error('WordEvent: could not find target at ' + options.target);
            }
        } else {
            throw new Error('WordEvent: target is missing.');
        }
        if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
            _.isString(options.detailOrId)) {
            this.detailOrId = options.detailOrId;
        } else if (!_.isNil(options.detailOrId)) {
            throw new Error('IdleEvent: detailOrId is not an object.');
        }
        this._init();
    }

    /**
     * Initializes the event.
     * @private
     */
    _init() {
        const that               = this; // To use `this` in the listener handler.
        this.actualInputHandler = _.on('input', () => {that.inputHandler()}, {}, this.target);
        this.actualKeyupHandler  =
            _.on('keyup', (event) => {that.keyupHandler(event)}, {}, this.target);
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
        _.off('input', this.actualInputHandler, this.target);
        _.off('keyup', this.actualKeyupHandler, this.target);
        this.fired = false;
    }

    /**
     * Handles inputs.
     */
    inputHandler() {
        const that = this; // To use `this` in the listener handler.
        this._updateClass();
        if (this.regex && this.fireOnRegex && this.regex.test(this.target.value)) {
            if (this.fireIfShould()) return;
        }
        if (this.idleEvent) {
            this.idleEvent.reset();
        } else {
            _.on(Factory.eventName(IdleEvent.name()), () => {that.fireIfShould()}, this.detailOrId,
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
        _.trigger(Factory.eventName(WordEvent.name()), this.detailOrId, this.target);
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