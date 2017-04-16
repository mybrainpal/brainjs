/**
 * Proudly created by ohad on 25/12/2016.
 */
let _               = require('../../../common/util/wrapper'),
    $               = require('../../../common/util/dom'),
    Storage         = require('../../../common/storage/storage'),
    InMemoryStorage = require('../../../common/storage/in-memory.storage'),
    Level           = require('../../../common/log/logger').Level,
    BaseError       = require('../../../common/log/base.error'),
    expect          = require('chai').expect,
    MoveExecutor    = require('./move'),
    Master          = require('../master');

describe('MoveExecutor', function () {
  let div, p1, p2, a, span, ul, li;
  before(() => {
    Storage.set(Storage.names.IN_MEMORY);
    div = document.createElement('div');
    div.setAttribute('id', 'div');
    $('body').appendChild(div);
    p1             = document.createElement('p');
    p1.textContent = 'p1';
    p1.classList.add('first');
    span             = document.createElement('span');
    span.textContent = 'span';
    p1.appendChild(span);
    div.appendChild(p1);
    p2             = document.createElement('p');
    p2.textContent = 'p2';
    div.appendChild(p2);
    ul = document.createElement('ul');
    li = document.createElement('li');
    ul.appendChild(li);
    li.textContent = 'li';
    div.appendChild(ul);
  });
  beforeEach(() => {
    a             = document.createElement('a');
    a.textContent = 'a';
    p2.appendChild(a);
    InMemoryStorage.flush();
  });
  afterEach(() => {
    document.querySelectorAll('a').forEach((elem) => {elem.parentNode.removeChild(elem)});
    InMemoryStorage.flush();
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('move based on parent', () => {
    MoveExecutor.execute({target: '#div a', parentSelector: '#div>.first'});
    expect(a.parentNode).to.be.equal(p1);
    expect(a.previousSibling).to.be.equal(span);
  });
  it('move logged', (done) => {
    Master.execute(MoveExecutor.name,
                   {target: '#div a', parentSelector: '#div>.first', toLog: true});
    setTimeout(() => {
      expect(InMemoryStorage.messages[0].level).to.equal(Level.INFO.name);
      done();
    });
  });
  it('copy to another parent', () => {
    MoveExecutor.execute({target: '#div a', parentSelector: '#div>.first', copy: true});
    expect(a.parentNode).to.be.equal(p2);
    expect(p2.querySelector('a')).to.be.ok;
  });
  it('move to a ul parent', () => {
    MoveExecutor.execute({target: '#div a', parentSelector: '#div>ul'});
    expect(a.parentNode.nodeName).to.be.equal('LI');
    expect(a.parentNode.parentNode).to.be.equal(ul);
  });
  it('move based on sibling', () => {
    MoveExecutor.execute({target: '#div a', nextSiblingSelector: '#div span'});
    expect(a.parentNode).to.be.equal(p1);
    expect(_.isNil(a.previousSibling)).to.not.be.ok;
  });
  it('do not move if parent is not changed', () => {
    MoveExecutor.execute({target: '#div a', parentSelector: '#div>p:nth-child(2)'});
    expect(a.parentNode).to.be.equal(p2);
  });
  it('do not move if next sibling is not changed', () => {
    a.parentNode.removeChild(a);
    p1.insertBefore(a, span);
    MoveExecutor.execute({target: '#div a', nextSiblingSelector: '#div span'});
    expect(a.parentNode).to.be.equal(p1);
    expect(_.isNil(a.previousSibling)).to.not.be.ok;
  });
  it('Preconditions', () => {
    expect(() => {MoveExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {MoveExecutor.preconditions({target: '#div a',})}).to.throw(BaseError);
    expect(() => {
      MoveExecutor.preconditions({
                                   target        : '#div a',
                                   parentSelector: 'effy', nextSiblingSelector: 'effy'
                                 })
    }).to.throw(BaseError);
    expect(() => {
      MoveExecutor.preconditions({
                                   target             : '#div a',
                                   parentSelector     : '#div>.first',
                                   nextSiblingSelector: '#div'
                                 })
    }).to.throw(BaseError);
    expect(() => {
      MoveExecutor.preconditions({target: '#div a', parentSelector: 'div', copy: 1})
    }).to.throw(BaseError);
    expect(() => {
      MoveExecutor.preconditions({target: '#div a', parentSelector: 'div'})
    }).to.not.throw(Error);
    expect(() => {
      MoveExecutor.preconditions({
                                   target        : '#div a',
                                   parentSelector: 'div', nextSiblingSelector: 'effy'
                                 })
    }).to.throw(BaseError);
  })
});