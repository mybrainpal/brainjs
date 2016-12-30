/**
 * Proudly created by ohad on 30/12/2016.
 */
let _             = require('./../../common/util/wrapper'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    TyperExecutor = require('./typer');
chai.use(require('chai-spies'));

describe('TyperExecutor', function () {
    let typerFn = function (typer) {};
    it('preconditions', () => {
        expect(TyperExecutor.preconditions([], {typerFn: typerFn})).to.be.true;
        expect(TyperExecutor.preconditions(document.querySelectorAll('body'),
                                           {typerFn: typerFn})).to.be.false;
        expect(TyperExecutor.preconditions([], {})).to.be.false;
        expect(TyperExecutor.preconditions([], {typerFn: 1})).to.be.false;
    });
    it('typer called', () => {
        let mock = {fn: typerFn}, spy = chai.spy.on(mock, 'fn');
        TyperExecutor.execute([], {typerFn: typerFn});
        _.defer(() => {expect(spy).to.have.been.called.once});
    });
});