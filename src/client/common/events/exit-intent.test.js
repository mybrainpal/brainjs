/**
 * Proudly created by ohad on 13/03/2017.
 */
const BaseError       = require('../log/base.error'),
      expect          = require('chai').expect,
      ExitIntentEvent = require('./exit-intent');

// TODO(ohad): test cases with proper initiation of events.
describe('ExitIntentEvent', function () {
  this.timeout(200);
  it('construction', () => {
    const exitIntent = new ExitIntentEvent({});
    expect(exitIntent).to.be.instanceof(ExitIntentEvent);
    expect(exitIntent.fireOnce).to.be.true;
    expect(exitIntent.waitTime).to.be.equal(60000);
  });
  it('construction should fail', () => {
    expect(() => {new ExitIntentEvent()}).to.throw(BaseError);
    expect(() => {new ExitIntentEvent({waitTime: '1s'})}).to.throw(BaseError);
    expect(() => {new ExitIntentEvent({waitTime: 1.5})}).to.throw(BaseError);
  });
});