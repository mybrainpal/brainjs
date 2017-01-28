/**
 * Proudly created by ohad on 27/01/2017.
 */
const _               = require('../util/wrapper'),
      BaseError       = require('../log/base.error'),
      expect          = require('chai').expect,
      Factory         = require('./factory'),
      VisibilityEvent = require('./visibility');

describe('VisiblityEvent', function () {
  this.timeout(200);
  let visibilityEvent, options, id = 0, a;
  before(() => {
    a             = document.createElement('a');
    a.textContent = 'now you see me';
    document.querySelector('body').appendChild(a);
  });
  after(() => {
    a.parentNode.removeChild(a);
  });
  beforeEach(() => {
    a.style.opacity = '1';
    ++id;
    options = {target: a, detailOrId: id, frequency: 5};
  });
  afterEach(() => {
    if (visibilityEvent) visibilityEvent.stop();
  });
  it('construction', () => {
    visibilityEvent = new VisibilityEvent({target: a});
    expect(visibilityEvent).to.be.instanceof(VisibilityEvent);
    expect(visibilityEvent.target).to.equal(a);
    expect(visibilityEvent.stopOnVisible).to.be.true;
    expect(visibilityEvent.frequency).to.equal(100);
    visibilityEvent.stop();
    visibilityEvent = new VisibilityEvent({
      target: a, stopOnVisible: false, frequency: 10, detailOrId: 'daniel'
    });
    expect(visibilityEvent.stopOnVisible).to.be.false;
    expect(visibilityEvent.frequency).to.equal(10);
    expect(visibilityEvent.detailOrId).to.equal('daniel');
    visibilityEvent.stop();
  });
  it('construction should fail', () => {
    expect(() => {new VisibilityEvent()}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({})}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({target: 1})}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({target: 'a#non-existing'})}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({target: a, detailOrId: () => {}})}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({target: a, frequency: 0})}).to.throw(BaseError);
    expect(() => {new VisibilityEvent({target: a, frequency: '4s'})}).to.throw(BaseError);
  });
  it('event fires', (done) => {
    _.on(Factory.eventName(VisibilityEvent.name()), () => {done()}, id, a);
    visibilityEvent = new VisibilityEvent(options);
  });
  it('event does fires if instance is destroyed', (done) => {
    _.on(Factory.eventName(VisibilityEvent.name()), () => {done()}, id, a);
    //noinspection JSUnusedAssignment
    visibilityEvent = new VisibilityEvent(options);
    visibilityEvent = null;
  });
  it('waits until element is visible', (done) => {
    const errorFn   =
            _.on(Factory.eventName(VisibilityEvent.name()), () => {done('too early')}, id, a);
    visibilityEvent = new VisibilityEvent(options);
    a.style.opacity = '0';
    setTimeout(() => {
      a.style.opacity = '1';
      _.off(Factory.eventName(VisibilityEvent.name()), errorFn, a);
      _.on(Factory.eventName(VisibilityEvent.name()), () => {done()}, id, a);
    }, 10);
  });
  it('stop works', (done) => {
    _.on(Factory.eventName(VisibilityEvent.name()), () => {done('too early')}, id, a);
    visibilityEvent = new VisibilityEvent(options);
    visibilityEvent.stop();
    setTimeout(() => {done()}, 20);
  });
  it('stopOnVisible = true', (done) => {
    let count = 0;
    _.on(Factory.eventName(VisibilityEvent.name()), () => {count++;}, id, a);
    visibilityEvent = new VisibilityEvent(_.deepExtend({}, options, {stopOnVisible: true}));
    setTimeout(() => {
      expect(count).to.be.equal(1);
      done();
    }, 20);
  });
  it('stopOnVisible = false', (done) => {
    let count = 0;
    _.on(Factory.eventName(VisibilityEvent.name()), () => {count++;}, id, a);
    visibilityEvent = new VisibilityEvent(_.deepExtend({}, options, {stopOnVisible: false}));
    setTimeout(() => {
      a.style.opacity = '0';
      setTimeout(() => {
        expect(count).to.be.above(1);
        done();
      }, 10)
    }, 10);
  });
});
