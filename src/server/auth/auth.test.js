/**
 * Proudly created by ohad on 27/01/2017.
 */
const chai     = require('chai'),
      expect   = require('chai').expect,
      Customer = require('./customer'),
      Auth     = require('./auth');

chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));

describe('Auth', function () {
  this.timeout(1000);
  const name   = 'Amazon';
  const apiKey = 'key123';
  const url    = 'localhost';
  let amazon;
  before((done) => {
    amazon = new Customer({
      name  : name,
      apiKey: apiKey,
      url   : url
    });
    amazon.save((error) => {
      expect(error).to.not.be.ok;
      done();
    })
  });
  after((done) => {
    amazon.remove((error) => {
      expect(error).to.not.be.ok;
      done();
    });
  });
  it('resolves with customer', (done) => {
    expect(Auth.auth(amazon)).to.be.fulfilled.and.notify(done);
  });
});