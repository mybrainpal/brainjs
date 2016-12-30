/**
 * Proudly created by ohad on 30/12/2016.
 */
let _              = require('./../../common/util/wrapper'),
    expect         = require('chai').expect,
    chai           = require('chai'),
    TypingExecutor = require('./typing');
chai.use(require('chai-spies'));

describe('TypingExecutor', function () {
    let typerFn = function (typer) {};
    it('preconditions', () => {
        expect(TypingExecutor.preconditions([], {typerFn: typerFn})).to.be.true;
        expect(TypingExecutor.preconditions(document.querySelectorAll('body'),
                                            {typerFn: typerFn})).to.be.false;
        expect(TypingExecutor.preconditions([], {})).to.be.false;
        expect(TypingExecutor.preconditions([], {typerFn: 1})).to.be.false;
    });
    it('typer called', () => {
        let mock = {fn: typerFn}, spy = chai.spy.on(mock, 'fn');
        TypingExecutor.execute([], {typerFn: typerFn});
        _.defer(() => {expect(spy).to.have.been.called.once});
    });
});