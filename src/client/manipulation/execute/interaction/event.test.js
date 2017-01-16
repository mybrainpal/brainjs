/**
 * Proudly created by ohad on 23/12/2016.
 */
let _             = require('../../../common/util/wrapper'),
    BaseError     = require('../../../common/log/base.error'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    EventExecutor = require('./event');

chai.use(require('chai-spies'));

describe('EventExecutor', function () {
    this.timeout(200);
    it('preconditions', () => {
        expect(() => {EventExecutor.preconditions({})}).to.throw(BaseError);
        expect(() => {
            EventExecutor.preconditions({create: {event: 'a'}, waitForAll: 1})
        }).to.throw(BaseError);
        expect(() => {EventExecutor.preconditions({create: {event: 1}})}).to.throw(BaseError);
        expect(() => {EventExecutor.preconditions({listen: {}})}).to.throw(BaseError);
        expect(() => {EventExecutor.preconditions({listen: {event: 'a'}})}).to.throw(BaseError);
        expect(() => {
            EventExecutor.preconditions({create: {event: 'a'}, callback: 1})
        }).to.throw(BaseError);
        expect(() => {
            EventExecutor.preconditions({create: {event: 'a', detailOrId: 1}})
        }).to.not.throw(Error);
        expect(() => {
            EventExecutor.preconditions({create: {event: 'a', detailOrId: {}}})
        }).to.not.throw(Error);
        expect(() => {EventExecutor.preconditions({create: {event: 'a'}})}).to.not.throw(Error);
    });
    it('event triggered without listener', (done) => {
        _.on('triggered', () => { done(); });
        EventExecutor.execute({trigger: {event: 'triggered'}});
    });
    it('multiple triggers', (done) => {
        Promise.all([new Promise((resolve) => { _.on('triggered1', resolve); }),
                     new Promise((resolve) => { _.on('triggered2', resolve); })])
               .then(() => { done(); });
        EventExecutor.execute({trigger: [{event: 'triggered1'}, {event: 'triggered2'}]});
    });
    it('event triggered with listener', (done) => {
        _.on('triggered', () => { done(); });
        EventExecutor.execute({listen: {event: 'listen'}, trigger: {event: 'triggered'}});
        _.trigger('listen');
    });
    it('callback called', (done) => {
        EventExecutor.execute({listen: {event: 'listen'}, callback: () => { done() }});
        _.trigger('listen');
    });
    it('event fires with matching detail', (done) => {
        _.on('ev', () => { done(); });
        EventExecutor.execute({listen: {event: 'listen', detailOrId: 1}, trigger: {event: 'ev'}});
        _.trigger('listen', 1);
    });
    it('missing detail still fired', (done) => {
        _.on('triggered', () => { done(); });
        EventExecutor.execute({listen: {event: 'listen'}, trigger: {event: 'triggered'}});
        _.trigger('listen', 1);
    });
    it('mismatching detail - don\'t fire', (done) => {
        _.on('ev', () => { done('should not have fired'); });
        EventExecutor.execute({listen: {event: 'listen', detailOrId: 1}, trigger: {event: 'ev'}});
        _.trigger('listen', 2);
        setTimeout(() => {done()}, 100);
    });
    it('event triggered with multiple listeners and race', (done) => {
        _.on('triggered', () => { done(); });
        EventExecutor.execute({
                                  listen : [{event: 'listen1'}, {event: 'listen2'}],
                                  trigger: {event: 'triggered'}
                              });
        _.trigger('listen2');
    });
    it('event triggered after all listeners fired', (done) => {
        let triggered = false;
        _.on('triggered', () => { triggered = true; });
        EventExecutor.execute({
                                  listen    : [{event: 'listen1'}, {event: 'listen2'}],
                                  waitForAll: true,
                                  trigger   : {event: 'triggered'}
                              });
        _.trigger('listen1');
        setTimeout(() => { expect(triggered).to.be.false });
        setTimeout(() => {_.trigger('listen2');});
        setTimeout(() => {
            expect(triggered).to.be.true;
            done();
        });
    });
});
