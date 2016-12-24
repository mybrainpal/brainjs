/**
 * Proudly created by ohad on 23/12/2016.
 */
var _             = require('./../../common/util/wrapper'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    EventExecutor = require('./event');

chai.use(require('chai-spies'));

describe.only('EventExecutor', function () {
    this.timeout(200);
    it('preconditions', function () {
        expect(EventExecutor.preconditions([], {})).to.be.false;
        expect(EventExecutor.preconditions(document.querySelectorAll('body'),
                                           {create: {event: 'a'}})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 'a'}, waitForAll: 1})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 1}})).to.be.false;
        expect(EventExecutor.preconditions([], {listen: {}})).to.be.false;
        expect(EventExecutor.preconditions([], {listen: {event: 'a'}})).to.be.false;
        expect(EventExecutor.preconditions([], {create: {event: 'a'}})).to.be.true;
    });
    it('event triggered without listener', function (done) {
        window.addEventListener('triggered', function () {
            done();
        });
        EventExecutor.execute([], {trigger: {event: 'triggered'}});
    });
    it('multiple triggers', function (done) {
        Promise.all([new Promise(function (resolve, reject) {
            window.addEventListener('triggered1', function () {
                resolve();
            });
        }), new Promise(function (resolve, reject) {
            window.addEventListener('triggered2', function () {
                resolve();
            });
        })]).then(function () {
            done();
        });
        EventExecutor.execute([], {trigger: [{event: 'triggered1'}, {event: 'triggered2'}]});
    });
    it('event triggered with listener', function (done) {
        window.addEventListener('triggered', function () {
            done();
        });
        EventExecutor.execute([], {listen: {event: 'listen'}, trigger: {event: 'triggered'}});
        window.dispatchEvent(new CustomEvent('listen'));
    });
    it('event triggered with multiple listeners and race', function (done) {
        window.addEventListener('triggered', function () {
            done();
        });
        EventExecutor.execute([], {
            listen: [{event: 'listen1'}, {event: 'listen2'}], trigger: {event: 'triggered'}
        });
        window.dispatchEvent(new CustomEvent('listen1'));
    });
    it('event triggered after all listeners fired', function (done) {
        var emitted = false;
        window.addEventListener('triggered', function () {
            emitted = true;
        });
        EventExecutor.execute([], {
            listen    : [{event: 'listen1'}, {event: 'listen2'}],
            waitForAll: true,
            trigger   : {event: 'triggered'}
        });
        window.dispatchEvent(new CustomEvent('listen1'));
        _.defer(function () { expect(emitted).to.be.false; });
        _.defer(function () {window.dispatchEvent(new CustomEvent('listen2'))});
        _.defer(function () {
            expect(emitted).to.be.true;
            done();
        });
    });
});
