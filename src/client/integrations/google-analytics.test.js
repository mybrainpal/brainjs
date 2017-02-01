/**
 * Proudly created by ohad on 01/02/2017.
 */
const expect          = require('chai').expect,
      GoogleAnalytics = require('./google-analytics');

describe('Integration: GoogleAnalytics', function () {
  this.timeout(1000);
  it('initialize', (done) => {
    GoogleAnalytics.init();
    GoogleAnalytics.onReady(() => {
      expect(GoogleAnalytics.isReady()).to.be.true;
      done();
    })
  });
});