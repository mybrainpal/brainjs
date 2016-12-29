/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect   = require('chai').expect,
    Executor = require('./executor');

describe('Executor', function () {
    let form, input;
    before(function () {
        form = document.createElement('form');
        form.setAttribute('id', 'form');
        document.querySelector('body').appendChild(form);
        input = document.createElement('input');
        input.setAttribute('id', 'input');
        form.appendChild(input);
    });
    after(function () {
        form.parentNode.removeChild(form);
    });
    it('Focus element', function () {
        Executor.execute('form', '#input', {specs: {focus: true}});
        expect(document.activeElement).to.be.equal(input);
    });
});