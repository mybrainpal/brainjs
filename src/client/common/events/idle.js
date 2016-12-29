/**
 * Proudly created by ohad on 29/12/2016.
 *
 * An event that's fired after the user had been idle.
 */
const _ = require('../util/wrapper');
class IdleEvent {
    static name() {return 'brainpal-idle'};

    /**
     * @param {Object} options
     *  @property {number} waitTime - (in ms) to wait until idle event is dispatched.
     *  @property {boolean} [fireOnce = true] - whether to fire the idle event every waitTime ms,
     *     or just once.
     *  @property {EventTarget} [target = document] - event target.
     *  @property {string|number} [id]
     */
    constructor(options) {
        if (!_.isObject(options)) throw new TypeError('IdleEvent: options is invalid.');
        if (options.waitTime && _.isNumber(options.waitTime) && options.waitTime > 0) {
            this.waitTime = options.waitTime;
        } else {
            throw new TypeError('IdleEvent: waitTime missing or invalid.');
        }
        this.fireOnce = !_.has(options, 'fireOnce') || options.fireOnce;
        if (options.target) {
            if (options.target instanceof EventTarget) {
                this.target = options.target;
            } else {
                throw new TypeError('IdleEvent: target is not of instance EventTarget.');
            }
        } else {
            this.target = document;
        }
        if (options.id) {
            if (_.isString(options.id) || _.isNumber(options.id)) {
                this.id = options.id;
            } else {
                throw new TypeError('IdleEvent: id is not a string or a number.');
            }
        }
        this._init();
    }

    /**
     * Initializes the idle timer.
     * @private
     */
    _init() {
        const that = this; // To use `this` in the listener handler.
        this.start();
        for (let i = 0; i < _activeEvents.length; i++) {
            // useCapture is used so that every event will trigger reset.
            window.addEventListener(_activeEvents[i], () => {that.reset()}, true);
        }
    };

    /**
     * Resets the idle timer.
     */
    reset() {
        this.stop();
        this.start();
    };

    /**
     * Starts the idle timer.
     */
    start() {
        const that = this; // To use `this` in the setTimeout handler.
        this.timer = setTimeout(function () {
            if (_.has(that, 'id')) {
                that.target.dispatchEvent(
                    new CustomEvent(IdleEvent.name(), {detail: {id: that.id}}));
            } else {
                that.target.dispatchEvent(new CustomEvent(IdleEvent.name()));
            }
            if (_.has(that, 'fireOnce') && !that.fireOnce) that.reset();
        }, this.waitTime);
    };

    /**
     * Clears the timer.
     */
    stop() {
        if (this.timer) clearTimeout(this.timer);
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