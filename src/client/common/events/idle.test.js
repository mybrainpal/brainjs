/**
 * Proudly created by ohad on 29/12/2016.
 */
const _         = require('../util/wrapper'),
      chai      = require('chai'),
      expect    = require('chai').expect,
      IdleEvent = require('./idle');
chai.use(require('chai-spies'));

describe('IdleEvent', function () {
    this.timeout(200);
    let idle, options, id = 0;
    let div;
    beforeEach(() => {
        ++id;
        div = document.createElement('div');
        document.querySelector('body').appendChild(div);
        options = {waitTime: 10, target: div, detail: {id: id}, fireOnce: true};
    });
    it('construction', () => {
        idle = new IdleEvent({waitTime: 10});
        expect(idle).to.be.instanceof(IdleEvent);
        expect(idle.fireOnce).to.be.true;
        expect(idle.target).to.be.equal(document);
        expect(idle.waitTime).to.be.equal(10);
    });
    it('construction should fail', () => {
        expect(() => {new IdleEvent()}).to.throw(TypeError);
        expect(() => {new IdleEvent({})}).to.throw(TypeError);
        expect(() => {new IdleEvent({waitTime: '1s'})}).to.throw(TypeError);
        expect(() => {new IdleEvent({waitTime: 10, target: 1})}).to.throw(TypeError);
    });
    it('event fires', (done) => {
        div.addEventListener(IdleEvent.name(), _successFn(id, done));
        idle = new IdleEvent(options);
    });
    it('event does fires if instance is destroyed', (done) => {
        div.addEventListener(IdleEvent.name(), _successFn(id, done));
        //noinspection JSUnusedAssignment
        idle = new IdleEvent(options);
        idle = null;
    });
    it('reset works', (done) => {
        const errorFn = _errorFn(id, done); // in order to maintain function reference.
        div.addEventListener(IdleEvent.name(), errorFn);
        idle = new IdleEvent(options);
        _.delay(() => {idle.reset()}, 5);
        _.delay(() => {
            div.removeEventListener(IdleEvent.name(), errorFn);
            div.addEventListener(IdleEvent.name(), _successFn(id, done));
        }, 12);
    });
    it('activity resets counter', (done) => {
        const errorFn = _errorFn(id, done);
        div.addEventListener(IdleEvent.name(), errorFn);
        idle = new IdleEvent(options);
        _.delay(() => {div.dispatchEvent(new Event('click'))}, 5);
        _.delay(() => {
            div.removeEventListener(IdleEvent.name(), errorFn);
            div.addEventListener(IdleEvent.name(), _successFn(id, done));
        }, 12);
    });
    it('activity outside the target resets counter', (done) => {
        const errorFn = _errorFn(id, done);
        div.addEventListener(IdleEvent.name(), errorFn);
        idle = new IdleEvent(options);
        _.delay(() => {document.dispatchEvent(new Event('click'))}, 5);
        _.delay(() => {
            div.removeEventListener(IdleEvent.name(), errorFn);
            div.addEventListener(IdleEvent.name(), _successFn(id, done));
        }, 12);
    });
    it('stop works', (done) => {
        div.addEventListener(IdleEvent.name(), _errorFn(id, done));
        idle = new IdleEvent(options);
        _.defer(() => {idle.stop()});
        _.delay(() => {done()}, 100);
    });
    it('fireOnce = true', (done) => {
        let count = 0;
        div.addEventListener(IdleEvent.name(), _successFn(id, () => {count++;}));
        idle = new IdleEvent(options);
        _.delay(() => {
            expect(count).to.be.equal(1);
            done();
        }, 50);
    });
    it('fireOnce = false', (done) => {
        let count = 0;
        div.addEventListener(IdleEvent.name(), _successFn(id, () => {count++;}));
        idle = new IdleEvent(_.merge(_.clone(options), {fireOnce: false}));
        _.delay(() => {
            expect(count).to.be.above(1);
            done();
        }, 50);
    });
    it('multiple events', (done) => {
        let first = false, second = false;
        new IdleEvent(options);
        div.addEventListener(IdleEvent.name(), _successFn(id, () => {first = true}));
        new IdleEvent(_.merge(_.cloneDeep(options), {detail: {id: ++id}}));
        div.addEventListener(IdleEvent.name(), _successFn(id, () => {second = true}));
        _.delay(() => {
            expect(first).to.be.true;
            expect(second).to.be.true;
            done();
        }, 20);
    });
    afterEach(() => {
        if (idle) idle.stop();
        div.parentNode.removeChild(div);
    });
});

/**
 * @param {string|number} id - that was used to create the IdleEvent
 * @param {MochaDone} done - as used in the unit tests.
 * @returns {function} that invokes done with an error message if id is nil or matches
 *     event.detail.id.
 * @private
 */
function _errorFn(id, done) {
    return function (ev) {
        if (!_.isNil(id) && ev.detail.id !== id) return;
        done('too early');
    }
}

/**
 * @param {string|number} id - that was used to create the IdleEvent
 * @param {Function|MochaDone} callback
 * @returns {function} that invokes done without args if id is nil or matches event.detail.id.
 * @private
 */
function _successFn(id, callback) {
    return function (ev) {
        if (!_.isNil(id) && ev.detail.id !== id) return;
        callback();
    }
}
