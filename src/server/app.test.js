/**
 * Proudly created by ohad on 25/01/2017.
 */
const expect = require('chai').expect,
      chai   = require('chai');

chai.use(require('chai-http'));

describe('App', function () {
  this.timeout(1000);
  it('environment variables', () => {
    expect(process.env.GCLOUD_PROJECT).to.be.ok;
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).to.be.ok;
  });
});