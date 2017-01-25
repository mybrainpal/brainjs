/**
 * Proudly created by ohad on 19/12/2016.
 */
let expect       = require('chai').expect,
    BaseError    = require('../../../common/log/base.error'),
    FormExecutor = require('./form');

describe('FormExecutor', function () {
  let form, input;
  before(() => {
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
    input.blur();
    FormExecutor.execute({target: '#input', focus: true});
    expect(document.activeElement).to.be.equal(input);
  });
  it('Preconditions', () => {
    expect(() => {FormExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {FormExecutor.preconditions({target: '#input1'})}).to.throw(BaseError);
  })
});