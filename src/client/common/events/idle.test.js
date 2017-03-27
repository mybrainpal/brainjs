/**
 * Proudly created by ohad on 29/12/2016.
 */
const _         = require('../util/wrapper'),
      BaseError = require('../log/base.error'),
      expect    = require('chai').expect,
      Factory   = require('./factory'),
      IdleEvent = require('./idle');

describe('IdleEvent', function () {
  this.timeout(200);
  let idle, options, id = 0;
  beforeEach(() => {
    ++id;
    options = {waitTime: 10, detailOrId: id, fireOnce: true};
  });
  it('construction', () => {
    idle = new IdleEvent({});
    expect(idle).to.be.instanceof(IdleEvent);
    expect(idle.fireOnce).to.be.true;
    expect(idle.target).to.be.equal(document);
    expect(idle.waitTime).to.be.equal(60000);
  });
  it('construction should fail', () => {
    expect(() => {new IdleEvent()}).to.throw(BaseError);
    expect(() => {new IdleEvent({waitTime: '1s'})}).to.throw(BaseError);
    expect(() => {new IdleEvent({waitTime: 1.5})}).to.throw(BaseError);
    expect(() => {new IdleEvent({waitTime: 10, target: 1})}).to.throw(BaseError);
  });
  it('event fires', (done) => {
    _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
    idle = new IdleEvent(options);
  });
  it('event does fires if instance is destroyed', (done) => {
    _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
    //noinspection JSUnusedAssignment
    idle = new IdleEvent(options);
    idle = null;
  });
  it('reset works', (done) => {
    const errorFn = _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
    idle          = new IdleEvent(options);
    setTimeout(() => {idle.reset()}, 5);
    setTimeout(() => {
      _.off(Factory.eventName(IdleEvent.name()), errorFn);
      _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
    }, 12);
  });
  it('activity resets counter', (done) => {
    const errorFn = _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
    idle          = new IdleEvent(options);
    setTimeout(() => {_.trigger('click')}, 5);
    setTimeout(() => {
      _.off(Factory.eventName(IdleEvent.name()), errorFn);
      _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
    }, 12);
  });
  it('stop works', (done) => {
    _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
    idle = new IdleEvent(options);
    idle.stop();
    setTimeout(() => {done()}, 100);
  });
  it('fireOnce = true', (done) => {
    let count = 0;
    _.on(Factory.eventName(IdleEvent.name()), () => {count++;}, id);
    idle = new IdleEvent(options);
    setTimeout(() => {
      expect(count).to.be.equal(1);
      done();
    }, 50);
  });
  it('fireOnce = false', (done) => {
    let count = 0;
    _.on(Factory.eventName(IdleEvent.name()), () => {count++;}, id);
    idle = new IdleEvent(_.extend({}, options, {fireOnce: false}));
    setTimeout(() => {
      expect(count).to.be.above(1);
      done();
    }, 50);
  });
  it('multiple events', (done) => {
    let first = false, second = false;
    new IdleEvent(options);
    _.on(Factory.eventName(IdleEvent.name()), () => {first = true}, id);
    new IdleEvent(_.extend({}, options, {detailOrId: ++id}));
    _.on(Factory.eventName(IdleEvent.name()), () => {second = true}, id);
    setTimeout(() => {
      expect(first).to.be.true;
      expect(second).to.be.true;
      done();
    }, 20);
  });
  afterEach(() => {
    if (idle) idle.stop();
  });
});
