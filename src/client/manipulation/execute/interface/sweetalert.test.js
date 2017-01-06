/**
 * Proudly created by ohad on 23/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    expect       = require('chai').expect,
    chai         = require('chai'),
    SwalExecutor = require('./sweetalert');

chai.use(require('chai-spies'));

describe('SwalExecutor', function () {
    this.timeout(100);
    const modalFn = function (sweetAlert2) {};
    it('preconditions', () => {
        expect(SwalExecutor.preconditions({modalFn: modalFn})).to.be.true;
        expect(SwalExecutor.preconditions({})).to.be.false;
        expect(SwalExecutor.preconditions({modalFn: 1})).to.be.false;
        expect(SwalExecutor.preconditions({modalFn: modalFn, id: {}})).to.be.false;
    });
    it('modal fired', (done) => {
        let options = {modalFn: modalFn}, spy = chai.spy.on(options, 'modalFn');
        SwalExecutor.execute(options);
        _.trigger(SwalExecutor.eventName());
        _.defer(function () {
            expect(spy).to.have.been.called.once;
            done();
        });
    });
});
