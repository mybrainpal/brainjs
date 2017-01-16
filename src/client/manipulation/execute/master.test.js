/**
 * Proudly created by ohad on 21/12/2016.
 */
let _         = require('../../common/util/wrapper'),
    BaseError = require('../../common/log/base.error'),
    expect    = require('chai').expect,
    Executor  = require('./master');

describe('Executor', function () {
    this.timeout(100);
    let form, input;
    before(() => {
        Executor.register('form', require('./dom/form'));
        form = document.createElement('form');
        form.setAttribute('id', 'form');
        document.querySelector('body').appendChild(form);
        input = document.createElement('input');
        input.setAttribute('id', 'input');
        form.appendChild(input);
    });
    after(() => {
        form.parentNode.removeChild(form);
    });
    it('preconditions', () => {
        expect(() => {Executor.execute('form', {target: '#input'})}).to.not.throw(Error);
        expect(() => {Executor.execute('form', {target: '#input', id: {}})}).to.throw(BaseError);
        expect(() => {Executor.execute('form', {target: '#input', on: {}})}).to.throw(BaseError);
    });
    it('execute', () => {
        Executor.execute('form', {target: '#input', focus: true});
        expect(document.activeElement).to.be.equal(input);
    });
    it('on', (done) => {
        input.blur();
        Executor.execute('form', {target: '#input', id: 1, focus: true, on: true});
        expect(document.activeElement).to.not.equal(input);
        _.trigger(Executor.eventName('form'), 2);
        setTimeout(() => {
            expect(document.activeElement).to.not.equal(input);
            _.trigger(Executor.eventName('form'), 1);
            setTimeout(() => {
                expect(document.activeElement).to.be.equal(input);
                done();
            });
        });
    });
});