/**
 * Proudly created by ohad on 23/12/2016.
 */
let _             = require('./../../common/util/wrapper'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    ModalExecutor = require('./modal');

chai.use(require('chai-spies'));

describe('ModalExecutor', function () {
    let modalFn = function (sweetAlert2) {};
    it('preconditions', function () {
        expect(ModalExecutor.preconditions([], {modalFn: modalFn})).to.be.true;
        expect(ModalExecutor.preconditions(document.querySelectorAll('body'),
                                           {modalFn: modalFn})).to.be.false;
        expect(ModalExecutor.preconditions([], {})).to.be.false;
        expect(ModalExecutor.preconditions([], {modalFn: 1})).to.be.false;
        expect(ModalExecutor.preconditions([], {modalFn: modalFn, id: {}})).to.be.false;
    });
    it('modal fired', function () {
        let mock = {fn: modalFn}, spy = chai.spy.on(mock, 'fn');
        ModalExecutor.execute([], {modalFn: modalFn});
        window.dispatchEvent(new CustomEvent(ModalExecutor.eventNamePrefix));
        _.debounce(function () {
            expect(spy).to.have.been.called.once;
        });
    });
});
