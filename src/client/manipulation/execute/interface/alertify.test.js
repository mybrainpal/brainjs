/**
 * Proudly created by ohad on 30/12/2016.
 */
let expect           = require('chai').expect,
    $                = require('../../../common/util/dom'),
    BaseError        = require('../../../common/log/base.error'),
    AlertifyExecutor = require('./alertify');

describe('AlertifyExecutor', function () {
  this.timeout(1000);
  const msg = 'no wayyy!';
  it('preconditions', () => {
    expect(() => {AlertifyExecutor.preconditions({alertifyFn: () => {}})}).to.not.throw(Error);
    expect(() => {AlertifyExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {AlertifyExecutor.preconditions({alertifyFn: 1})}).to.throw(BaseError);
  });
  it('alertify works', (done) => {
    AlertifyExecutor.execute({alertifyFn: (alertify) => {alertify.notify(msg);}});
    setTimeout(() => {
      const notification = $('.alertify-notifier');
      expect(notification).to.be.ok;
      expect(notification.textContent).to.equal(msg);
      expect($('div.alertify-notifier div').classList
                                           .contains('ajs-visible')).to.be.true;
      AlertifyExecutor.execute({alertifyFn: (alertify) => {alertify.dismissAll();}});
      setTimeout(() => {
        expect($('div.alertify-notifier div').classList
                                             .contains('ajs-visible')).to.be.false;
        done();
      }, 20);
    }, 100);
  });
});