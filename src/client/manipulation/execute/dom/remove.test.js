/**
 * Proudly created by ohad on 25/12/2016.
 */
let expect            = require('chai').expect,
    BaseError         = require('../../../common/log/base.error'),
    DomRemoveExecutor = require('./remove');

describe('DomRemoveExecutor', function () {
  let div, a;
  before(() => {
    div = document.createElement('div');
    div.setAttribute('id', 'div');
    document.querySelector('body').appendChild(div);
  });
  beforeEach(() => {
    a = document.createElement('a');
    div.appendChild(a);
  });
  afterEach(() => {
    for (let i = 0; i < div.children.length; i++) {
      div.children[i].parentNode.removeChild(div.children[i]);
    }
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('Remove element', () => {
    DomRemoveExecutor.execute({targets: '#div a'});
    expect(a.parentNode).to.not.be.ok;
  });
  it('Preconditions', () => {
    expect(() => {DomRemoveExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {DomRemoveExecutor.preconditions({targets: '#div a'})}).to.not.throw(Error);
  })
});