/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect   = require('chai').expect,
    Executor = require('./master');

describe('Executor', function () {
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
    it('Focus element', () => {
        Executor.execute('form', {options: {target: '#input', focus: true}});
        expect(document.activeElement).to.be.equal(input);
    });
});