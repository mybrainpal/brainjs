/**
 * Proudly created by ohad on 21/03/2017.
 */
const _         = require('../../../common/util/wrapper'),
      Logger    = require('../../../common/log/logger'),
      Level     = require('../../../common/log/logger').Level,
      BaseError = require('../../../common/log/base.error.js'),
      Master    = require('../master');

exports.name = 'chatpal';
Master.register(exports);

/**
 * Creates a chat bot instance that is intelligent and sexy!
 * @param {Object} options
 *  @property {string|number} [id]
 *  @property {string} [themeColor=#1F8CEB]
 *  @property {Object} profile - of bot identity, such as its name or its photo.
 *    @property {string} name
 *    @property {string} [description]
 *    @property {string} imgSrc
 */
exports.execute = function (options) {
  require.ensure('./chatpal', function (require) {
    const ChatPal = require('./chatpal');
    const chatPal = new ChatPal(options);
    _.trigger(exports.readyEvent(), options.id);
    _.delay(() => {
      if (_.isVisible(chatPal.buttons)) {
        if (options.toLog) {
          Logger.log(Level.INFO,
                     `ChatPal ${options.id ? options.id + ' ' : ''} created.`);
        }
      } else if (options.toLog) {
        Logger.log(Level.WARNING,
                   'Failed to create ChatPal' + (options.id ? ' ' + options.id : '') + '.');
      }
    }, 100);
  });
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
  if (!_.isNil(options.themeColor) && !_.isString(options.themeColor)) {
    throw new BaseError('ChatPal: themeColor must be nil or a string');
  }
  if (_.isNil(options.profile) || !_.isObject(options.profile)) {
    throw new BaseError('ChatPal: profile must be an object');
  }
  if (_.isNil(options.profile.name) || !_.isString(options.profile.name) ||
      !options.profile.name) {
    throw new BaseError('ChatPal: profile name must be a non-empty string');
  }
  if (_.isNil(options.profile.imgSrc) || !_.isString(options.profile.imgSrc) ||
      !options.profile.imgSrc) {
    throw new BaseError('ChatPal: profile image source must be a non-empty string');
  }
  if (!_.isNil(options.profile.description) &&
      (!_.isString(options.profile.description) || !options.profile.description)) {
    throw new BaseError('ChatPal: profile description can be nil or a non-empty string');
  }
};

/**
 * @param {string|number} id
 * @returns {string} prepends default prefix, and returns id of a ChatPal element.
 */
exports.id = function (id) {
  return 'brainpal-chatpal' + (_.isNil(id) ? '' : `-${id}`);
};

/**
 * Returns the event name that's fired once the ChatPal had been created.
 * Note the event should be dispatched from document (i.e. from default element).
 * @returns {string}
 */
exports.readyEvent = function () {
  return Master.eventName(exports.name) + '-' + 'ready';
};

/**
 * The event name that's fired every time ChatPal is typing.
 * @type {string}
 */
exports.typingEvent = Master.eventName(exports.name) + '-' + 'typing';

/**
 * State of a ChatPal instance (i.e. open).
 * @type {Object}
 */
exports.state = Object.freeze({
                                OPEN : 'OPEN',
                                CLOSE: 'CLOSE'
                              });