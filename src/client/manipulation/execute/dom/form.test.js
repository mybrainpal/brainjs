/**
 * Proudly created by ohad on 19/12/2016.
 */
let expect       = require('chai').expect,
    FormExecutor = require('./form');

describe('FormExecutor', function () {
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
        FormExecutor.execute({target: '#input', focus: true});
        expect(document.activeElement).to.be.equal(input);
    });
    it('Preconditions', function () {
        expect(FormExecutor.preconditions({})).to.be.false;
        expect(FormExecutor.preconditions({target: '#input1'})).to.be.false;
    })
});