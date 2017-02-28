/**
 * Proudly created by ohad on 15/01/2017.
 */
const expect          = require('chai').expect,
      StorageInjector = require('inject-loader!./storage'),
      InMemoryStorage = require('./in-memory.storage');

describe('Storage', function () {
  this.timeout(100);
  let _consoleLogMock = [];
  const Storage       = StorageInjector({
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
  });
  it('save', () => {
    Storage.save('msg');
    expect(InMemoryStorage.storage[0]).to.equal('msg');
    expect(InMemoryStorage.storage).to.have.length(1);
  });
  it('callback', (done) => {
    const doneFn = () => {done()};
    Storage.set(Storage.names.CONSOLE, {}, doneFn);
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