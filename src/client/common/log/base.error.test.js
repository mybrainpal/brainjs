/**
 * Proudly created by ohad on 13/01/2017.
 */
const expect    = require('chai').expect,
      BaseError = require('./base.error');

describe.only('BaseError', function () {
    this.timeout(100);
    it('create instance', () => {
        const error = new BaseError('omg');
        expect(error).to.be.instanceOf(Error);
        expect(error).to.be.instanceOf(BaseError);
        expect(error).to.have.property('stack');
        expect(error.message).to.equal('omg');
    });
    it('throwable', (done) => {
        try {//noinspection ExceptionCaughtLocallyJS
            throw new BaseError()
        }
        catch (e) { done() }
    });
    // it('handled', (done) => {
    //     throw new BaseError();
    //
    // });
});
