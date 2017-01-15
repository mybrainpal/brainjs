/**
 * Proudly created by ohad on 07/12/2016.
 */
let _singletonInstance;
/**
 * A CustomEvent that fires when BrainPal is ready to play.
 * @param {Object} [options]
 * @constructor
 */
function BPReadyEvent(options) {
    if (_singletonInstance) {
        return _singletonInstance;
    }
    _singletonInstance = this;
    this.options(options || {});
    this.init();
}

/**
 * Name of event to provide for CustomEvent constructor.
 * @type {string}
 */
BPReadyEvent.prototype.eventName = 'brainpal-ready';

/**
 * How often to check whether the client is ready to run BrainPal
 * @type {number}
 * @private
 */
let _checkFrequencyMs = 50;

/**
 * Indicates BrainPal ready event was already fired
 * @type {boolean}
 * @private
 */
let _ready = false;

/**
 * @returns {boolean} value of _ready.
 */
BPReadyEvent.prototype.isReady = function () { return _ready; };

/**
 * @param {Object} options
 */
BPReadyEvent.prototype.options = function (options) {};

/**
 * Initializes a CustomEvent
 */
BPReadyEvent.prototype.init = function () {
    let intervalHandler;
    this.event      = new window.CustomEvent(
        BPReadyEvent.prototype.eventName,
        {
            detail    : {
                time: new Date()
            },
            bubbles   : false,
            cancelable: true
        }
    );
    intervalHandler = setInterval(_fireIfReady, _checkFrequencyMs);
    window.addEventListener(BPReadyEvent.prototype.eventName, () => {
        clearInterval(intervalHandler);
    });
};

/**
 * Fires BPReadyEvent, when BrainPal is ready to roll.
 * @private
 */
function _fireIfReady() {
    if (!_singletonInstance) {
        return;
    }
    if (!document || !document.readyState || document.readyState === 'loading') {
        return;
    }
    _ready = true;
    //noinspection JSUnresolvedFunction
    window.dispatchEvent(_singletonInstance.event);
}

/**
 * Expose the `BPReadyEvent` constructor.
 */
module.exports = BPReadyEvent;