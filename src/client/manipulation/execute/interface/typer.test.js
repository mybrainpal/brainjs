/**
 * Proudly created by ohad on 30/12/2016.
 */
let expect        = require('chai').expect,
    chai          = require('chai'),
    TyperExecutor = require('./typer');
chai.use(require('chai-spies'));

describe('TyperExecutor', function () {
    this.timeout(100);
    let typerFn = function (typer) {};
    it('preconditions', () => {
        expect(TyperExecutor.preconditions([], {typerFn: typerFn})).to.be.true;
        expect(TyperExecutor.preconditions(document.querySelectorAll('body'),
                                           {typerFn: typerFn})).to.be.false;
        expect(TyperExecutor.preconditions([], {})).to.be.false;
        expect(TyperExecutor.preconditions([], {typerFn: 1})).to.be.false;
    });
    it('typer called', () => {
        let options = {typerFn: typerFn}, spy = chai.spy.on(options, 'typerFn');
        TyperExecutor.execute([], options);
        expect(spy).to.have.been.called.once;
    });
});