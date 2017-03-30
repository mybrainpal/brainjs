/**
 * Proudly created by ohad on 21/03/2017.
 */
const _         = require('../../../common/util/wrapper'),
      $         = require('../../../common/util/dom'),
      Logger    = require('../../../common/log/logger'),
      Level     = require('../../../common/log/logger').Level,
      Interface = require('./interface'),
      Const     = require('../../../../common/const'),
      css       = require('./chatpal.scss');
const styles    = css.locals;

class ChatPal {
  /**
   * Creates the all mighty ChatPal
   * @param {Object} options
   *  @property {string|number} [id]
   *  @property {string} [themeColor=#1F8CEB]
   */
  constructor(options) {
    // Validity of options object is assumed to be performed in {@link #preconditions} methods.
    this.id         = options.id || 1;
    this.themeColor = options.themeColor || '#1F8CEB';
    this.profile    = {
      name       : options.profile.name,
      description: options.profile.description,
      imgSrc     : options.profile.imgSrc
    };
    this._create();
  }

  /**
   * Toggles open/close states of this ChatPal.
   * @returns {ChatPal}
   */
  toggle() {
    if (this.changing) return this;
    this.changing = true;
    if (this.state === Interface.state.OPEN) {
      this.close();
    } else {
      this.open();
    }
    _.delay.call(this, () => {this.changing = false}, 400);
    return this;
  }

  /**
   * Reveals the splendid ChatPal.
   * @returns {ChatPal}
   */
  open() {
    this.chatBox.style.display = '';
    _.delay.call(this, () => {this.chatBox.classList.remove(styles.hidden)});
    _.delay.call(this, this._scrollDown, 500);
    this.floatingImg = $.img(
      {class: styles.floatingImg, src: this.profile.imgSrc, style: {top: '400px', left: '230px'}});
    this.chatBox.appendChild(this.floatingImg);
    _.delay.call(this, () => {
      this.chatBox.querySelector(`.${styles.profile} p`).classList.add(styles.animate);
      this.chatBox.querySelector(`.${styles.profile}`).classList.add(styles.animate);
    }, 100);
    _.delay.call(this, () => {
      this.messages.classList.add(styles.animate);
      let cx = this.chatBox.querySelector(`.${styles.cx}`),
          cy = this.chatBox.querySelector(`.${styles.cy}`);
      cx.classList.add(styles.s1);
      cy.classList.add(styles.s1);
      _.delay(function () {
        cx.classList.add(styles.s2);
        cy.classList.add(styles.s2);
      }, 100);
      _.delay(function () {
        cx.classList.add(styles.s3);
        cy.classList.add(styles.s3);
      }, 200);
    }, 150);
    _.delay.call(this, () => {
      this.floatingImg.classList.add(styles.animate);
      $.style(this.floatingImg, {top: '20px', left: ''});
    });
    this.chatBox.querySelector(`.${styles.profile} p`).innerHTML    = this.profile.name;
    this.chatBox.querySelector(`.${styles.profile} span`).innerHTML = this.profile.description;
    // Reveal close button
    this.buttons.querySelector(`.${styles['open-button']}`).classList.add(styles.hidden);
    this.buttons.querySelector(`.${styles['close-button']}`).classList.remove(styles.hidden);
    this.state = Interface.state.OPEN;
    _.delay.call(this, this._checkVisibility, 200);
    return this;
  }

  /**
   * Hides the shy ChatPal.
   * @returns {ChatPal}
   */
  close() {
    this.chatBox.classList.add(styles.hidden);
    _.delay.call(this, () => {this.chatBox.style.display = 'none'}, 200);
    this.chatBox.querySelector(`.${styles.profile}`).classList.remove(styles.animate);
    this.chatBox.querySelector(`.${styles.profile} p`).classList.remove(styles.animate);
    this.chatBox.querySelector(`.${styles.messages}`).classList.remove(styles.animate);
    this.chatBox.querySelectorAll(`.${styles.cx}, .${styles.cy}`).forEach(function (item) {
      item.classList.remove(styles.s1, styles.s2, styles.s3);
    });
    $.style(this.floatingImg, {top: '400px', left: '230px'});
    this.floatingImg.classList.remove(styles.animate);
    _.delay.call(this, () => {
      if (this.floatingImg && this.floatingImg.parentNode) {
        this.floatingImg.parentNode.removeChild(this.floatingImg);
      }
    }, 300);
    // Reveal open button
    this.buttons.querySelector(`.${styles['open-button']}`).classList.remove(styles.hidden);
    this.buttons.querySelector(`.${styles['close-button']}`).classList.add(styles.hidden);
    this.state = Interface.state.CLOSE;
    return this;
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Kills this ChatPal instance.
   */
  kill() {
    if (this.chatBox && this.chatBox.parentNode) {
      this.chatBox.parentNode.removeChild(this.chatBox);
    }
    if (this.buttons && this.buttons.parentNode) {
      this.buttons.parentNode.removeChild(this.buttons);
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sends a message from ChatPal to the client.
   * @param {string} html
   */
  receiveMessage(html) {
    if (this.state === Interface.state.CLOSE) {
      this._appendMessage(this._createMessage(html, false));
      return;
    }
    let typing  = $.div({class: [styles.typing, styles.animate]},
                        $.span(), $.span(), $.span());
    let message = this._appendMessage(this._createMessage(typing, false));
    $.trigger(Interface.typingEvent, this.id);
    _.delay.call(this, () => {
      typing.classList.remove(styles.animate);
      typing.classList.add(styles['bounce-out']);
      _.delay.call(this, () => {
        const bubble = message.querySelector(`.${styles.bubble}`);
        bubble.removeChild(typing);
        bubble.insertAdjacentHTML('afterbegin', html);
        this._scrollDown();
        if (!this.playingNotification) {
          new Audio(_notificationWav).play();
          this.playingNotification = true;
          _.delay.call(this, () => {
            this.playingNotification = false;
          }, 500);
        }
      }, 400);
    }, 1500);
  }

  /**
   * Creates a DOM instances of ChatPal's elements.
   * @private
   */
  _create() {
    if (!_styleLoaded) {
      $.load(css);
      _styleLoaded = true;
    }
    this.state    = Interface.state.CLOSE;
    let height    = 0;
    const that    = this;
    //noinspection JSUnusedGlobalSymbols
    this.chatBox  = $.div(
      {
        id: Interface.id(this.id), class: [styles['chat-container'], styles.hidden],
        style                           : {display: 'none'}
      },
      $.div({class: styles.view},
            $.div({class: styles.profile, style: {backgroundColor: this.themeColor}},
                  $.div({class: styles.cross, onclick: this.close.bind(this)},
                        $.div({class: styles.cy}),
                        $.div({class: styles.cx})),
                  $.p(this.profile.name),
                  $.span(this.profile.description)),
            $.div({
                    class: styles.messages, onscroll: (ev) => {
                if (that.state === Interface.state.OPEN) return;
                if (!height) {
                  height = Number.parseInt(
                    getComputedStyle(ev.target).height.substring(0, 3));
                }
                if (ev.target.scrollHeight - ev.target.scrollTop - height < 5) {
                  that._clearNotifications();
                }
              }
                  }),
            $.div({class: styles.send},
                  $.create('input', {
                    type: 'text', value: _inputDefault, onfocus: (ev) => {
                      if (ev.target.value === _inputDefault) ev.target.value = '';
                      that.chatBox.querySelector(`.${styles.send}`).style.backgroundColor = '#fff';
                    }, onblur                                  : (ev) => {
                      if (ev.target.value === '') ev.target.value = _inputDefault;
                      that.chatBox.querySelector(`.${styles.send}`).style.backgroundColor = '';
                    }, onkeypress                              : (ev) => {
                      if (ev.key === 'Enter') that._sendMessage();
                    }
                  }),
                  $.create('button', {onclick: () => {that._sendMessage()}}))));
    this.messages = this.chatBox.querySelector(`.${styles.messages}`);
    this.input    = this.chatBox.querySelector(`.${styles.send} input`);
    this.buttons  = $.div({
                            class  : styles['button-container'],
                            style  : {backgroundColor: this.themeColor},
                            onclick: this.toggle.bind(this)
                          },
                          $.div({class: styles['open-button']}),
                          $.div({class: [styles['close-button'], styles.hidden]}));
    $('body').appendChild(this.chatBox);
    $('body').appendChild(this.buttons);
  }

  /**
   * @param {string|Element} html
   * @param {boolean} fromUser whether the message is sent from the user.
   * @returns {HTMLDivElement} the created message.
   * @private
   */
  _createMessage(html, fromUser) {
    let newMessage = $.div({class: styles.message},
                           $.img({src: this.profile.imgSrc}),
                           $.div({
                                   class: styles.bubble,
                                   style: {backgroundColor: fromUser ? this.themeColor : ''}
                                 }, html,
                                 $.div({class: styles.corner})));
    if (fromUser) newMessage.classList.add(styles.right);
    return newMessage;
  }

  /**
   * Sends input's value as a new message.
   * @return {ChatPal}
   * @private
   */
  _sendMessage() {
    this._appendMessage(
      this._createMessage(this.input.value, true));
    this._scrollDown();
    return this;
  }

  /**
   * Appends the message to the end of messages div and curate it with elegant animation. In
   * case chatpal is currently hidden, then a notification is added.
   * @param {HTMLDivElement} message - created by {@link #_createMessage}
   * @returns {HTMLDivElement} the added message.
   * @private
   */
  _appendMessage(message) {
    this.messages.appendChild(message);
    if (this.state === Interface.state.OPEN) {
      message.classList.add(styles['bounce-in']);
      _.delay.call(this, () => {
        message.classList.remove(styles['bounce-in']);
      }, 300);
      this._scrollDown();
    } else if (!message.classList.contains(styles.right)) {
      _.delay.call(this, () => {
        this._addNotification()
      });
    }
    return message;
  }

  /**
   * Scrolls the messages div to its bottom.
   */
  _scrollDown() {
    let previous   = -Number.MAX_VALUE;
    const interval = _.interval.call(this, () => {
      if (this.messages.scrollTop < this.messages.scrollHeight &&
          this.messages.scrollTop - previous >= 10) {
        previous = this.messages.scrollTop;
        this.messages.scrollTop += Math.min(this.messages.scrollHeight - this.messages.scrollTop,
                                            10);
      } else {
        this._clearNotifications();
        clearInterval(interval);
      }
    }, 10);
  }

  /**
   * Adds a notification.
   * @return {ChatPal}
   */
  _addNotification() {
    if (!this.notification || !this.notification.parentNode) {
      this.notification = $.div({class: styles.notification}, '0');
      this.buttons.appendChild(this.notification);
    }
    let val                     = Number.parseInt(this.notification.innerHTML);
    val                         = (val >= 9) ? 9 : val + 1;
    this.notification.innerHTML = val.toString();
    this.notification.classList.add(styles['bounce-in']);
    if (this.playing === false) {
      new Audio(_notificationWav).play();
      this.playing = true;
    }
    _.delay.call(this, () => {
      this.playing = false;
      this.notification.classList.remove(styles['bounce-in']);
    }, 300);
    return this;
  }

  /**
   * Clears all notifications.
   * @return {ChatPal}
   */
  _clearNotifications() {
    if (this.notification) {
      this.notification.classList.add(styles['bounce-out']);
      _.delay.call(this, () => {
        if (this.notification && this.notification.parentNode) {
          this.notification.parentNode.removeChild(this.notification);
          this.notification.innerHTML = '0';
        }
      }, 300);
    }
    return this;
  }

  /**
   * Checks that ChatPal buttons and chat box are visible, and logs a warning in case they aren't.
   * @private
   */
  _checkVisibility() {
    if (!$.isVisible(this.buttons) || !$.isVisible(this.chatBox)) {
      Logger.log(Level.WARNING,
                 'ChatPal ' + (this.id ? ' ' + this.id : '') + 'is not visible.');
    }
  }
}

/**
 * Default text to display in chat input.
 * @type {string}
 * @private
 */
const _inputDefault = 'Send message..';

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;

/**
 * Path to notification audio. May be the audio's base 64 representation.
 * @type {string}
 * @private
 */
const _notificationWav = process.env.NODE_ENV === Const.ENV.TEST ? '' : require('./img/alert.mp3');

module.exports = ChatPal;