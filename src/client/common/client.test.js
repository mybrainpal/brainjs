/**
 * Proudly created by ohad on 01/02/2017.
 */
const expect = require('chai').expect,
      Client = require('./client');
describe.only('Client', function () {
  this.timeout(1000);
  it('init', (done) => {
    Client.init(() => {
      expect(Number.isInteger(Client.id)).to.be.true;
      done();
    });
  });
});