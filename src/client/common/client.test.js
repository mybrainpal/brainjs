/**
 * Proudly created by ohad on 01/02/2017.
 */
const expect = require('chai').expect,
      Client = require('./client');

describe('Client', function () {
  this.timeout(1000);
  it('init', (done) => {
    Client.init(() => {
      expect(Number.isInteger(Client.id)).to.be.true;
      done();
    });
  });
  it('init without ga', (done) => {
    Client.init(() => {
      const tmp = window.ga;
      window.ga = {};
      expect(Number.isInteger(Client.id)).to.be.true;
      window.ga = tmp;
      done();
    });
  });
});