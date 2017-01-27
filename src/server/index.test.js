/**
 * Proudly created by ohad on 25/01/2017.
 */
const chai     = require('chai'),
      expect   = require('chai').expect,
      fs       = require('fs'),
      path     = require('path'),
      Customer = require('./auth/customer'),
      Main     = require('./index');

chai.use(require('chai-http'));

describe('Main', function () {
  this.timeout(1000);
  const name = 'Amazon'; // let the test fail once they become our customer ;)
  // TODO(ohad): make Amazon our customer.
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
  it('default response', (done) => {
    chai.request(Main)
        .get('/')
        .end((error, response) => {
          expect(error).to.be.ok;
          expect(response.statusCode).to.equal(404);
          expect(response.type).to.equal('text/plain');
          expect(response.text).to.equal('');
          done();
        });
  });
  it('brain.js retrieved', (done) => {
    const filename = path.resolve(__dirname, '../../dist', `${name}.js`);
    expect(fs.existsSync(filename)).to.not.be.ok;
    fs.writeFileSync(filename, 'do some shit');
    chai.request(Main)
        .get(`/serve/${name}/${apiKey}/brain.js`)
        .end((error, response) => {
          expect(error).to.not.be.ok;
          expect(response.statusCode).to.equal(200);
          expect(response.type).to.equal('application/javascript');
          fs.unlinkSync(filename);
          done();
        });
  });
  it('apiKey not found', (done) => {
    const nonExistingKey = 'broken_key';
    Customer.findOne({apiKey: nonExistingKey}, (error, customer) => {
      expect(customer).to.not.be.ok;
      chai.request(Main)
          .get(`/serve/${name}/${nonExistingKey}/brain.js`)
          .end((error, response) => {
            expect(error).to.be.ok;
            expect(response.statusCode).to.equal(403);
            expect(response.type).to.equal('text/plain');
            done();
          });
    });
  });
  it('file not found', (done) => {
    chai.request(Main)
        .get(`/serve/${name}/${apiKey}/brain.js?apiKey=`)
        .end((error, response) => {
          expect(error).to.be.ok;
          expect(response.statusCode).to.equal(500);
          expect(response.type).to.equal('text/plain');
          expect(response.text).to.equal('');
          done();
        });
  });
});