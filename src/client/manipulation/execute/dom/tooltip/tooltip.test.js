/**
 * Proudly created by ohad on 04/01/2017.
 */
const expect           = require('chai').expect,
      _                = require('../../../../common/util/wrapper'),
      BaseError        = require('../../../../common/log/base.error'),
      Level            = require('../../../../common/log/logger').Level,
      Storage          = require('../../../../common/storage/storage'),
      InMemoryStorage  = require('../../../../common/storage/in-memory.storage'),
      TooltipExecutor  = require('./tooltip'),
      TooltipInterface = require('./interface'),
      Master           = require('../../master'),
      styles           = require('./tooltip.scss').locals;

describe('TooltipExecutor', function () {
  this.timeout(2000);
  let div, target, options, id = 0;
  before(() => {
    div = _.div({style: {margin: '150px'}});
    document.querySelector('body').appendChild(div);
    Storage.set(Storage.names.IN_MEMORY);
  });
  beforeEach(() => {
    target = _.a({id: 'huwayej'}, 'NevoN');
    div.appendChild(target);
    options = {target: '#huwayej', type: 'bloated', htmlContent: 'Huwayej', id: ++id};
    InMemoryStorage.flush();
  });
  afterEach(() => {
    InMemoryStorage.flush();
    while (div.hasChildNodes()) {
      div.removeChild(div.lastChild);
    }
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('preconditions', () => {
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated'})
    }).to.not.throw(Error);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'sharp', direction: 'left'})
    }).to.not.throw(Error);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', htmlContent: ''})
    }).to.not.throw(Error);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', timer: {}})
    }).to.throw(BaseError);
    expect(() => {TooltipExecutor.preconditions({target: '#huwayej',})}).to.throw(BaseError);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', id: {}})
    }).to.throw(BaseError);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'bloated', htmlContent: {}})
    }).to.throw(BaseError);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'shubi-dubi'})
    }).to.throw(BaseError);
    expect(() => {
      TooltipExecutor.preconditions({target: '#huwayej', type: 'sharp', effectNum: 1})
    }).to.throw(BaseError);
  });
  it('creation', () => {
    TooltipExecutor.execute(options);
    const tooltip = document.querySelector(`div>.${styles.bloated}`);
    expect(tooltip).to.be.ok;
    expect(tooltip.classList.contains(styles.bloated)).to.be.true;
    expect(tooltip.classList.contains(styles.show)).to.be.false;
    expect(TooltipExecutor.isVisible(tooltip)).to.be.false;
    expect(tooltip.querySelector(target.nodeName)).to.be.ok;
  });
  it('interface', (done) => {
    TooltipInterface.execute(options);
    setTimeout(() => {
      const tooltip = document.querySelector(`div>.${styles.bloated}`);
      expect(tooltip).to.be.ok;
      done();
    });
  });
  it('creation with special property', () => {
    TooltipExecutor.execute(
      {target: '#huwayej', type: 'sharp', direction: 'left', id: 'sharp'});
    const tooltip = document.querySelector(`div>.${styles.sharp}`);
    expect(tooltip).to.be.ok;
    expect(tooltip.classList.contains(styles.left)).to.be.true;
    expect(tooltip.querySelector(target.nodeName)).to.be.ok;
  });
  it('flow', (done) => {
    TooltipExecutor.execute(options);
    const tooltip            = document.querySelector(`div>.${styles.bloated}`),
          content            = tooltip.querySelector(`.${styles.content}`);
    _.style(content, {transition: 'all 1ms'});
    _.trigger(Master.eventName(TooltipInterface.name),
              {state: TooltipExecutor.State.SHOW, id: id});
    setTimeout(() => {
      expect(TooltipExecutor.isVisible(tooltip)).to.be.true;
      _.trigger(Master.eventName(TooltipInterface.name),
                {state: TooltipExecutor.State.HIDE, id: id});
      setTimeout(() => {
        expect(TooltipExecutor.isVisible(tooltip)).to.be.false;
        done();
      }, 10);
    }, 10);
  });
  it('flow with timer', (done) => {
    TooltipExecutor.execute(_.extend({timer: 20}, options));
    const tooltip            = document.querySelector(`div>.${styles.bloated}`),
          content            = tooltip.querySelector(`.${styles.content}`);
    _.style(content, {transition: 'all 1ms'});
    _.trigger(Master.eventName(TooltipInterface.name), id);
    setTimeout(() => {
      expect(TooltipExecutor.isVisible(tooltip)).to.be.true;
      setTimeout(() => {
        expect(TooltipExecutor.isVisible(tooltip)).to.be.false;
        done();
      }, 20);
    }, 10);
  });
  it('flow without state', (done) => {
    TooltipExecutor.execute(options);
    const tooltip            = document.querySelector(`div>.${styles.bloated}`),
          content            = tooltip.querySelector(`.${styles.content}`);
    _.style(content, {transition: 'all 1ms'});
    _.trigger(Master.eventName(TooltipInterface.name), id);
    setTimeout(() => {
      expect(TooltipExecutor.isVisible(tooltip)).to.be.true;
      _.trigger(Master.eventName(TooltipInterface.name), id);
      setTimeout(() => {
        expect(TooltipExecutor.isVisible(tooltip)).to.be.false;
        done();
      }, 10);
    }, 10);
  });
  it('detaching tooltip', () => {
    TooltipExecutor.execute(options);
    let tooltip = document.querySelector(`div>.${styles.bloated}`);
    expect(tooltip).to.be.ok;
    TooltipExecutor.detachTooltip(target);
    tooltip = document.querySelector(`div>.${styles.bloated}`);
    //noinspection JSUnresolvedVariable
    expect(tooltip).to.not.be.ok;
  });
  it('overriding tooltip', () => {
    const msg1 = 'hum', msg2 = 'dodim';
    TooltipExecutor.execute(_.extend({}, options, {htmlContent: msg1}));
    let tooltip = document.querySelector(`div>.${styles.bloated}`);
    expect(tooltip.querySelector(`.${styles.content}`).textContent).to.equal(msg1);
    TooltipExecutor.execute(_.extend({}, options, {htmlContent: msg2}));
    tooltip = document.querySelector(`div>.${styles.bloated}`);
    expect(tooltip.querySelector(`.${styles.content}`).textContent).to.equal(msg2);
    expect(document.querySelectorAll(`div>.${styles.bloated}`).length).to.equal(1);
  });
  describe.skip('logging flow', function () {
    it('logging', (done) => {
      TooltipExecutor.execute(_.extend({}, options, {toLog: true}));
      const tooltip            = document.querySelector(`div>.${styles.bloated}`),
            content            = tooltip.querySelector(`.${styles.content}`);
      _.style(content, {transition: 'all 1ms'});
      _.trigger(Master.eventName(TooltipInterface.name), id);
      setTimeout(() => {
        // For some reason Karma behaviour is unpredictable and this test is flaky - the
        // tooltip is not always visible after first event.
        _.trigger(Master.eventName(TooltipInterface.name), id);
        setTimeout(() => {
          expect(InMemoryStorage.storage).to.have.length(3);
          for (let i = 0; i < InMemoryStorage.storage.length; i++) {
            expect(InMemoryStorage.storage[i].level).to.equal(Level.INFO.name);
          }
          done();
        }, 200);
      }, 100);
    });
    it('logging interrupted', (done) => {
      TooltipExecutor.execute(_.extend({}, options, {toLog: true}));
      const tooltip            = document.querySelector(`div>.${styles.bloated}`),
            content            = tooltip.querySelector(`.${styles.content}`);
      _.style(content, {transition: 'all 1ms'});
      _.trigger(Master.eventName(TooltipInterface.name), id);
      setTimeout(() => {
        _.trigger(Master.eventName(TooltipInterface.name), id);
        setTimeout(() => {
          expect(InMemoryStorage.storage.length).to.be.at.least(2);
          for (let i = 0; i < InMemoryStorage.storage.length; i++) {
            expect(InMemoryStorage.storage[i].level).to.equal(Level.INFO.name);
          }
          done();
        }, 200);
      }, 100);
    });
    it('log that tooltip is hidden', (done) => {
      let evilDiv = _.div({
                            style: {
                              position: 'absolute', top: '-100px', left: '-100px', width: '10000px',
                              height  : '10000px', 'background-color': 'red', 'z-index': 10000
                            }
                          });
      document.querySelector('body').appendChild(evilDiv);
      TooltipExecutor.execute(_.extend({}, options, {toLog: true}));
      const tooltip            = document.querySelector(`div>.${styles.bloated}`),
            content            = tooltip.querySelector(`.${styles.content}`);
      _.style(content, {transition: 'all 1ms'});
      _.trigger(Master.eventName(TooltipInterface.name), id);
      setTimeout(() => {
        _.trigger(Master.eventName(TooltipInterface.name), id);
        setTimeout(() => {
          let hasWarning = false;
          for (let i = 0; i < InMemoryStorage.storage.length; i++) {
            if (InMemoryStorage.storage[i].level === Level.WARNING.name) {
              hasWarning =
                true;
            }
          }
          evilDiv.parentNode.removeChild(evilDiv);
          expect(hasWarning).to.be.true;
          done();
        }, 200);
      }, 100);
    });
    it('logging overcomes delay', (done) => {
      Master.execute(TooltipInterface.name,
                     _.extend({}, options, {toLog: true, type: 'line'}));
      const tooltip = document.querySelector(`div>.${styles.line}`),
            content = tooltip.querySelector(`.${styles.content}`),
            text    = tooltip.querySelector(`.${styles.text}`);
      _.trigger(Master.eventName(TooltipInterface.name), id);
      setTimeout(() => {
        // For some reason Karma behaviour is unpredictable and this test is flaky - the
        // tooltip is not always visible after first event.
        _.trigger(Master.eventName(TooltipInterface.name), id);
        setTimeout(() => {
          expect(InMemoryStorage.storage).to.have.length(3);
          for (let i = 0; i < InMemoryStorage.storage.length; i++) {
            expect(InMemoryStorage.storage[i].level).to.equal(Level.INFO.name);
          }
          done();
        }, 800);
      }, 800);
    });
  });
});