/**
 * Proudly created by ohad on 15/01/2017.
 */
const expect          = require('chai').expect,
      Storage         = require('./storage'),
      InMemoryStorage = require('./in-memory.storage'),
      ConsoleStorage  = require('./console.storage');

describe('Storage', function () {
    this.timeout(100);
    let _storage = [];
    beforeEach(() => {
        InMemoryStorage.flush();
        _storage = []
    });
    afterEach(() => { InMemoryStorage.flush(); });
    it('save', () => {
        Storage.save('msg');
        expect(InMemoryStorage.storage[0]).to.equal('msg');
        expect(InMemoryStorage.storage).to.have.length(1);
    });
    it('in-memory are then saved to actual', (done) => {
        const tmp           = ConsoleStorage.save;
        ConsoleStorage.save = (msg) => {_storage.push(msg)};
        Storage.save('old');
        Storage.set(Storage.names.CONSOLE);
        Storage.save('new');
        setTimeout(() => {
            expect(_storage[0]).to.equal('old');
            expect(_storage[1]).to.equal('new');
            expect(_storage).to.have.length(2);
            ConsoleStorage.save = tmp;
            done();
        }, 10);
    });
});