/**
 * Proudly created by ohad on 25/12/2016.
 */
let _               = require('./../../../common/util/wrapper'),
    expect          = require('chai').expect,
    DomMoveExecutor = require('./move');

describe('DomMoveExecutor', function () {
    let div, p1, p2, a, span, ul, li;
    before(() => {
        div = document.createElement('div');
        div.setAttribute('id', 'div');
        document.querySelector('body').appendChild(div);
        p1             = document.createElement('p');
        p1.textContent = 'p1';
        p1.classList.add('first');
        span = document.createElement('span');
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
    });
    afterEach(() => {
        _.forEach(document.querySelectorAll('a'), (elem) => {elem.parentNode.removeChild(elem)});
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('move based on parent', () => {
        DomMoveExecutor.execute({target: '#div a', parentSelector: '#div>.first'});
        expect(a.parentNode).to.be.equal(p1);
        expect(a.previousSibling).to.be.equal(span);
    });
    it('copy to another parent', () => {
        DomMoveExecutor.execute({target: '#div a', parentSelector: '#div>.first', copy: true});
        expect(a.parentNode).to.be.equal(p2);
        expect(p2.querySelector('a')).to.be.ok;
    });
    it('move to a ul parent', () => {
        DomMoveExecutor.execute({target: '#div a', parentSelector: '#div>ul'});
        expect(a.parentNode.nodeName).to.be.equal('LI');
        expect(a.parentNode.parentNode).to.be.equal(ul);
    });
    it('move based on sibling', () => {
        DomMoveExecutor.execute({target: '#div a', nextSiblingSelector: '#div span'});
        expect(a.parentNode).to.be.equal(p1);
        expect(_.isElement(a.previousSibling)).to.not.be.ok;
    });
    it('do not move if parent is not changed', () => {
        DomMoveExecutor.execute({target: '#div a', parentSelector: '#div>p:nth-child(2)'});
        expect(a.parentNode).to.be.equal(p2);
    });
    it('do not move if next sibling is not changed', () => {
        a.parentNode.removeChild(a);
        p1.insertBefore(a, span);
        DomMoveExecutor.execute({target: '#div a', nextSiblingSelector: '#div span'});
        expect(a.parentNode).to.be.equal(p1);
        expect(_.isElement(a.previousSibling)).to.not.be.ok;
    });
    it('Preconditions', () => {
        expect(DomMoveExecutor.preconditions([], {})).to.be.false;
        expect(DomMoveExecutor.preconditions({target: '#div a',})).to.be.false;
        expect(DomMoveExecutor.preconditions({
                                                 target        : '#div a',
                                                 parentSelector: 'effy', nextSiblingSelector: 'effy'
                                             })).to.be.false;
        expect(DomMoveExecutor.preconditions({target: 'body', parentSelector: 'div'})).to.be.false;
        expect(DomMoveExecutor.preconditions({target: 'head', parentSelector: 'div'})).to.be.false;
        expect(DomMoveExecutor.preconditions({target: 'html', parentSelector: 'div'})).to.be.false;
        expect(DomMoveExecutor.preconditions({
                                                 target             : '#div a',
                                                 parentSelector     : '#div>.first',
                                                 nextSiblingSelector: '#div'
                                             })).to.be.false;
        expect(DomMoveExecutor.preconditions(
            {target: '#div a', parentSelector: 'div', copy: 1})).to.be.false;
        expect(DomMoveExecutor.preconditions({target: '#div a', parentSelector: 'div'})).to.be.true;
        expect(DomMoveExecutor.preconditions({
                                                 target        : '#div a',
                                                 parentSelector: 'div', nextSiblingSelector: 'effy'
                                             })).to.be.true;
    })
});