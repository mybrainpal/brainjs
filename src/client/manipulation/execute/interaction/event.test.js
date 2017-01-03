/**
 * Proudly created by ohad on 23/12/2016.
 */
let _             = require('./../../../common/util/wrapper'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    EventExecutor = require('./event');

chai.use(require('chai-spies'));

describe('EventExecutor', function () {
    this.timeout(200);
    it('preconditions', () => {
        expect(EventExecutor.preconditions([], {})).to.be.false;
        expect(EventExecutor.preconditions(document.querySelectorAll('body'),
                                           {create: {event: 'a'}})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 'a'}, waitForAll: 1})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 1}})).to.be.false;
        expect(EventExecutor.preconditions([], {listen: {}})).to.be.false;
        expect(EventExecutor.preconditions([], {listen: {event: 'a'}})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 'a', id: {}}})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 'a'}})).to.be.true;
    });
    it('event triggered without listener', (done) => {
        document.addEventListener('triggered', () => {
            done();
        });
        EventExecutor.execute([], {trigger: {event: 'triggered'}});
    });
    it('multiple triggers', (done) => {
        Promise.all([new Promise(function (resolve) {
            document.addEventListener('triggered1', () => {
                resolve();
            });
        }), new Promise(function (resolve) {
            document.addEventListener('triggered2', () => {
                resolve();
            });
        })]).then(() => {
            done();
        });
        EventExecutor.execute([], {trigger: [{event: 'triggered1'}, {event: 'triggered2'}]});
    });
    it('event triggered with listener', (done) => {
        document.addEventListener('triggered', () => {
            done();
        });
        EventExecutor.execute([], {listen: {event: 'listen'}, trigger: {event: 'triggered'}});
        document.dispatchEvent(new CustomEvent('listen'));
    });
    it('event id fires', (done) => {
        document.addEventListener('ev', () => {
            done();
        });
        EventExecutor.execute([], {listen: {event: 'listen', id: 1}, trigger: {event: 'ev'}});
        document.dispatchEvent(new CustomEvent('listen', {detail: {id: 1}}));
    });
    it('missing id still fired', (done) => {
        document.addEventListener('ev', () => {
            done();
        });
        EventExecutor.execute([], {listen: {event: 'listen'}, trigger: {event: 'ev'}});
        document.dispatchEvent(new CustomEvent('listen', {detail: {id: 1}}));
    });
    it('event id - don\'t fire', (done) => {
        document.addEventListener('ev', () => {
            done('should not have fired');
        });
        EventExecutor.execute([], {listen: {event: 'listen', id: 1}, trigger: {event: 'ev'}});
        document.dispatchEvent(new CustomEvent('listen', {detail: {id: 2}}));
        _.delay(() => {done()}, 100);
    });
    it('event triggered with multiple listeners and race', (done) => {
        document.addEventListener('triggered', () => {
            done();
        });
        EventExecutor.execute([], {
            listen: [{event: 'listen1'}, {event: 'listen2'}], trigger: {event: 'triggered'}
        });
        document.dispatchEvent(new CustomEvent('listen1'));
    });
    it('event triggered after all listeners fired', (done) => {
        let triggered = false;
        document.addEventListener('triggered', () => {
            triggered = true;
        });
        EventExecutor.execute([], {
            listen    : [{event: 'listen1'}, {event: 'listen2'}],
            waitForAll: true,
            trigger   : {event: 'triggered'}
        });
        document.dispatchEvent(new CustomEvent('listen1'));
        _.defer(() => { expect(triggered).to.be.false; });
        _.defer(() => {document.dispatchEvent(new CustomEvent('listen2'))});
        _.defer(() => {
            expect(triggered).to.be.true;
            done();
        });
    });
});
