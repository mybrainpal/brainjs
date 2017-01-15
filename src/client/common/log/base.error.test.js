/**
 * Proudly created by ohad on 13/01/2017.
 */
const expect          = require('chai').expect,
      BaseError       = require('./base.error'),
      Storage         = require('../storage/storage'),
      InMemoryStorage = require('../storage/in-memory.storage');

describe.only('BaseError', function () {
    this.timeout(100);
    before(() => {
        Storage.set(Storage.names.IN_MEMORY)
    });
    beforeEach(() => {
        InMemoryStorage.flush();
    });
    afterEach(() => {
        InMemoryStorage.flush();
    });
    it('create instance', () => {
        const error = new BaseError('omg');
        expect(error).to.be.instanceOf(Error);
        expect(error).to.be.instanceOf(BaseError);
        expect(error).to.have.property('stack');
        expect(error.message).to.equal('omg');
    });
    it('throwable & catchable', (done) => {
        try {//noinspection ExceptionCaughtLocallyJS
            throw new BaseError()
        }
        catch (e) { done() }
    });
    // it.only('handled', (done) => {
    //     const error = new BaseError();
    //     setTimeout(() => {
    //         expect(InMemoryStorage.storage).to.have.length(1);
    //         expect(InMemoryStorage.storage[0]).to.be.instanceOf(BaseError);
    //         expect(InMemoryStorage.storage[0]).to.equal(error);
    //         done();
    //     },5);
    //     throw error;
    // });
});
