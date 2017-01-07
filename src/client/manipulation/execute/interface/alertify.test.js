/**
 * Proudly created by ohad on 30/12/2016.
 */
let _                = require('./../../../common/util/wrapper'),
    expect           = require('chai').expect,
    AlertifyExecutor = require('./alertify');

describe('AlertifyExecutor', function () {
    this.timeout(100);
    const msg = 'no wayyy!';
    it('preconditions', () => {
        expect(AlertifyExecutor.preconditions({alertifyFn: () => {}})).to.be.true;
        expect(AlertifyExecutor.preconditions({})).to.be.false;
        expect(AlertifyExecutor.preconditions({alertifyFn: 1})).to.be.false;
    });
    it('alertify works', (done) => {
        AlertifyExecutor.execute({alertifyFn: (alertify) => {alertify.notify(msg);}});
        _.defer(() => {
            const notification = document.querySelector('.alertify-notifier');
            expect(notification).to.be.ok;
            expect(notification.textContent).to.equal(msg);
            expect(document.querySelector('div.alertify-notifier div').classList
                           .contains('ajs-visible')).to.be.true;
            AlertifyExecutor.execute({alertifyFn: (alertify) => {alertify.dismissAll();}});
            _.delay(() => {
                expect(document.querySelector('div.alertify-notifier div').classList
                               .contains('ajs-visible')).to.be.false;
                done();
            }, 20);
        });
    });
});