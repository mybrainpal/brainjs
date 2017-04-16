/**
 * @author ohad
 * Proudly on 16/04/2017.
 */
const expect          = require('chai').expect,
      InMemoryStorage = require('./in-memory.storage');

describe('InMemoryStorage', function () {
  beforeEach(() => {
    InMemoryStorage.flush();
  });
  afterEach(() => {
    InMemoryStorage.flush();
  });
  it('message saved', () => {
    const message = {a: 1};
    InMemoryStorage.save(message);
    expect(InMemoryStorage.messages[0]).to.deep.equal(message);
  });
  it('messages flushed', () => {
    InMemoryStorage.save({a: 1});
    InMemoryStorage.flush();
    expect(InMemoryStorage.messages).to.be.empty;
  });
});