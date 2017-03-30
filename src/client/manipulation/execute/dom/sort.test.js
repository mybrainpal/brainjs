/**
 * Proudly created by ohad on 18/12/2016.
 */
let expect       = require('chai').expect,
    $            = require('../../../common/util/dom'),
    BaseError    = require('../../../common/log/base.error'),
    SortExecutor = require('./sort'),
    tinysort     = require('tinysort');

describe('SortExecutor', function () {
  let ul, li1, li2, li3;
  beforeEach(() => {
    ul = document.createElement('ul');
    ul.setAttribute('id', 'ul');
    $('body').appendChild(ul);
    li2             = document.createElement('li');
    li2.textContent = '2';
    ul.appendChild(li2);
    li1             = document.createElement('li');
    li1.textContent = '1';
    ul.appendChild(li1);
    li3             = document.createElement('li');
    li3.textContent = '3';
    ul.appendChild(li3);
  });
  afterEach(() => {
    ul.parentNode.removeChild(ul);
  });
  it('Sort elements', () => {
    SortExecutor.execute({targets: '#ul>li'});
    expect(ul.children[0]).to.equal(li1);
    expect(ul.children[1]).to.equal(li2);
    expect(ul.children[2]).to.equal(li3);
  });
  it('don\'t sort a single element', () => {
    SortExecutor.execute({targets: '#ul:first-child'});
    expect(ul.children[0]).to.equal(li2);
    expect(ul.children[1]).to.equal(li1);
    expect(ul.children[2]).to.equal(li3);
    expect(ul.parentNode).to.equal($('body'));
  });
  it('don\'t sort zero elements', () => {
    SortExecutor.execute({targets: '#ul>a'});
    expect(ul.children[0]).to.equal(li2);
    expect(ul.children[1]).to.equal(li1);
    expect(ul.children[2]).to.equal(li3);
    expect(ul.parentNode).to.equal($('body'));
  });
  it('Preconditions', () => {
    expect(() => {SortExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {SortExecutor.preconditions({targets: '#ul>a'})}).to.throw(BaseError);
  });
});