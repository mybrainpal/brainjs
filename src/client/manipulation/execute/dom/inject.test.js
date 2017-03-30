/**
 * Proudly created by ohad on 24/12/2016.
 */
let expect         = require('chai').expect,
    $              = require('../../../common/util/dom'),
    BaseError      = require('../../../common/log/base.error'),
    InjectExecutor = require('./inject');

describe('InjectExecutor', function () {
  let div, src, target, origText;
  before(() => {
    div = document.createElement('div');
    div.setAttribute('id', 'westworld');
    $('body').appendChild(div);
    src             = document.createElement('p');
    src.textContent = 'Delores';
    src.classList.add('host');
    div.appendChild(src);
    target             = document.createElement('p');
    origText           = 'The man in black';
    target.textContent = origText;
    target.classList.add('human');
    div.appendChild(target);
  });
  beforeEach(() => {
    target.textContent = origText;
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('Inject from source', () => {
    InjectExecutor.execute({target: '#westworld>.human', sourceSelector: '#westworld>.host'});
    document.querySelectorAll('#westworld>.human').forEach(function (elem) {
      expect(elem.innerHTML).to.be.equal(src.innerHTML);
    });
  });
  it('Inject from html', () => {
    InjectExecutor.execute({target: '#westworld>.human', html: 'the maze'});
    expect($('#westworld>.human').innerHTML).to.be.equal('the maze');
  });
  it('append html', () => {
    const toAppend = 'looks for the maze';
    InjectExecutor.execute(
      {target: '#westworld>.human', html: toAppend, position: 'beforeEnd'});
    expect($('#westworld>.human').innerHTML).to.be
                                            .equal(origText + toAppend);
  });
  it('Preconditions', () => {
    expect(() => {InjectExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {InjectExecutor.preconditions({target: 'body', html: 1})}).to.throw(BaseError);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', sourceSelector: 1})
    }).to.throw(BaseError);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', html: '', sourceSelector: ''})
    }).to.throw(Error);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', sourceSelector: ''})
    }).to.throw(Error);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', html: '', position: 1})
    }).to.throw(BaseError);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', sourceSelector: 'body'})
    }).to.not.throw(Error);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', html: ''})
    }).to.not.throw(Error);
    expect(() => {
      InjectExecutor.preconditions({target: 'body', html: '', position: 'beforeEnd'})
    }).to.not.throw(Error);
  })
});