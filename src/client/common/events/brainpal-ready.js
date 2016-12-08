/**
 * Proudly created by ohad on 07/12/2016.
 */
var _singletonInstance,
    Storage = require('../storage/storage');
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
 * @type {string} name of event, as provided to CustomEvent constructor.
 */
BPReadyEvent.prototype.eventName = 'brainpal-ready';

/**
 * @type {number} how often to check whether the client is ready to run BrainPal
 * @private
 */
var _checkFrequencyMs = 50;

/**
 * @param {Object} options
 */
BPReadyEvent.prototype.options = function (options) {};

/**
 * Initializes a CustomEvent
 */
BPReadyEvent.prototype.init = function () {
    this.event = new window.CustomEvent(
        BPReadyEvent.prototype.eventName,
        {
            detail: {
                time: new Date()
            },
            bubbles: false,
            cancelable: true
        }
    );
    var intervalHandler = setInterval(_fireIfReady, _checkFrequencyMs);
    window.addEventListener(BPReadyEvent.prototype.eventName, function () {
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
    if (!Storage.isReady()) {
        return;
    }
    window.dispatchEvent(_singletonInstance.event);
}

/**
 * Expose the `BPReadyEvent` constructor.
 */
module.exports = BPReadyEvent;