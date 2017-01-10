/**
 * Proudly created by ohad on 29/12/2016.
 */
const _         = require('../util/wrapper'),
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
        expect(() => {new IdleEvent()}).to.throw(TypeError);
        expect(() => {new IdleEvent({waitTime: '1s'})}).to.throw(TypeError);
        expect(() => {new IdleEvent({waitTime: 1.5})}).to.throw(TypeError);
        expect(() => {new IdleEvent({waitTime: 10, target: 1})}).to.throw(RangeError);
    });
    it('event fires', (done) => {
        _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
        idle = new IdleEvent(options);
    });
    it('event does fires if instance is destroyed', (done) => {
        _.on(Factory.eventName(IdleEvent.name()), () => {done()});
        //noinspection JSUnusedAssignment
        idle = new IdleEvent(options);
        idle = null;
    });
    it('reset works', (done) => {
        const errorFn = _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
        idle          = new IdleEvent(options);
        _.delay(() => {idle.reset()}, 5);
        _.delay(() => {
            _.off(Factory.eventName(IdleEvent.name()), errorFn);
            _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
        }, 12);
    });
    it('activity resets counter', (done) => {
        const errorFn = _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
        idle          = new IdleEvent(options);
        _.delay(() => {_.trigger('click')}, 5);
        _.delay(() => {
            _.off(Factory.eventName(IdleEvent.name()), errorFn);
            _.on(Factory.eventName(IdleEvent.name()), () => {done()}, id);
        }, 12);
    });
    it('stop works', (done) => {
        _.on(Factory.eventName(IdleEvent.name()), () => {done('too early')}, id);
        idle = new IdleEvent(options);
        idle.stop();
        _.delay(() => {done()}, 50);
    });
    it('fireOnce = true', (done) => {
        let count = 0;
        _.on(Factory.eventName(IdleEvent.name()), () => {count++;}, id);
        idle = new IdleEvent(options);
        _.delay(() => {
            expect(count).to.be.equal(1);
            done();
        }, 50);
    });
    it('fireOnce = false', (done) => {
        let count = 0;
        _.on(Factory.eventName(IdleEvent.name()), () => {count++;}, id);
        idle = new IdleEvent(_.merge(_.cloneDeep(options), {fireOnce: false}));
        _.delay(() => {
            expect(count).to.be.above(1);
            done();
        }, 50);
    });
    it('multiple events', (done) => {
        let first = false, second = false;
        new IdleEvent(options);
        _.on(Factory.eventName(IdleEvent.name()), () => {first = true}, id);
        new IdleEvent(_.merge(_.cloneDeep(options), {detailOrId: ++id}));
        _.on(Factory.eventName(IdleEvent.name()), () => {second = true}, id);
        _.delay(() => {
            expect(first).to.be.true;
            expect(second).to.be.true;
            done();
        }, 20);
    });
    afterEach(() => {
        if (idle) idle.stop();
    });
});
