/**
 * Proudly created by ohad on 19/12/2016.
 */
let expect       = require('chai').expect,
    $            = require('../../../common/util/dom'),
    BaseError    = require('../../../common/log/base.error'),
    FormExecutor = require('./form');

describe('FormExecutor', function () {
  let form, input;
  before(() => {
    form = $.create('form', {id: form},
                    input = $.create('input', {id: 'input'}));
    $('body').appendChild(form);
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