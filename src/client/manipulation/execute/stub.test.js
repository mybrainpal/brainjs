/**
 * Proudly created by ohad on 19/12/2016.
 */
var expect       = require('chai').expect,
    StubExecutor = require('./stub');

describe('StubExecutor', function () {
    it('Successful execution', function () {
        expect(function () {
            StubExecutor.execute(document.querySelectorAll('nothing'), {})
        }).to.not.throw(Error);
        expect(function () {
            StubExecutor.execute([], {})
        }).to.not.throw(Error);
    });
    it('Execution throws exception', function () {
        expect(function () {//noinspection JSCheckFunctionSignatures
            StubExecutor.execute()
        }).to.throw(TypeError);
    });
    it('Preconditions true', function () {
        expect(StubExecutor.preconditions([], {})).to.be.ok;
    });
    it('Preconditions false', function () {
        //noinspection JSCheckFunctionSignatures
        expect(StubExecutor.preconditions()).to.be.false;
        expect(StubExecutor.preconditions(null, {})).to.be.false;
        //noinspection JSCheckFunctionSignatures
        expect(StubExecutor.preconditions([])).to.be.false;
        //noinspection JSCheckFunctionSignatures
        expect(StubExecutor.preconditions('body', {})).to.be.false;
        expect(StubExecutor.preconditions([], null)).to.be.false;
        expect(StubExecutor.preconditions(['a'], {})).to.be.false;
    });
});