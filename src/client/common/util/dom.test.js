/**
 * Proudly created by ohad on 18/12/2016.
 */
const _        = require('lodash'),
      expect   = require('chai').expect,
      DomUtils = require('./dom');

describe('DomUtils', function () {
    describe('text', function () {
        let ul, li;
        before(() => {
            ul = document.createElement('ul');
            ul.setAttribute('id', 'heirs');
            document.querySelector('body').appendChild(ul);
            li = document.createElement('li');
            li.classList.add('khaleesi');
            li.textContent = 'Khaleesi';
            ul.appendChild(li);
            li = document.createElement('li');
            li.classList.add('stannis');
            li.textContent = 'Stannis';
            ul.appendChild(li);
        });
        after(() => {
            ul.parentNode.removeChild(ul);
        });
        it('gets the text for selector', () => {
            expect(DomUtils.text('.khaleesi')).to.equal('Khaleesi');
        });
        it('gets the text for selector with children', () => {
            expect(DomUtils.text('#heirs')).to.equal('KhaleesiStannis');
        });
        it('gets the text for element', () => {
            expect(DomUtils.text(document.querySelector('.khaleesi'))).to.equal('Khaleesi');
        });
        it('should decode special chars', () => {
            li             = document.createElement('li');
            li.textContent = 'M\x26M';
            expect(DomUtils.text(li)).to.equal('M&M');
        });
    });
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
            _.defer(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('selector', (done) => {
            DomUtils.on(`click${index}`, fireFn, {}, '#one-hand');
            DomUtils.trigger(`click${index}`, {}, '#one-hand');
            _.defer(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('detail match', (done) => {
            DomUtils.on(`click${index}`, fireFn, {handCount: 1});
            DomUtils.trigger(`click${index}`, {handCount: 1});
            _.defer(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('id', (done) => {
            DomUtils.on(`click${index}`, fireFn, 1);
            DomUtils.trigger(`click${index}`, {id: 1});
            _.defer(() => {
                expect(fired).to.be.true;
                done();
            });
        });
        it('id mismatch', (done) => {
            DomUtils.on(`click${index}`, fireFn, 2);
            DomUtils.trigger(`click${index}`, {id: 1});
            _.defer(() => {
                expect(fired).to.be.false;
                done();
            });
        });
        it('remove listener', (done) => {
            DomUtils.on(`click${index}`, fireFn);
            DomUtils.off(`click${index}`, fireFn);
            DomUtils.trigger(`click${index}`);
            _.defer(() => {
                expect(fired).to.be.false;
                done();
            });
        });
        it('remove listener with id', (done) => {
            let newHandler = DomUtils.on(`click${index}`, fireFn, 1);
            DomUtils.off(`click${index}`, newHandler);
            DomUtils.trigger(`click${index}`);
            _.defer(() => {
                expect(fired).to.be.false;
                done();
            });
        });
    });
});
