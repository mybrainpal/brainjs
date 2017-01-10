/**
 * Proudly created by ohad on 18/12/2016.
 */
const expect   = require('chai').expect,
      DomUtils = require('./dom');

describe('DomUtils', function () {
    describe('event emitter', function () {
        this.timeout(100);
        let a, fired, fireFn = () => {fired = true}, index = 0;
        before(() => {
            a = document.createElement('a');
            a.setAttribute('id', 'one-hand');
            a.textContent = 'jamie';
            document.querySelector('body').appendChild(a);
        });
        beforeEach(() => {
            index++;
            fired = false;
        });
        after(() => {
            a.parentNode.removeChild(a);
        });
        it('regular event', (done) => {
            DomUtils.on(`click${index}`, fireFn, {}, a);
            DomUtils.trigger(`click${index}`, {}, a);
            setTimeout(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('selector', (done) => {
            DomUtils.on(`click${index}`, fireFn, {}, '#one-hand');
            DomUtils.trigger(`click${index}`, {}, '#one-hand');
            setTimeout(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('detail match', (done) => {
            DomUtils.on(`click${index}`, fireFn, {handCount: 1});
            DomUtils.trigger(`click${index}`, {handCount: 1});
            setTimeout(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('id', (done) => {
            DomUtils.on(`click${index}`, fireFn, 1);
            DomUtils.trigger(`click${index}`, {id: 1});
            setTimeout(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('id mismatch', (done) => {
            DomUtils.on(`click${index}`, fireFn, 2);
            DomUtils.trigger(`click${index}`, {id: 1});
            setTimeout(() => {
                expect(fired).to.be.false;
                done();
            });
        });
        it('remove listener', (done) => {
            DomUtils.on(`click${index}`, fireFn);
            DomUtils.off(`click${index}`, fireFn);
            DomUtils.trigger(`click${index}`);
            setTimeout(() => {
                expect(fired).to.be.false;
                done();
            });
        });
        it('remove listener with id', (done) => {
            let newHandler = DomUtils.on(`click${index}`, fireFn, 1);
            DomUtils.off(`click${index}`, newHandler);
            DomUtils.trigger(`click${index}`);
            setTimeout(() => {
                expect(fired).to.be.false;
                done();
            });
        });
    });
});
