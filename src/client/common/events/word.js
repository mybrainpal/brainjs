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
     * @param {Object} options
     *  @property {Element|string} target - event target, can be a css selector.
     *  @property {number} [waitTime = 2000] - (in ms) to wait until firing the event if the
     *  input field is idle.
     *  @property {boolean} [fireOnSpace = false] - whether to fire on white space.
     *  @property {boolean} [fireOnEmpty = false] - whether to fire on empty input.
     *  @property {boolean} [fireOnEnter = true] - whether to fire once the enter key is pressed.
     *  @property {boolean} [fireOnce = true]
     *  @property {Object|string|number} [detailOrId] - for triggering.
     */
    constructor(options) {
        if (!_.isObject(options)) throw new TypeError('WordEvent: options is invalid.');
        if (_.isInteger(options.waitTime)) {
            if (options.waitTime > 0) {
                this.waitTime = options.waitTime;
            } else {
                throw new TypeError('WordEvent: waitTime must be positive.');
            }
        } else if (!_.isNil(options.waitTime)) {
            throw new TypeError('WordEvent: waitTime must be an integer.');
        } else {
            this.waitTime = 2000;
        }
        this.fireOnSpace = _.has(options, 'fireOnSpace') && options.fireOnSpace;
        this.fireOnEmpty = _.has(options, 'fireOnEmpty') && options.fireOnEmpty;
        this.fireOnEnter = !_.has(options, 'fireOnEnter') || options.fireOnEnter;
        this.fireOnce    = !_.has(options, 'fireOnce') || options.fireOnce;
        if (options.target) {
            this.target = _.isString(options.target) ? document.querySelector(options.target) :
                          options.target;
            if (!(this.target instanceof EventTarget)) {
                throw new RangeError('WordEvent: could not find target at ' + options.target);
            }
        } else {
            throw new TypeError('WordEvent: target is missing.');
        }
        if (_.isObject(options.detailOrId) || _.isNumber(options.detailOrId) ||
            _.isString(options.detailOrId)) {
            this.detailOrId = options.detailOrId;
        } else if (!_.isNil(options.detailOrId)) {
            throw new TypeError('IdleEvent: detailOrId is not an object.');
        }
        this._init();
    }

    /**
     * Initializes the event.
     * @private
     */
    _init() {
        const that               = this; // To use `this` in the listener handler.
        this.actualChangeHandler = _.on('change', () => {that.changeHandler()}, {}, this.target);
        this.actualKeyupHandler  =
            _.on('keyup', (event) => {that.keyupHandler(event)}, {}, this.target);
    };

    /**
     * Stops this word event.
     */
    stop() {
        if (this.idleEvent) this.idleEvent.stop();
        _.off('change', this.actualChangeHandler, this.target);
        _.off('keyup', this.actualKeyupHandler, this.target);
        this.fired = false;
    }

    /**
     * Handles changes.
     */
    changeHandler() {
        const that = this; // To use `this` in the listener handler.
        if (this.fireOnSpace && /\s/.test(this.target.value.slice(-1))) {
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
        _.trigger(Factory.eventName(WordEvent.name()), this.detailOrId, this.target);
        if (this.idleEvent) this.idleEvent.stop();
        this.fired = true;
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