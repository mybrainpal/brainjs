/**
 * Proudly created by ohad on 15/01/2017.
 */
const expect          = require('chai').expect,
      BaseError       = require('../log/base.error'),
      InMemoryStorage = require('./in-memory.storage'),
      StorageInjector = require('inject-loader!./storage');
// Defined here for autocomplete purposes.
let Storage           = require('./storage');

describe('Storage', function () {
  this.timeout(100);
  let _consoleLogMock = [];
  Storage             = StorageInjector({
                                          './console.storage': {
                                            save: (msg) => {_consoleLogMock.push(msg)}
                                          }
                                        });
  beforeEach(() => {
    InMemoryStorage.flush();
    Storage.set(Storage.names.IN_MEMORY);
    _consoleLogMock = []
  });
  afterEach(() => {
    InMemoryStorage.flush();
    Storage.set(Storage.names.IN_MEMORY);
    _consoleLogMock = [];
  });
  it('save', () => {
    Storage.save('msg');
    expect(InMemoryStorage.messages[0]).to.equal('msg');
    expect(InMemoryStorage.messages).to.have.length(1);
  });
  it('callback', (done) => {
    const doneFn = () => {done()};
    Storage.set(Storage.names.CONSOLE, {}, doneFn);
  });
  it('set errors', () => {
    expect(() => {Storage.set(Storage.names.CONSOLE + 'oh no...')}).to.throw(BaseError);
    expect(() => {//noinspection JSCheckFunctionSignatures
      Storage.set(1)
    }).to.throw(BaseError);
  });
  it('in-memory are then saved to actual', () => {
    Storage.save('old');
    Storage.set(Storage.names.CONSOLE);
    expect(_consoleLogMock[0]).to.equal('old');
    Storage.save('new');
    expect(_consoleLogMock[1]).to.equal('new');
    expect(_consoleLogMock).to.have.length(2);
  });
});