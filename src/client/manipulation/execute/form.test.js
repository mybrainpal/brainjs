/**
 * Proudly created by ohad on 19/12/2016.
 */
var expect       = require('chai').expect,
    FormExecutor = require('./form');

describe('FormExecutor', function () {
    var form, input;
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
        FormExecutor.execute(document.querySelectorAll('#input'), {focus: true});
        expect(document.activeElement).to.be.equal(input);
    });
    it('Preconditions', function () {
        expect(FormExecutor.preconditions([], {})).to.be.false;
    })
});