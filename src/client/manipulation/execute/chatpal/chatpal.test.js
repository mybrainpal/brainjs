/**
 * Proudly created by ohad on 21/03/2017.
 */
const expect     = require('chai').expect,
      _          = require('../../../common/util/wrapper'),
      BaseError  = require('../../../common/log/base.error'),
      Interface  = require('./interface'),
      styles     = require('./chatpal.scss').locals,
      testStyles = require('./chatpal.test.scss'),
      ChatPal    = require('./chatpal');

describe('ChatPal', function () {
  this.timeout(5000);
  let chatpal, origDelay, id = 1, options, longText = '';
  before(() => {
    for (let i = 0; i < 500; i++) longText += 'a';
    _.delay(() => {});
    origDelay = _.delay;
    _.load(testStyles);
    _.delay = function (cb) {
      origDelay.call(this, cb);
    }
  });
  beforeEach(() => {
    options = {
      id: id, profile: {
        name  : 'John Snow', description: 'First of his name',
        imgSrc: require('./testdata/jon-snow.jpg')
      }
    };
    chatpal = new ChatPal(options);
  });
  afterEach(() => {
    id++;
    if (chatpal) chatpal.kill();
  });
  after(() => {
    _.delay = origDelay;
  });
  it('preconditions', () => {
    expect(() => {Interface.preconditions(options)}).to.not.throw(Error);
    expect(() => {Interface.preconditions({profile: {name: 1, imgSrc: 'a'}})}).to.throw(BaseError);
    expect(() => {Interface.preconditions({profile: {name: 'a', imgSrc: 1}})}).to.throw(BaseError);
    expect(() => {Interface.preconditions({profile: {name: 'a', description: 1, imgSrc: 'a'}})})
      .to.throw(BaseError);
    expect(() => {Interface.preconditions({})}).to.throw(BaseError);
    expect(() => {Interface.preconditions(_.extend({themeColor: 1}, options))})
      .to.throw(BaseError);
  });
  it('instance created', () => {
    expect(chatpal).to.be.instanceOf(ChatPal);
  });
  it('interface', () => {
    Interface.execute(options);
    expect(document.querySelector(`#${Interface.id(id)}`)).to.be.ok;
  });
  it('open & close programmatically', (done) => {
    chatpal.open();
    setTimeout(() => {
      expect(chatpal.state).to.eq(Interface.state.OPEN);
      expect(_.isVisible(chatpal.chatBox)).to.be.true;
      chatpal.close();
      setTimeout(() => {
        expect(chatpal.state).to.eq(Interface.state.CLOSE);
        expect(_.isVisible(chatpal.chatBox)).to.be.false;
        done();
      }, 100);
    }, 100);
  });
  it('toggle', (done) => {
    chatpal.toggle();
    setTimeout(() => {
      expect(chatpal.state).to.eq(Interface.state.OPEN);
      expect(_.isVisible(chatpal.chatBox)).to.be.true;
      chatpal.toggle();
      setTimeout(() => {
        expect(chatpal.state).to.eq(Interface.state.CLOSE);
        expect(_.isVisible(chatpal.chatBox)).to.be.false;
        done();
      }, 100);
    }, 100);
  });
  it('open & close with buttons', (done) => {
    _.trigger('click', id, chatpal.buttons);
    setTimeout(() => {
      expect(chatpal.state).to.eq(Interface.state.OPEN);
      expect(_.isVisible(chatpal.chatBox)).to.be.true;
      _.trigger('click', id, chatpal.buttons);
      setTimeout(() => {
        expect(chatpal.state).to.eq(Interface.state.CLOSE);
        expect(_.isVisible(chatpal.chatBox)).to.be.false;
        done();
      }, 100);
    }, 100);
  });
  it('close with cross', (done) => {
    chatpal.open();
    setTimeout(() => {
      _.trigger('click', id, chatpal.chatBox.querySelector(`.${styles.cross}`));
      setTimeout(() => {
        expect(chatpal.state).to.eq(Interface.state.CLOSE);
        expect(_.isVisible(chatpal.chatBox)).to.be.false;
        done();
      }, 100);
    }, 100);
  });
  it('send message by clicking send', (done) => {
    chatpal.open();
    chatpal.input.value = 'que tal chica';
    _.trigger('click', id, chatpal.chatBox.querySelector(`.${styles.send} button`));
    setTimeout(() => {
      const newMessage = chatpal.messages.children[0];
      expect(newMessage.querySelector(`.${styles.bubble}`).textContent).to.eq('que tal chica');
      expect(_.isVisible(newMessage)).to.be.true;
      done();
    }, 100);
  });
  it('long message scrolls view down', (done) => {
    chatpal.open();
    expect(chatpal.messages.scrollTop).to.eq(0);

    chatpal.input.value = longText;
    _.trigger('click', id, chatpal.chatBox.querySelector(`.${styles.send} button`));
    setTimeout(() => {
      const newMessage = chatpal.messages.children[0].querySelector(`.${styles.bubble}`);
      expect(_.isVisible(newMessage)).to.be.true;
      // verifies word wrapping
      expect(newMessage.clientHeight).to.be.at.least(100);
      // verifies scroll down
      expect(chatpal.messages.scrollTop).to.be.at.least(1);
      done();
    }, 100);
  });
  it('send message by hitting enter', (done) => {
    chatpal.open();
    chatpal.input.value = 'hit me baby one more time!';
    let keyboardEvent   = new KeyboardEvent('keypress', {key: 'Enter'});
    chatpal.input.dispatchEvent(keyboardEvent);
    setTimeout(() => {
      expect(chatpal.messages.children.length).to.be.at.least(1);
      const newMessage = chatpal.messages.children[0].querySelector(`.${styles.bubble}`);
      expect(_.isVisible(newMessage)).to.be.true;
      done();
    }, 100);
  });
  it('receive message', (done) => {
    chatpal.open();
    let typed = false;
    _.on(Interface.typingEvent, () => {typed = true}, id);
    setTimeout(() => {
      chatpal.receiveMessage('it\'s britney bitch');
      setTimeout(() => {
        const newMessage = chatpal.messages.children[0].querySelector(`.${styles.bubble}`);
        expect(_.isVisible(newMessage)).to.be.true;
        expect(newMessage.textContent).to.eq('it\'s britney bitch');
        expect(typed).to.be.true;
        done();
      }, 100);
    }, 100);
  });
  it('receiving a message scrolls down view when chatpal is open', (done) => {
    chatpal.open();
    setTimeout(() => {
      expect(chatpal.messages.scrollTop).to.eq(0);
      chatpal.receiveMessage(longText);
      setTimeout(() => {
        expect(chatpal.messages.scrollTop).to.be.at.least(1);
        done();
      }, 100);
    }, 100);
  });
  it('do not type when chat box is closed', (done) => {
    let typed = false;
    _.on(Interface.typingEvent, () => {typed = true}, id);
    chatpal.receiveMessage('instant');
    setTimeout(() => {
      expect(typed).to.be.false;
      done();
    }, 100);
  });
  it('receiving a message does not scrolls down view when chatpal is close', (done) => {
    chatpal.receiveMessage(longText);
    setTimeout(() => {
      expect(chatpal.messages.children.length).to.be.at.least(1);
      expect(chatpal.messages.scrollTop).to.eq(0);
      done();
    }, 100);
  });
  it('openning chat box scrolls the view down', (done) => {
    chatpal.receiveMessage(longText);
    setTimeout(() => {
      chatpal.open();
      setTimeout(() => {
        expect(chatpal.messages.scrollTop).to.at.least(1);
        done();
      }, 100);
    }, 100);
  });
  it('receiving a notification when chat box is closed', (done) => {
    chatpal.receiveMessage('anyone home?');
    setTimeout(() => {
      expect(chatpal.notification.textContent).to.eq('1');
      expect(_.isVisible(chatpal.notification)).to.be.true;
      done();
    }, 100);
  });
  it('maximum notifications is 9', (done) => {
    for (let i = 0; i < 10; i++) chatpal.receiveMessage('anyone home?');
    setTimeout(() => {
      expect(chatpal.notification.textContent).to.eq('9');
      done();
    }, 100);
  });
  it('do not receive a notification when chat box is open', (done) => {
    chatpal.open();
    setTimeout(() => {
      chatpal.receiveMessage('anyone home?');
      setTimeout(() => {
        //noinspection BadExpressionStatementJS
        expect(chatpal.notification).to.not.be.ok;
        done();
      }, 100);
    }, 100);
  });
  it('opening chat box clears notifications', (done) => {
    chatpal.receiveMessage('my loneliness is killing me');
    setTimeout(() => {
      chatpal.open();
      setTimeout(() => {
        //noinspection BadExpressionStatementJS
        expect(chatpal.notification.parentNode).to.not.be.ok;
        expect(_.isVisible(chatpal.notification)).to.be.false;
        expect(chatpal.notification.textContent).to.eq('0');
        done();
      }, 100);
    }, 100);
  });
});