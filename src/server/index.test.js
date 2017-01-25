/**
 * Proudly created by ohad on 25/01/2017.
 */
const chai   = require('chai'),
      expect = require('chai').expect,
      fs     = require('fs'),
      path   = require('path'),
      Main   = require('./index');

chai.use(require('chai-http'));

describe.only('Main', function () {
  this.timeout(1000);
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
    const customer = 'Amazon'; // let the test fail once they become our customer ;)
    // TODO(ohad): make Amazon our customer.
    const filename = path.resolve(__dirname, '../../dist', `${customer}.js`);
    expect(fs.existsSync(filename)).to.not.be.ok;
    fs.writeFileSync(filename, 'do some shit');
    chai.request(Main)
        .get(`/serve/${customer}/brain.js?apiKey=`)
        .end((error, response) => {
          expect(error).to.not.be.ok;
          expect(response.statusCode).to.equal(200);
          expect(response.type).to.equal('application/javascript');
          fs.unlinkSync(filename);
          done();
        });
  });
  it('file not found', (done) => {
    const customer = 'Amazon';
    chai.request(Main)
        .get(`/serve/${customer}/brain.js?apiKey=`)
        .end((error, response) => {
          expect(error).to.be.ok;
          expect(response.statusCode).to.equal(500);
          expect(response.type).to.equal('text/plain');
          expect(response.text).to.equal('');
          done();
        });
  });
});