/**
 * Proudly created by ohad on 02/12/2016.
 */
let Client        = require('./common/client'),
    configuration = {},
    Logger        = require('./common/log/logger'),
    Level         = require('./common/log/logger').Level,
    Play = require('./play'),
    BPReadyEvent  = require('./common/events/brainpal-ready');

//noinspection JSUnusedLocalSymbols
window.BrainPal = (function (window, undefined) {
  let readyEvent;
  if (!Client.canRunBrainPal()) {
    Logger.log(Level.ERROR, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
    return;
  }

  readyEvent = new BPReadyEvent();
  // Let the games begin.
  window.addEventListener(readyEvent.eventName, function () { Play(configuration); });

})(window);
