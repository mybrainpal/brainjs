/**
 * Proudly created by ohad on 30/12/2016.
 */
let _                = require('./../../../common/util/wrapper'),
    expect           = require('chai').expect,
    chai             = require('chai'),
    AlertifyExecutor = require('./alertify');

chai.use(require('chai-spies'));

describe('AlertifyExecutor', function () {
    this.timeout(100);
    const alertifyFn = function (alertify) {};
    it('preconditions', function () {
        expect(AlertifyExecutor.preconditions([], {alertifyFn: alertifyFn})).to.be.true;
        expect(AlertifyExecutor.preconditions(document.querySelectorAll('body'),
                                              {alertifyFn: alertifyFn})).to.be.false;
        expect(AlertifyExecutor.preconditions([], {})).to.be.false;
        expect(AlertifyExecutor.preconditions([], {alertifyFn: 1})).to.be.false;
        expect(AlertifyExecutor.preconditions([], {alertifyFn: alertifyFn, id: {}})).to.be.false;
    });
    it('alertify called', (done) => {
        let options = {alertifyFn: alertifyFn}, spy = chai.spy.on(options, 'alertifyFn');
        AlertifyExecutor.execute([], options);
        window.dispatchEvent(new CustomEvent(AlertifyExecutor.eventName()));
        _.defer(function () {
            expect(spy).to.have.been.called.once;
            done();
        });
    });
});